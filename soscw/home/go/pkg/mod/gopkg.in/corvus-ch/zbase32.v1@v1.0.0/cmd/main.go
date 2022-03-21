package main

import (
	"fmt"
	"io"
	"os"

	"github.com/droundy/goopt"
	"gopkg.in/corvus-ch/zbase32.v1"
)

const success = 0
const generalError = 1

var inputFlag = goopt.StringWithLabel([]string{"-i", "--input"}, "-", "PATH", "Input file (defaults to STDIN)")
var outputFlag = goopt.StringWithLabel([]string{"-o", "--output"}, "-", "PATH", "Output file (defaults to STDOUT)")
var decodeFlag = goopt.Flag([]string{"-D", "--decode"}, nil, "Decodes the input", "")

func main() {
	os.Exit(run())
}

func run() int {
	goopt.Parse(nil)

	input, err := getInput(*inputFlag)
	defer input.Close()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to open %s for input.\n", *inputFlag)
		return generalError
	}

	output, err := getOutput(*outputFlag)
	defer output.Close()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to open %s for output.\n", *outputFlag)
		return generalError
	}

	if *decodeFlag {
		if err := decode(input, output); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to decode data: %v\n", err)
			return generalError
		}
	} else {
		if err := encode(input, output); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to encode data: %v\n", err)
			return generalError
		}
	}

	return success
}

func getInput(path string) (*os.File, error) {
	if len(path) == 0 || path == "-" {
		return os.Stdin, nil
	}

	return os.Open(path)
}

func getOutput(path string) (*os.File, error) {
	if len(path) == 0 || path == "-" {
		return os.Stdout, nil
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		return os.Create(path)
	}

	return os.Open(path)
}

func decode(input io.Reader, output io.Writer) error {
	stream := zbase32.NewDecoder(zbase32.StdEncoding, input)
	_, err := io.Copy(output, stream)

	return err
}

func encode(input io.Reader, output io.Writer) error {
	stream := zbase32.NewEncoder(zbase32.StdEncoding, output)
	defer stream.Close()
	_, err := io.Copy(stream, input)

	return err
}
