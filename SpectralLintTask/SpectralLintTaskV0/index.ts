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

async function run() {
    try {
        const binPath = path.resolve(__dirname, "node_modules/.bin");
        const spectralPath = path.resolve(binPath, "spectral");

        const ruleset: string | undefined = tl.getInput('ruleset', true);
        const definition: string | undefined = tl.getInput('definition', true);

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

        const execResult = await tl.execAsync(spectralPath, [
            'lint',
            definition,
            '-v',
            '-r',
            ruleset,
            '--fail-severity',
            'hint'
        ]);

        if (execResult !== 0) {
            tl.setResult(tl.TaskResult.Failed, 'Spectral CLI execution failed');
            return;
        }
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();