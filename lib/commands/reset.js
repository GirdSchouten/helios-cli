const ora = require('ora');
const path = require("path");
const fs = require('fs');
const os = require('os');
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const generateDockerCompose = require('../utils/generateDockerCompose');

function cmds() {

    let failed = false;

    let volumePath = `./data`;

    if (os.platform() === 'win32') {
        const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
        volumePath = path.join(localAppData, 'Helios');
        // Docker don't like backslashes
        volumePath = volumePath.replace(/\\/g, '/');
    }

    var array = [
        { // check docker
            cond: () => !failed,
            cmd: (success, failure) => {
                try {
                    if (fs.existsSync(volumePath)) {
                        fs.rmSync(volumePath, { recursive: true, force: true });
                    }
                    success();
                } catch(e) { failure(e) }
            }
        },
        {
            cmd: (success, failure) => {
                try {
                    executeShellCommand("docker system prune -a -f", (stdout) => {
                        success();
                    }, () => {
                        failure("Docker system prune failed");
                    }, false, console.log);
                } catch(e) { failure(e) }
            }
        }
    ]

    return array;
}

function start(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = cmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora("NodeManager reset successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = start;