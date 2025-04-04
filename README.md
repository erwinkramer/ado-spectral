# ado-spectral

## Test

```
cd SpectralLintTask/SpectralLintTaskV0
tsc
$env:INPUT_ruleset=".spectral/main.yaml"
$env:INPUT_definition=".spectral/demo.json"

node index.js
```

## Releases

```
tfx extension create --manifest-globs vss-extension.json --output-path releases
```

## Design

Follows tips from: https://www.paraesthesia.com/archive/2020/02/25/tips-for-custom-azure-devops-build-tasks/