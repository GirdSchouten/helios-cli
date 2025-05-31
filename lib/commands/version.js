const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');

function cmds() {
    var array = [
        { // check docker
            cmd: (success, failure) => {
                try {
                    executeShellCommand(`docker inspect heliosfoundation/docker-helios-nodemanager:latest --format='{{index .Config.Labels "version"}}'`, (version) => {
                        console.log(`Blockchain version: ${version.trim()}`);
                        success();
                    }, () => {
                        failure();
                    }, false, console.log);
                } catch(e) { failure(e) }
            },
            
        },
        {
            cmd: (success, failure) => {
                try {
                    const packageJson = require(path.join(__dirname, '..', '..', 'package.json'));
                    console.log(`CLI version       : v${packageJson.version}`);
                    success();
                } catch(e) { failure(e) }
            }
        }
    ]

    return array;
}

function version(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = cmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            // ora("NodeManager stopped successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = version;