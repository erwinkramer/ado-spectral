# Azure Pipelines Spectral Lint Task

## Introduction

This is the repo for the source code of the [Spectral Lint Task](https://marketplace.visualstudio.com/items?itemName=erwinkramer.SpectralLint) in the Visual Studio Marketplace.

## Status 

Currently there is only a version `0`, that has been minimally tested.

## Building and local testing

```
cd SpectralLintTask/SpectralLintTaskV0

$env:INPUT_ruleset=".spectral/demo-ruleset.yaml"
$env:INPUT_definition=".spectral/demo-definition-warn.json"
$env:INPUT_failSeverity="error"
$env:INPUT_outputFilePath=".spectral/demo-lint-report.json"
$env:INPUT_outputFormat="json"

tsc
node index.js
```

## Releasing

1. Update the version numbers at [vss-extension.json](/vss-extension.json) and [task.json](/SpectralLintTask/SpectralLintTaskV0/task.json). 
2. Create the extension file:
```
tfx extension create --manifest-globs vss-extension.json --output-path releases
```
3. [Add to the marketplace](https://marketplace.visualstudio.com/manage/publishers/erwinkramer).

## Design

Follows tips from: https://www.paraesthesia.com/archive/2020/02/25/tips-for-custom-azure-devops-build-tasks/
