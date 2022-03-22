package fileutil

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestFileExists(t *testing.T) {
	tests := map[string]bool{
		"file.go": true,
		"aaa.bbb": false,
		"/":       false,
	}
	for fpath, mustExist := range tests {
		exist := FileExists(fpath)
		require.Equalf(t, mustExist, exist, "invalid \"%s\": %s", fpath, exist)
	}
}

func TestFolderExists(t *testing.T) {
	tests := map[string]bool{
		".":           true,
		"../fileutil": true,
		"aabb":        false,
	}
	for fpath, mustExist := range tests {
		exist := FolderExists(fpath)
		require.Equalf(t, mustExist, exist, "invalid \"%s\"", fpath)
	}
}

func TestDeleteFilesOlderThan(t *testing.T) {
	// create a temporary folder with a couple of files
	fo, err := os.MkdirTemp("", "")
	require.Nil(t, err, "couldn't create folder: %s", err)

	// defer temporary folder removal
	defer os.RemoveAll(fo)

	fi, err := os.CreateTemp(fo, "")
	require.Nil(t, err, "couldn't create folder: %s", err)
	fiName1 := fi.Name()
	fi.Close()
	fi, err = os.CreateTemp(fo, "")
	require.Nil(t, err, "couldn't create folder: %s", err)
	fiName2 := fi.Name()
	fi.Close()

	ttl := time.Duration(5 * time.Second)

	// sleep for 5 seconds
	time.Sleep(5 * time.Second)

	// delete files older than 5 seconds
	err = DeleteFilesOlderThan(fo, ttl, nil)
	require.Nil(t, err, "couldn't create folder: %s", err)

	// check that the files don't exist anymore
	require.False(t, FileExists(fiName1), "file \"%s\" still exists", fiName1)
	require.False(t, FileExists(fiName2), "file \"%s\" still exists", fiName2)
}

func TestDownloadFile(t *testing.T) {
	// attempt to download http://ipv4.download.thinkbroadband.com/5MB.zip to temp folder
	tmpfile, err := os.CreateTemp("", "")
	require.Nil(t, err, "couldn't create folder: %s", err)
	fname := tmpfile.Name()

	os.Remove(fname)

	err = DownloadFile(fname, "http://ipv4.download.thinkbroadband.com/5MB.zip")
	require.Nil(t, err, "couldn't download file: %s", err)

	require.True(t, FileExists(fname), "file \"%s\" doesn't exists", fname)

	// remove the downloaded file
	os.Remove(fname)
}

func tmpFolderName(s string) string {
	return filepath.Join(os.TempDir(), s)
}
func TestCreateFolders(t *testing.T) {
	tests := []string{
		tmpFolderName("a"),
		tmpFolderName("b"),
	}
	err := CreateFolders(tests...)
	require.Nil(t, err, "couldn't download file: %s", err)

	for _, folder := range tests {
		fexists := FolderExists(folder)
		require.True(t, fexists, "folder %s doesn't exist", fexists)
	}

	// remove folders
	for _, folder := range tests {
		os.Remove(folder)
	}
}

func TestCreateFolder(t *testing.T) {
	tst := tmpFolderName("a")
	err := CreateFolder(tst)
	require.Nil(t, err, "couldn't download file: %s", err)

	fexists := FolderExists(tst)
	require.True(t, fexists, "folder %s doesn't exist", fexists)

	os.Remove(tst)
}

func TestHasStdin(t *testing.T) {
	require.False(t, HasStdin(), "stdin in test")
}

func TestReadFile(t *testing.T) {
	fileContent := `test
	test1
	test2`
	f, err := os.CreateTemp("", "")
	require.Nil(t, err, "couldn't create file: %s", err)
	fname := f.Name()
	f.Write([]byte(fileContent))
	f.Close()
	defer os.Remove(fname)

	fileContentLines := strings.Split(fileContent, "\n")
	// compare file lines
	c, err := ReadFile(fname)
	require.Nil(t, err, "couldn't open file: %s", err)
	i := 0
	for line := range c {
		require.Equal(t, fileContentLines[i], line, "lines don't match")
		i++
	}
}

func TestReadFileWithBufferSize(t *testing.T) {
	fileContent := `test
	test1
	test2`
	f, err := os.CreateTemp("", "")
	require.Nil(t, err, "couldn't create file: %s", err)
	fname := f.Name()
	f.Write([]byte(fileContent))
	f.Close()
	defer os.Remove(fname)

	fileContentLines := strings.Split(fileContent, "\n")
	// compare file lines
	c, err := ReadFileWithBufferSize(fname, 64*1024)
	require.Nil(t, err, "couldn't open file: %s", err)
	i := 0
	for line := range c {
		require.Equal(t, fileContentLines[i], line, "lines don't match")
		i++
	}
}
