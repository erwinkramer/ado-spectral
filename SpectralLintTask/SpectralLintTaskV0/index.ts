import tl = require('azure-pipelines-task-lib/task');
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

async function validateDefinitionExistence(definition: string): Promise<boolean> {
    if (definition.startsWith('http://') || definition.startsWith('https://')) {
        // Check if the URL exists
        try {
            await new Promise<void>((resolve, reject) => {
                https.get(definition, (res) => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                        resolve();
                    } else {
                        reject(new Error(`URL returned status code ${res.statusCode}`));
                    }
                }).on('error', reject);
            });
        } catch (err) {
            tl.setResult(tl.TaskResult.Failed, `URL validation failed: ${err.message}`);
            return false;
        }
    } else {
        // Check if the file exists
        if (!fs.existsSync(definition)) {
            tl.setResult(tl.TaskResult.Failed, 'Definition file does not exist');
            return false;
        }
    }

    return true;
}

async function logOutputFileContent(outputFilePath: string | undefined): Promise<void> {
    if (!outputFilePath) {
        console.log("Spectral output file path not provided.");
        return;
    }

    try {
        if (fs.existsSync(outputFilePath)) {
            const content = fs.readFileSync(outputFilePath, 'utf8');
            console.log("Spectral output file content:");
            console.log(content);
        } else {
            console.log("Spectral output file does not exist.");
        }
    } catch (err) {
        console.log("Failed to read output file content:", err);
    }
}

async function run() {
    var outputFilePath: string | undefined;

    try {
        const binPath = path.resolve(__dirname, "node_modules/.bin");
        const spectralPath = path.resolve(binPath, "spectral");

        const ruleset: string | undefined = tl.getInput('ruleset', true);
        const definition: string | undefined = tl.getInput('definition', true);
        const failSeverity: string | undefined = tl.getInput('failSeverity', true);
        const outputFormat: string | undefined = tl.getInput('outputFormat', true);
        outputFilePath = tl.getInput('outputFilePath', false)

        if (!ruleset || !definition) {
            tl.setResult(tl.TaskResult.Failed, 'Ruleset or Definition input is missing');
            return;
        }

        const isExistingDefinition = await validateDefinitionExistence(definition);
        if (!isExistingDefinition) {
            return;
        }

        fs.chmodSync(spectralPath, '755');
        console.log("Spectral set as executable");

        console.log("Spectral version is (on next line)");
        await tl.execAsync(spectralPath, ['--version']);

        const spectralLintResult = await tl.execAsync(spectralPath, [
            'lint', definition,
            '--verbose', true,
            '--ruleset', ruleset,
            '--fail-severity', failSeverity, //results of this level or above will trigger a failure exit code
            '--display-only-failures', "false", //only output results equal to or greater than --fail-severity
            '--fail-on-unmatched-globs', "true", //fail on unmatched glob patterns
            '--ignore-unknown-format', "false", //do not warn about unmatched formats
            '--format', outputFormat, //formatters to use for outputting results, more than one can be provided by using multiple flags choices: "json", "stylish", "junit", "html", "text", "teamcity", "pretty", "github-actions", "sarif", "markdown","gitlab"
            '--output', outputFilePath //where to output results, can be a single file name, multiple "output.<format>" or missing to print to stdout
        ]);

        if (spectralLintResult !== 0) {
            console.log("Spectral execution failed with result: ", spectralLintResult);
            tl.setResult(tl.TaskResult.Failed, 'Spectral CLI execution failed, with result: ' + spectralLintResult);
            return;
        }
    } catch (err: any) {
        console.log("Spectral execution failed with error: ", err);
        await logOutputFileContent(outputFilePath);

        tl.setResult(tl.TaskResult.Failed, err.message);
    }
    finally {
    }
}

run();