const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');

function cmds() {
    var array = [
        { // check docker
            cmd: (success, failure) => {
                try {
                    executeShellCommand("docker compose down", () => {
                        success();
                    }, () => {
                        failure("Docker compose down failed");
                    }, false, console.log);
                } catch(e) { failure(e) }
            }
        },
    ]

    return array;
}

function stop(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = cmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora("NodeManager stopped successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = stop;