const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const getImageVersion = require('../utils/getImageVersion');

function cmds() {
    var array = [
        { // check docker
            cmd: (success, failure) => {
                try {
                    getImageVersion().then((version) => {
                        console.log(`Blockchain version: ${version}`);
                        success();
                    }).catch((error) => {
                        console.log(error);
                        failure();
                    });
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