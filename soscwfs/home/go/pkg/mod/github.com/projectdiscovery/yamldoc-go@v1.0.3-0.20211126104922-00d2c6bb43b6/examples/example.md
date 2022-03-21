


go:generate docgen types.go types_doc.go Configuration

## Job
Job is a single job to be executed by apollo.

A job contains providers and deployments required to be done
and some steps to be taken to achieve a desired scan.

A job is just an input and is immutable. The state of a job
is maintained in other variables instead of the Job struct.





<hr />

<div class="dd">

<code>name</code>  <i>string</i>

</div>
<div class="dt">

Name of the Job



Examples:


``` yaml
name: 443-httpx-internet-wide
```


</div>

<hr />

<div class="dd">

<code>key</code>  <i>string</i>

</div>
<div class="dt">

Key contains a key input of a certain type


Valid values:


  - <code>dns</code>

  - <code>http</code>

  - <code>headless</code>
</div>

<hr />

<div class="dd">

<code>description</code>  <i>string</i>

</div>
<div class="dt">

Description contains a description of the job



Examples:


``` yaml
description: Runs masscan on port 443 followed by httpx
```


</div>

<hr />

<div class="dd">

<code>providers</code>  <i>map[string]map[string]string</i>

</div>
<div class="dt">

Providers contains a list of infrastructure providers
for the current scan.



Examples:


``` yaml
providers:
    apollo-digitalocean:
        access-token: 1sBKi2VGbAaifbg6NDvAdcyp8Uo
        api-key: 1sBKhzvzQJc9TKwic4vFiQO61FH
```


</div>

<hr />

<div class="dd">

<code>internal-options</code>  <i><a href="#internaloptions">InternalOptions</a></i>

</div>
<div class="dt">

InternalOptions contains internal configuration options for scheduler



Examples:


``` yaml
internal-options:
    bulk-size: 10000 # BulkSize is the number of items to process per node at once.
    scheduling-workers: 100 # SchedulingWorkers is the number of scheduling workers to use for ssh.
```


</div>

<hr />





## InternalOptions
InternalOptions contains internal configuration options for scheduler

Appears in:


- <code><a href="#job">Job</a>.internal-options</code>


``` yaml
bulk-size: 10000 # BulkSize is the number of items to process per node at once.
scheduling-workers: 100 # SchedulingWorkers is the number of scheduling workers to use for ssh.
```

<hr />

<div class="dd">

<code>bulk-size</code>  <i>int</i>

</div>
<div class="dt">

BulkSize is the number of items to process per node at once.



Examples:


``` yaml
bulk-size: 10000
```


</div>

<hr />

<div class="dd">

<code>scheduling-workers</code>  <i>int</i>

</div>
<div class="dt">

SchedulingWorkers is the number of scheduling workers to use for ssh.



Examples:


``` yaml
scheduling-workers: 10
```


</div>

<hr />




