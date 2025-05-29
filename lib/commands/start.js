const ora = require('ora');
const path = require("path");
const fs = require('fs');
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const generateDockerCompose = require('../utils/generateDockerCompose');

function cmds(options) {

    let failed = false;

    var array = [
        { // generate docker compose
            cmd: (success, failure) => {
                try {
                    console.log('generate docker compose');
                    let dockerComposeFileContent = generateDockerCompose(options);
                    console.log(dockerComposeFileContent);
                    fs.writeFileSync(`docker-compose.yml`, dockerComposeFileContent);
                    console.log(dockerComposeFileContent);
                    success();
                } catch(e) {
                    console.log(e);
                    failed = true;
                    failure(e)
                }
            }
        },
        { // check docker
            cond: () => !failed,
            cmd: (success, failure) => {
                try {
                    executeShellCommand("docker compose up -d", (stdout) => {
                        console.log(stdout);
                        success();
                    }, () => {
                        failure("Docker compose up failed");
                    }, false, console.log);
                } catch(e) { failure(e) }
            }
        },
    ]

    return array;
}

function start(options) {
    return new Promise((resolve, reject) => {
        let numberOfNodes = Number(options.argv["_"][1]) || 1;

        if (numberOfNodes > 5) {
            reject("Number of nodes must be less than 5");
            return;
        }

        const exeCmds = cmds(options);
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora(`NodeManager started successfully you can access it at http://0.0.0.0:${options.argv.port || 8080}`).succeed();
            resolve(undefined);
        });
    });
};

module.exports = start;