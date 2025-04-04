# ado-spectral

## Test

```
tsc
$env:INPUT_ruleset=".spectral/main.yaml"
$env:INPUT_definition=".spectral/demo.json"

node index.js
```

## Releases

```
tfx extension create --manifest-globs vss-extension.json --output-path releases
```
