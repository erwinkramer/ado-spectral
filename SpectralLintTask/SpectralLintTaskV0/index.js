"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
const path = __importStar(require("path"));
async function validateDefinitionExistence(definition) {
    if (definition.startsWith('http://') || definition.startsWith('https://')) {
        // Check if the URL exists
        try {
            await new Promise((resolve, reject) => {
                https.get(definition, (res) => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                        resolve();
                    }
                    else {
                        reject(new Error(`URL returned status code ${res.statusCode}`));
                    }
                }).on('error', reject);
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, `URL validation failed: ${err.message}`);
            return false;
        }
    }
    else {
        // Check if the file exists
        if (!fs.existsSync(definition)) {
            tl.setResult(tl.TaskResult.Failed, 'Definition file does not exist');
            return false;
        }
    }
    return true;
}
async function logOutputFileContent(outputFilePath) {
    if (!outputFilePath) {
        console.log("Spectral output file path not provided.");
        return;
    }
    try {
        if (fs.existsSync(outputFilePath)) {
            const content = fs.readFileSync(outputFilePath, 'utf8');
            console.log("Spectral output file content:");
            console.log(content);
        }
        else {
            console.log("Spectral output file does not exist.");
        }
    }
    catch (err) {
        console.log("Failed to read output file content:", err);
    }
}
async function run() {
    var outputFilePath;
    try {
        const binPath = path.resolve(__dirname, "node_modules/.bin");
        const spectralPath = path.resolve(binPath, "spectral");
        const ruleset = tl.getInput('ruleset', true);
        const definition = tl.getInput('definition', true);
        const failSeverity = tl.getInput('failSeverity', true);
        const outputFormat = tl.getInput('outputFormat', true);
        outputFilePath = tl.getInput('outputFilePath', false);
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
            '--fail-severity', failSeverity,
            '--display-only-failures', "false",
            '--fail-on-unmatched-globs', "true",
            '--ignore-unknown-format', "false",
            '--format', outputFormat,
            '--output', outputFilePath //where to output results, can be a single file name, multiple "output.<format>" or missing to print to stdout
        ]);
        if (spectralLintResult !== 0) {
            console.log("Spectral execution failed with result: ", spectralLintResult);
            tl.setResult(tl.TaskResult.Failed, 'Spectral CLI execution failed, with result: ' + spectralLintResult);
            return;
        }
    }
    catch (err) {
        console.log("Spectral execution failed with error: ", err);
        await logOutputFileContent(outputFilePath);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
    finally {
    }
}
run();
