# ado-spectral

## Test

```
cd SpectralLintTask/SpectralLintTaskV0

$env:INPUT_ruleset=".spectral/demo-ruleset.yaml"
$env:INPUT_definition=".spectral/demo-definition-error.json"
$env:INPUT_failSeverity="error"
$env:INPUT_outputFilePath=".spectral/demo-lint-report.json"
$env:INPUT_outputFormat="json"

tsc
node index.js
```

## Releases

```
tfx extension create --manifest-globs vss-extension.json --output-path releases
```

## Design

Follows tips from: https://www.paraesthesia.com/archive/2020/02/25/tips-for-custom-azure-devops-build-tasks/

## Upload

Add to https://marketplace.visualstudio.com/manage/publishers/erwinkramer