package main

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	"github.com/hashicorp/go-version"
	jsoniter "github.com/json-iterator/go"
	"github.com/pkg/errors"
	"github.com/projectdiscovery/nuclei/v2/pkg/catalog/config"
	"gopkg.in/yaml.v2"
)

var (
	nucleiGlobalLatest    string
	templatesGlobalLatest string
	versionsMutex         = &sync.RWMutex{}

	nucleiIgnore []byte
	ignoreHash   string
	ignoreMutex  = &sync.RWMutex{}

	githubToken = flag.String("gh-token", os.Getenv("GH_TOKEN"), "Github API Key")
)

func main() {
	flag.Parse()

	// Run the fetchers once on startup.
	if err := fetchLatestVersionsFromGithub(); err != nil {
		log.Printf("Could not fetch latest versions: %s\n", err)
	}
	if err := fetchLatestNucleiIgnoreFile(); err != nil {
		log.Printf("Could not fetch latest ignore-file: %s\n", err)
	}
	quit := fetcherLoop()

	// /versions -> return latest version for nuclei and templates repositories
	http.HandleFunc("/versions", func(w http.ResponseWriter, r *http.Request) {
		versionsMutex.RLock()
		data := map[string]string{
			"nuclei":    nucleiGlobalLatest,
			"templates": templatesGlobalLatest,
		}
		versionsMutex.RUnlock()

		ignoreMutex.RLock()
		data["ignore-hash"] = ignoreHash
		ignoreMutex.RUnlock()

		_ = jsoniter.NewEncoder(w).Encode(data)
	})
	// /ignore -> returns the nuclei-ignore file for use in template exclusion
	http.HandleFunc("/ignore", func(w http.ResponseWriter, r *http.Request) {
		ignoreMutex.RLock()
		ignoreData := nucleiIgnore
		ignoreMutex.RUnlock()

		_, _ = w.Write(ignoreData)
	})

	server := &http.Server{Addr: "localhost:8080"}
	server.Handler = http.DefaultServeMux
	go server.ListenAndServe()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	for range c {
		close(quit)
		server.Shutdown(context.Background())
		return
	}
}

func fetcherLoop() chan struct{} {
	ticker := time.NewTicker(1 * time.Minute)
	quit := make(chan struct{})

	go func() {
		for {
			select {
			case <-ticker.C:
				if err := fetchLatestVersionsFromGithub(); err != nil {
					log.Printf("Could not fetch latest versions: %s\n", err)
				}
				if err := fetchLatestNucleiIgnoreFile(); err != nil {
					log.Printf("Could not fetch latest ignore-file: %s\n", err)
				}
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
	return quit
}

// fetchLatestVersionsFromGithub fetches latest versions of nuclei and templates repos from github
func fetchLatestVersionsFromGithub() error {
	nucleiLatest, err := githubFetchLatestTagRepo("projectdiscovery/nuclei")
	if err != nil {
		return errors.Wrap(err, "could not fetch latest nuclei-templates")
	}
	latestNucleiVersion, err := version.NewVersion(nucleiLatest)
	if err != nil {
		return errors.Wrapf(err, "could not parse version: %s", nucleiLatest)
	}

	templatesLatest, err := githubFetchLatestTagRepo("projectdiscovery/nuclei-templates")
	if err != nil {
		return errors.Wrap(err, "could not fetch latest nuclei-templates")
	}
	latestTemplatesVersion, err := version.NewVersion(templatesLatest)
	if err != nil {
		return errors.Wrapf(err, "could not parse version: %s", templatesLatest)
	}

	versionsMutex.RLock()
	currentNucleiLatest, currentTemplatesLatest := nucleiGlobalLatest, templatesGlobalLatest
	versionsMutex.RUnlock()

	if currentNucleiLatest == "" || currentTemplatesLatest == "" {
		versionsMutex.Lock()
		nucleiGlobalLatest = nucleiLatest
		templatesGlobalLatest = templatesLatest
		versionsMutex.Unlock()
		return nil
	}

	currentNucleiLatestVersion, err := version.NewVersion(currentNucleiLatest)
	if err != nil {
		return errors.Wrapf(err, "could not parse version: %s", currentNucleiLatest)
	}
	currentTemplatesLatestVersion, err := version.NewVersion(currentTemplatesLatest)
	if err != nil {
		return errors.Wrapf(err, "could not parse version: %s", currentTemplatesLatest)
	}

	if latestNucleiVersion.Compare(currentNucleiLatestVersion) == 1 || latestTemplatesVersion.Compare(currentTemplatesLatestVersion) == 1 {
		log.Printf("New versions detected: Nuclei %s (>%s) Templates %s (>%s)\n", nucleiLatest, currentNucleiLatest, templatesLatest, currentTemplatesLatest)

		versionsMutex.Lock()
		nucleiGlobalLatest = nucleiLatest
		templatesGlobalLatest = templatesLatest
		versionsMutex.Unlock()
	}
	return nil
}

const defaultIgnoreURL = "https://raw.githubusercontent.com/projectdiscovery/nuclei-templates/master/.nuclei-ignore"

// fetchLatestNucleiIgnoreFile fetches latest version of nuclei-ignore file from github
func fetchLatestNucleiIgnoreFile() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, defaultIgnoreURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", fmt.Sprintf("token %s", *githubToken))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	currentHash := fmt.Sprintf("%x", md5.Sum(body))

	ignore := &config.IgnoreFile{}
	if err := yaml.NewDecoder(bytes.NewReader(body)).Decode(ignore); err != nil {
		return err
	}

	ignoreMutex.RLock()
	if currentHash == ignoreHash {
		ignoreMutex.RUnlock()
		return nil
	}
	ignoreMutex.RUnlock()

	ignoreMutex.Lock()
	// Replace
	ignoreHash = currentHash
	nucleiIgnore = body
	ignoreMutex.Unlock()

	log.Printf("Updated nuclei-ignore by %s version\n", currentHash)
	return nil
}

type githubTagData struct {
	Name string
}

// githubFetchLatestTagRepo fetches latest tag from github
// This function was half written by github copilot AI :D.
func githubFetchLatestTagRepo(repo string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	url := fmt.Sprintf("https://api.github.com/repos/%s/tags", repo)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", fmt.Sprintf("token %s", *githubToken))

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var tags []githubTagData
	err = json.Unmarshal(body, &tags)
	if err != nil {
		return "", err
	}
	if len(tags) == 0 {
		return "", fmt.Errorf("no tags found for %s", repo)
	}
	return strings.TrimPrefix(tags[0].Name, "v"), nil
}
