const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');

function installCmds() {
    
    var array = [
        { // check docker
            cmd: (success, failure) => {
                try {
                    executeShellCommand("docker --version", (stdout) => {
                        success();
                    }, () => {
                        failure("Docker is not installed");
                    }, false, console.log);
                } catch(e) { failure(e) }
            }
        },
        {
            cmd: (success, failure) => { try {
                executeShellCommand("docker pull heliosfoundation/docker-helios-nodemanager:latest", (stdout) => {
                    success();
                }, () => {
                    failure("Docker pull failed");
                }, false, console.log);
             } catch(e) { failure(e) } }
        }
    ]

    return array;
}

function install(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = installCmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora("Instalation Successfully finished.").succeed();
            resolve(undefined);
        });
    });
};

module.exports = install;