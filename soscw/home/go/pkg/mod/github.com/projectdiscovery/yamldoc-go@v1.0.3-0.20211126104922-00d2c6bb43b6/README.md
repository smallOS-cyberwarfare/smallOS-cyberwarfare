# yamldoc-go

A standalone version of the YAML Code Documentation approach described at https://www.talos-systems.com/blog/documentation-as-code/. All credits goes to original authors.


### Changes

- Added support for example name based comments
- Fixed a panic with embedded structs and added support for them.
- Complete rewrite of docgen using [dst](https://github.com/dave/dst) to support multi-package structure organization.
  
### Usage

The general recommendation is, all the structures for a single type should be in a single file.

The following go:generate command will generate docs for a specified file.

```bash
//go:generate dstdocgen -path ~/projectdiscovery/nuclei/v2/pkg/templates -structure Template -output output.go
$ go generate pkg/<path_to_file>.go
```

Below is an example struct with all supported annotation as examples.

```go
kubeletExtraMountsExample = []specs.Mount{
		{
			Source:      "/var/lib/example",
			Destination: "/var/lib/example",
			Type:        "bind",
			Options: []string{
				"rshared",
				"rw",
			},
		},
	}

...

type Config struct {
    // description: |
    //   Indicates the schema used to decode the contents.
    // values:
    //   - v1alpha1
    ConfigVersion string `yaml:"version"`
    // description: |
    //   Enable verbose logging.
    // values:
    //   - true
    //   - yes
    //   - false
    //   - no
    ConfigDebug bool `yaml:"debug"`
    //   description: |
    //     The `image` field is an optional reference to an alternative kubelet image.
    //   examples:
    //     - value: '"docker.io/<org>/kubelet:latest"'
    KubeletImage string `yaml:"image,omitempty"`
    //   description: |
    //     The `extraArgs` field is used to provide additional flags to the kubelet.
    //   examples:
    //     - name: Description for this example
    //       value: >
    //         map[string]string{
    //           "key": "value",
    //         }
    KubeletExtraArgs map[string]string `yaml:"extraArgs,omitempty"`
    //   description: |
    //     The `extraMounts` field is used to add additional mounts to the kubelet container.
    //   examples:
    //     - value: kubeletExtraMountsExample
    KubeletExtraMounts []specs.Mount `yaml:"extraMounts,omitempty"`
}
```
