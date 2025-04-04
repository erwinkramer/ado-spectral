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
async function run() {
    try {
        const ruleset = tl.getInput('ruleset', true);
        const definition = tl.getInput('definition', true);
        if (!ruleset || !definition) {
            tl.setResult(tl.TaskResult.Failed, 'Ruleset or Definition input is missing');
            return;
        }
        const isExistingDefinition = await validateDefinitionExistence(definition);
        if (!isExistingDefinition) {
            return;
        }
        const execResult = await tl.execAsync('spectral', [
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
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}
run();
