package main

import (
	"fmt"

	"github.com/ysmood/gson"
)

func patch(json gson.JSON) {
	k := func(k, v string) gson.Query {
		return func(obj interface{}) (val interface{}, has bool) {
			for _, el := range obj.([]interface{}) {
				res := el.(map[string]interface{})[k]
				if res == v {
					return el, true
				}
			}
			panic("not found")
		}
	}
	index := func(obj interface{}, k, v string) string {
		for i, el := range obj.([]interface{}) {
			res := el.(map[string]interface{})[k]
			if res == v {
				return fmt.Sprintf("%d", i)
			}
		}
		panic("not found")
	}

	getTypes := func(domain string) gson.JSON {
		res, _ := json.Gets("domains", k("domain", domain), "types")
		return res
	}

	// TargetTargetInfoType
	j, _ := getTypes("Target").Gets(k("id", "TargetInfo"), "properties", k("name", "type"))
	j.Set("enum", []string{
		"page", "background_page", "service_worker", "shared_worker", "browser", "other",
	})

	// PageLifecycleEventName
	j, _ = json.Gets("domains", k("domain", "Page"), "events", k("name", "lifecycleEvent"), "parameters", k("name", "name"))
	j.Set("enum", []string{
		"init", "firstPaint", "firstContentfulPaint", "firstImagePaint", "firstMeaningfulPaintCandidate",
		"DOMContentLoaded", "load", "networkAlmostIdle", "firstMeaningfulPaint", "networkIdle",
	})

	// replace these with better type definition
	j, _ = getTypes("Input").Gets(k("id", "TimeSinceEpoch"))
	j.Set("skip", true)
	j, _ = getTypes("Network").Gets(k("id", "TimeSinceEpoch"))
	j.Set("skip", true)
	j, _ = getTypes("Network").Gets(k("id", "MonotonicTime"))
	j.Set("skip", true)

	// fix Cookie.Expires
	j, _ = getTypes("Network").Gets(k("id", "Cookie"), "properties")
	j.Set(index(j.Val(), "name", "expires"), map[string]interface{}{
		"$ref":        "TimeSinceEpoch",
		"description": "Cookie expiration date",
		"name":        "expires",
	})
}
