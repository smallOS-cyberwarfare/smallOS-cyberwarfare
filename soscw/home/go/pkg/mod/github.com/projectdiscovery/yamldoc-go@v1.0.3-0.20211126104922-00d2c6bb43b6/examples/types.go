// go:generate docgen types.go types_doc.go Configuration
package main

import (
	"github.com/segmentio/ksuid"
)

var (
	exampleProvider = map[string]interface{}{
		"apollo-digitalocean": map[string]interface{}{
			"api-key":      ksuid.New().String(),
			"access-token": ksuid.New().String(),
		},
	}

	exampleInternalOptions = &InternalOptions{
		BulkSize:          10000,
		SchedulingWorkers: 100,
	}
)

// Job is a single job to be executed by apollo.
//
// A job contains providers and deployments required to be done
// and some steps to be taken to achieve a desired scan.
//
// A job is just an input and is immutable. The state of a job
// is maintained in other variables instead of the Job struct.
type Job struct {
	// description: |
	//   Name of the Job
	// examples:
	//   - name: Name Example
	//     value: "\"443-httpx-internet-wide\""
	Name string `yaml:"name" json:"name"`
	// description: |
	//   Key contains a key input of a certain type
	// values:
	//   - "dns"
	//   - "http"
	//   - "headless"
	Key string `yaml:"key"`
	// description: |
	//   Description contains a description of the job
	// examples:
	//   - name: Description Example
	//     value: "\"Runs masscan on port 443 followed by httpx\""
	Description string `yaml:"description" json:"description"`
	// description: |
	//   Providers contains a list of infrastructure providers
	//   for the current scan.
	// examples:
	//   - name: Providers Example
	//     value: exampleProvider
	Providers map[string]map[string]string `yaml:"providers" json:"-"`
	// description: |
	//   InternalOptions contains internal configuration options for scheduler
	// examples:
	//   - name: InternalOptions Example
	//     value: exampleInternalOptions
	InternalOptions *InternalOptions `yaml:"internal-options" json:"internal-options"`
}

// InternalOptions contains internal configuration options for scheduler
type InternalOptions struct {
	// description: |
	//   BulkSize is the number of items to process per node at once.
	// examples:
	//   - name: BulkSize Example
	//     value: "10000"
	BulkSize int `yaml:"bulk-size" json:"bulk-size"`
	// description: |
	//   SchedulingWorkers is the number of scheduling workers to use for ssh.
	// examples:
	//   - name: SchedulingWorkers Example
	//     value: "10"
	SchedulingWorkers int `yaml:"scheduling-workers" json:"scheduling-workers"`
}
