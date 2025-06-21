const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");

function start(options) {
    return new Promise(async (resolve, reject) => {
        const isRunning = await containerIsRunning();
        if (!isRunning) {
            reject('Container is not running');
            return;
        }

        const output = await containerExec(['cat', '/root/.heliades/config/priv_validator_key.json']);

        if (output.includes('No such file or directory')) {
            reject('Helios node not configured');
            return;
        }
        const privKey = output.trim();

        if (privKey == '') {
            reject('Helios node not configured - Login failed');
            return;
        }

        console.log(privKey);

        resolve();
    });
};

module.exports = start;