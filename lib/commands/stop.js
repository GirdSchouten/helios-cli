const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const stopNode = require('./node/stop');

function cmds(options) {
    var array = [
        {
            cmd: (success, failure) => {
                try {
                    stopNode({...options, disabledLogs: true}).then(() => {
                        success();
                    }).catch((e) => {
                        failure(e);
                    });
                } catch(e) {
                    failure(e)
                }
            }
        },
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
        const exeCmds = cmds(options);
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, (error) => {
            if (error) {
                ora("NodeManager stopped successfully").fail();
                reject(error);
                return;
            }
            ora("NodeManager stopped successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = stop;