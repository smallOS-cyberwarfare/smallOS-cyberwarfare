package main

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestFetchLatestIgnoreFile(t *testing.T) {
	err := fetchLatestNucleiIgnoreFile()
	require.Nil(t, err, "could not fetch latest ignore file")
}

func TestFetchLatestVersions(t *testing.T) {
	err := fetchLatestVersionsFromGithub()
	require.Nil(t, err, "could not fetch latest versions from github")
}
