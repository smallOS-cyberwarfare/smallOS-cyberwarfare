package main

import "os"

func main() {
	data, err := GetConfigurationDoc().Encode()
	if err != nil {
		panic(err)
	}
	os.Stdout.Write(data)
}
