package stringsutil

import (
	"testing"

	"github.com/stretchr/testify/require"
)

type betweentest struct {
	After  string
	Before string
	Result string
}

func TestBetween(t *testing.T) {
	tests := map[string]betweentest{
		"a b c":                   {After: "a", Before: "c", Result: " b "},
		"this is a test":          {After: "this", Before: "test", Result: " is a "},
		"this is a test bbb test": {After: "test", Before: "test", Result: " bbb "},
	}
	for str, test := range tests {
		res := Between(str, test.After, test.Before)
		require.Equalf(t, test.Result, res, "test: %s after: %s before: %s result: %s", str, test.After, test.Before, res)
	}
}

func TestBefore(t *testing.T) {
	tests := map[string]betweentest{
		"a b c":          {Before: "c", Result: "a b "},
		"this is a test": {Before: "test", Result: "this is a "},
	}
	for str, test := range tests {
		res := Before(str, test.Before)
		require.Equalf(t, test.Result, res, "test: %s before: %s result: %s", str, test.Before, res)
	}
}

func TestAfter(t *testing.T) {
	tests := map[string]betweentest{
		"a b c":          {After: "a", Result: " b c"},
		"this is a test": {After: "this", Result: " is a test"},
	}
	for str, test := range tests {
		res := After(str, test.After)
		require.Equalf(t, test.Result, res, "test: %s after: %s result: %s", str, test.After, res)
	}
}

type prefixsuffixtest struct {
	Prefixes []string
	Suffixes []string
	Result   interface{}
}

func TestHasPrefixAny(t *testing.T) {
	tests := map[string]prefixsuffixtest{
		"a b c":     {Prefixes: []string{"a"}, Result: true},
		"a b c d":   {Prefixes: []string{"a b", "a"}, Result: true},
		"a b c d e": {Prefixes: []string{"b", "o", "a"}, Result: true},
		"test test": {Prefixes: []string{"a", "b"}, Result: false},
	}
	for str, test := range tests {
		res := HasPrefixAny(str, test.Prefixes...)
		require.Equalf(t, test.Result, res, "test: %s prefixes: %+v result: %s", str, test.Prefixes, res)
	}
}

func TestHasSuffixAny(t *testing.T) {
	tests := map[string]prefixsuffixtest{
		"a b c":     {Suffixes: []string{"c"}, Result: true},
		"a b c d":   {Suffixes: []string{"c d", "a"}, Result: true},
		"a b c d e": {Suffixes: []string{"c", "d", "e"}, Result: true},
		"test test": {Suffixes: []string{"a", "b"}, Result: false},
	}
	for str, test := range tests {
		res := HasSuffixAny(str, test.Suffixes...)
		require.Equalf(t, test.Result, res, "test: %s suffixes: %+v result: %s", str, test.Suffixes, res)
	}
}

func TestTrimPrefixAny(t *testing.T) {
	tests := map[string]prefixsuffixtest{
		"a b c":     {Prefixes: []string{"a"}, Result: " b c"},
		"a b c d":   {Prefixes: []string{"a b", "a"}, Result: " c d"},
		"a b c d e": {Prefixes: []string{"b", "o", "a"}, Result: " b c d e"},
		"test test": {Prefixes: []string{"a", "b"}, Result: "test test"},
	}
	for str, test := range tests {
		res := TrimPrefixAny(str, test.Prefixes...)
		require.Equalf(t, test.Result, res, "test: %s prefixes: %+v result: %s", str, test.Prefixes, res)
	}
}

func TestTrimSuffixAny(t *testing.T) {
	tests := map[string]prefixsuffixtest{
		"a b c":     {Suffixes: []string{"c"}, Result: "a b "},
		"a b c d":   {Suffixes: []string{"c d", "a"}, Result: "a b "},
		"a b c d e": {Suffixes: []string{"e"}, Result: "a b c d "},
		"test test": {Suffixes: []string{"a", "b"}, Result: "test test"},
	}
	for str, test := range tests {
		res := TrimSuffixAny(str, test.Suffixes...)
		require.Equalf(t, test.Result, res, "test: %s suffixes: %+v result: %s", str, test.Suffixes, res)
	}
}

type jointest struct {
	Items     []interface{}
	Separator string
	Result    string
}

func TestJoin(t *testing.T) {
	tests := []jointest{
		{Items: []interface{}{"a"}, Separator: "", Result: "a"},
		{Items: []interface{}{"a", "b"}, Separator: ",", Result: "a,b"},
		{Items: []interface{}{"a", "b", 1}, Separator: ",", Result: "a,b,1"},
		{Items: []interface{}{2, "b", 1}, Separator: "", Result: "2b1"},
	}
	for _, test := range tests {
		res := Join(test.Items, test.Separator)
		require.Equalf(t, test.Result, res, "test: %+v", test)
	}
}

func TestHasPrefixI(t *testing.T) {
	tests := map[string]prefixsuffixtest{
		"a b c":   {Prefixes: []string{"a"}, Result: true},
		"A b c d": {Prefixes: []string{"a"}, Result: true},
		"Ab c d":  {Prefixes: []string{"b"}, Result: false},
	}
	for str, test := range tests {
		res := HasPrefixI(str, test.Prefixes[0])
		require.Equalf(t, test.Result, res, "test: %s prefixes: %+v result: %s", str, test.Prefixes, res)
	}
}

func TestHasSuffixI(t *testing.T) {
	tests := map[string]prefixsuffixtest{
		"a b c":  {Prefixes: []string{"c"}, Result: true},
		"A b C":  {Prefixes: []string{"c"}, Result: true},
		"Ab c d": {Prefixes: []string{"c"}, Result: false},
	}
	for str, test := range tests {
		res := HasSuffixI(str, test.Prefixes[0])
		require.Equalf(t, test.Result, res, "test: %s suffixes: %+v result: %s", str, test.Suffixes, res)
	}
}

func TestReverse(t *testing.T) {
	tests := map[string]string{
		"abc":    "cba",
		"A b C":  "C b A",
		"Ab c d": "d c bA",
	}
	for str, expRes := range tests {
		res := Reverse(str)
		require.Equalf(t, expRes, res, "test: %s expected: %+v result: %s", str, expRes, res)
	}
}

type containstest struct {
	Items  []string
	Result bool
}

func TestContainsAny(t *testing.T) {
	tests := map[string]containstest{
		"abc":   {Items: []string{"a", "b"}, Result: true},
		"abcd":  {Items: []string{"x", "b"}, Result: true},
		"A b C": {Items: []string{"x"}, Result: false},
	}
	for str, test := range tests {
		res := ContainsAny(str, test.Items...)
		require.Equalf(t, test.Result, res, "test: %+v", res)
	}
}

func TestEqualFoldAny(t *testing.T) {
	tests := map[string]containstest{
		"abc":   {Items: []string{"a", "Abc"}, Result: true},
		"abcd":  {Items: []string{"x", "ABcD"}, Result: true},
		"A b C": {Items: []string{"x"}, Result: false},
	}
	for str, test := range tests {
		res := EqualFoldAny(str, test.Items...)
		require.Equalf(t, test.Result, res, "test: %+v", res)
	}
}

type attest struct {
	After  int
	Search string
	Result interface{}
}

func TestIndexAt(t *testing.T) {
	tests := map[string]attest{
		"a a b":          {After: 1, Search: "a", Result: 2},
		"test":           {After: 1, Search: "t", Result: 3},
		"test test":      {After: 4, Search: "test", Result: 5},
		"test test test": {After: 0, Search: "test", Result: 0},
	}
	for str, test := range tests {
		res := IndexAt(str, test.Search, test.After)
		require.Equalf(t, test.Result, res, "test: %s after: %d search: %s result: %d", str, test.After, test.Search, res)
	}
}
