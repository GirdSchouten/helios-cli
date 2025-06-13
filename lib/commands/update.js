const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const install = require('./install');
const start = require('./start');
const stop = require('./stop');
const fs = require('fs');
const getImageVersion = require('../utils/getImageVersion');

function updateCmds(options) {
    let currentVersion = null;
    let newVersion = null;

    var array = [
        {
            cmd: (success, failure) => {
                try {
                    getImageVersion().then((version) => {
                        currentVersion = version;
                        success();
                    }).catch((error) => {
                        failure();
                    });
                } catch(e) { failure(e) }
            }
        },
        {// check if docker-compose.yml exists
            cmd: (success, failure) => {
                try {
                    if (fs.existsSync('docker-compose.yml')) {
                        success();
                    } else {
                        failure('docker-compose.yml not found');
                    }
                } catch(e) { failure(e) }
            }
        },
        { // install
            cmd: (success, failure) => {
                try {
                    install(options).then((error) => {
                        if (error != undefined) {
                            reject(error);
                            return;
                        }
                        success(undefined);
                    });
                } catch(e) { failure(e) }
            }
        },
        {
            cmd: (success, failure) => {
                try {
                    getImageVersion().then((version) => {
                        newVersion = version;
                        success();
                    }).catch((error) => {
                        failure();
                    });
                } catch(e) { failure(e) }
            }
        },
        {
            cmd: (success, failure) => {
                try {
                    if (currentVersion != newVersion && newVersion != null && currentVersion != null) {
                        success();
                    } else {
                        failure(`Blockchain version is not updated, please try again later. current version: ${currentVersion}, lastest version: ${newVersion}`);
                    }
                } catch(e) { failure(e) }
            }
        },
        { // stop
            cmd: (success, failure) => {
                try {
                    stop(options).then((error) => {
                        if (error != undefined) {
                            reject(error);
                            return;
                        }
                        success(undefined);
                    });
                } catch(e) { failure(e) }
            }
        },
        { // start
            cmd: (success, failure) => {
                try {
                    executeShellCommand("docker compose up -d", (stdout) => {
                        ora(`NodeManager started successfully`).succeed();
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

function update(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = updateCmds(options);
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, (error) => {
            if (error != undefined) {
                reject(error);
                return;
            }
            ora("Update Successfully finished.").succeed();
            resolve(undefined);
        });
    });
};

module.exports = update;