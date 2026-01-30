# Azure Pipelines Spectral Lint Task 👒

[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/erwinkramer/ado-spectral)

## Introduction

This is the repo for the source code of the [Spectral Lint Task](https://marketplace.visualstudio.com/items?itemName=erwinkramer.SpectralLint) in the Visual Studio Marketplace.

## Status

Currently there is only a version `0`, that has been minimally tested.

## Building and local testing

```powershell
cd tasks/SpectralLintTaskV0

$env:INPUT_ruleset=".spectral/demo-ruleset.yaml"
$env:INPUT_definition="https://petstore3.swagger.io/api/v3/openapi.json"
$env:INPUT_failSeverity="error"
$env:INPUT_outputFilePath=".spectral/demo-lint-report.json"
$env:INPUT_outputFormat="json"

tsc
node index.js
```

## Releasing

1. Update the version numbers at [vss-extension.json](/vss-extension.json) and [task.json](/tasks/SpectralLintTaskV0/task.json).
2. Create the extension file (requires `npm i -g tfx-cli`):

    ```bash
        tfx extension create --manifest-globs vss-extension.json --output-path releases
    ```

3. [Add to the marketplace](https://marketplace.visualstudio.com/manage/publishers/erwinkramer).

## Design

Follows [tips from Travis Illig](https://www.paraesthesia.com/archive/2020/02/25/tips-for-custom-azure-devops-build-tasks/).

## License

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg