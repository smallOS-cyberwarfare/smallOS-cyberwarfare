package zbase32_test

import (
	"bytes"
	"fmt"
	"os"

	"gopkg.in/corvus-ch/zbase32.v1"
)

func Example() {
	s := zbase32.StdEncoding.EncodeToString([]byte{240, 191, 199})
	fmt.Println(s)
	// Output:
	// 6n9hq
}

func ExampleEncoding_EncodeToString() {
	data := []byte("any + old & data")
	str := zbase32.StdEncoding.EncodeToString(data)
	fmt.Println(str)
	// Output:
	// cfz81ebmrbzsa3byraogeamwcr
}

func ExampleEncoding_DecodeString() {
	str := "qpzs43jyctozeajyq7wze4byyyogn5urrdz5zxa"
	data, err := zbase32.StdEncoding.DecodeString(str)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	fmt.Printf("%q\n", data)
	// Output:
	// "some data with \x00 and \ufeff"
}

func ExampleNewEncoder() {
	input := []byte("foo\x00bar")
	encoder := zbase32.NewEncoder(zbase32.StdEncoding, os.Stdout)
	encoder.Write(input)
	// Must close the encoder when finished to flush any partial blocks.
	// If you comment out the following line, the last partial block "r"
	// won't be encoded.
	encoder.Close()
	// Output:
	// c3zs6ydncf3y
}

func ExampleNewDecoder() {
	input := []byte("c3zs6ydncf3y")
	decoder := zbase32.NewDecoder(zbase32.StdEncoding, bytes.NewReader(input))
	output := make([]byte, 16)
	n, err := decoder.Read(output)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	fmt.Println(output[:n])
	// Output:
	// [102 111 111 0 98 97 114]
}
