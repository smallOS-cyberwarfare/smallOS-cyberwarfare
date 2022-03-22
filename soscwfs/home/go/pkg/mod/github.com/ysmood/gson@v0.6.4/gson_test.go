package gson_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
	"testing"

	"github.com/ysmood/gson"
)

func ExampleJSON() {
	obj := gson.NewFrom(`{"a": {"b": [1, 2]}}`)

	fmt.Println(obj.Get("a.b.0").Int())

	obj.Set("a.b.1", "ok").Set("c", 2)
	fmt.Println(">", obj.JSON("> ", "  "))

	// Output:
	// 1
	// > {
	// >   "a": {
	// >     "b": [
	// >       1,
	// >       "ok"
	// >     ]
	// >   },
	// >   "c": 2
	// > }
}

func Test(t *testing.T) {
	eq := genEq(t)

	eq(gson.NewFrom("true").Bool(), true)
	eq(gson.New([]byte("10")).Int(), 10)
	eq(gson.New(10).Int(), 10)
	eq(gson.New(gson.New(10)).Int(), 10)
	eq(gson.JSON{}.Int(), 0)
	eq(gson.JSON{}.JSON("", ""), "null")
	eq(gson.New(nil).Num(), 0.0)
	eq(gson.New(nil).Bool(), false)

	buf := bytes.NewBufferString("10")
	fromBuf := gson.New(buf)
	eq(fromBuf.Int(), 10)
	eq(fromBuf.Int(), 10)

	b, _ := n(`"ok"`).MarshalJSON()
	eq(string(b), `"ok"`)

	eq(gson.New([]byte(`ok"`)).Raw(), []byte(`ok"`))
	eq(n(`"ok"`).Str(), "ok")
	eq(n(`1`).Str(), "1")
	eq(n(`1.2`).Num(), 1.2)
	eq(n(`"ok"`).Num(), 0.0)
	eq(n(`1`).Int(), 1)
	eq(n(`"ok"`).Int(), 0)
	eq(n(`true`).Bool(), true)
	eq(n(`1`).Bool(), false)
	eq(n(`null`).Nil(), true)

	eq(n(`1`).Join(""), "")

	j := n(`{
		"a": {
			"b": 1
		},
		"c": ["x", "y", "z"]
	}`)

	eq(j.Get("a.b").Int(), 1)
	eq(j.Get("c.1").Str(), "y")

	v, _ := j.Gets("c", gson.Query(func(i interface{}) (val interface{}, has bool) {
		return i.([]interface{})[1], true
	}))
	eq(v.Str(), "y")

	eq(j.Get("c").Arr()[1].Str(), "y")
	eq(gson.New([]int{1, 2}).Arr()[1].Int(), 2)
	eq(j.Get("c").Join(" "), "x y z")
	eq(j.Get("a").Map()["b"].Int(), 1)
	eq(gson.New(map[string]int{"a": 1}).Map()["a"].Int(), 1)
	eq(len(j.Get("c").Map()), 0)

	eq(gson.New([]gson.JSON{
		gson.New(1),
		gson.New(map[string]int{"a": 2}),
	}).Get("1.a").Int(), 2)

	v, _ = gson.New(map[float64]int{2: 3}).Gets(2.0)
	eq(v.Int(), 3)

	_, has := j.Gets(true)
	eq(has, false)

	eq(j.Has("a.b"), true)
	eq(j.Has("a.x"), false)
	eq(j.Has("c.10"), false)

	onNil := gson.JSON{}
	eq(onNil.Set("a.b", 10).Get("a.b").Int(), 10)

	self := gson.New(nil)
	self.Set("1", "a")
	self.Set("a.b.1", 1)
	self.Sets("ok")
	eq(self.Str(), "ok")
	self.Sets(map[string]int{"a": 1})
	eq(self.Get("a").Int(), 1)
	self.Sets([]int{1})
	eq(self.Get("0").Int(), 1)

	j.Sets(2.0, "a", "b")
	eq(j.Get("a.b").Int(), 2)

	j.Set("c.1", 2)
	eq(j.Get("c.1").Int(), 2)

	j.Sets(3, "a", "b")
	eq(j.Get("a.b").Int(), 3)

	eq(j.Get("s.10.b").Nil(), true)
	eq(j.Get("c.10").Nil(), true)

	j.Set("s.1.a", 10)
	j.Set("c.5", "ok")
	eq(fmt.Sprint(j), `map[a:map[b:3] c:[x 2 z <nil> <nil> ok] s:[<nil> map[a:10]]]`)
}

func TestLab(t *testing.T) {
}

func n(s string) (j gson.JSON) {
	_ = json.Unmarshal([]byte(s), &j)
	return
}

func genEq(t *testing.T) func(a, b interface{}) {
	return func(a, b interface{}) {
		t.Helper()
		if !reflect.DeepEqual(a, b) {
			t.Log(a, "!=", b)
			t.Fail()
		}
	}
}
