# Spectral Lint Task

Lint your OpenAPI files with Spectral.

## Settings

| Name   | Type | Default Value | Required | Description |
|--|--|--|--|--|
| `ruleset`      | string | [OWASP Ruleset](https://unpkg.com/@stoplight/spectral-owasp-ruleset/dist/ruleset.mjs) | ✅ Yes | URI or filepath to the ruleset. |
| `definition`   | string | [Petstore OpenAPI](https://petstore3.swagger.io/api/v3/openapi.json) | ✅ Yes | URI or filepath to the OpenAPI definition. |
| `failSeverity` | string | `error` | ✅ Yes | Fail severity level. Options: `error`, `warn`, `info`, `hint`. |
| `outputFormat` | string | `json` | ✅ Yes | Output format. Options: `stylish`, `json`, `sarif`, `junit`, `html`, `text`, `teamcity`, `pretty`, `github-actions`, `markdown`, `gitlab`. |
| `outputFilePath` | string | `./spectral-lint-report.json` | ✅ Yes | Path to the output file. |


## `failSeverity` handing

If there are validation issues that are lower than the current `failSeverity` setting, then the task will throw a warning (aka `SucceededWithIssues`).

If there are validation issues that are at least at the current `failSeverity` setting, then the task will throw an error (aka `Failed`).

## Examples

With filepaths: 

```yaml
- task: SpectralLint@0
  displayName: "Spectral valid"
  inputs:
    ruleset: '.spectral/demo-ruleset.yaml'
    definition: '.spectral/demo-definition-valid.json'
    failSeverity: 'error'
    outputFormat: 'json'
```

With URIs:

```yaml
- task: SpectralLint@0
  displayName: "Spectral ?"
  inputs:
    ruleset: 'https://unpkg.com/@stoplight/spectral-owasp-ruleset/dist/ruleset.mjs'
    definition: 'https://petstore3.swagger.io/api/v3/openapi.json'
    failSeverity: 'error'
    outputFormat: 'json'
```
