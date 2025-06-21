const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");

function stop(options) {
    return new Promise(async (resolve, reject) => {
        const isRunning = await containerIsRunning();
        if (!isRunning) {
            reject('Container is not running');
            return;
        }

        const output = await containerExec(['cat', '/root/.heliades/.password']);

        if (output.includes('No such file or directory')) {
            reject('Helios node not configured');
            return;
        }
        const password = output.trim();

        if (password == '') {
            reject('Helios node not configured - Login failed');
            return;
        }

        let isRunningResult = await fetch('http://localhost:8080/test', {
            method: 'POST',
            headers: {
                'Access-Code': password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (isRunningResult.status != 200) {
            reject('Helios node not configured - Is setup failed');
            return;
        }

        const testData = await isRunningResult.json();
        if (!testData) {
            reject('Helios node not configured - Is setup failed');
            return;
        }

        if (testData.node.status == '0') {
            if (!options.disabledLogs) {
                console.log('Node is already stopped');
            }
            resolve();
            return;
        }

        let result = await fetch('http://localhost:8080/stop-node', {
            method: 'POST',
            headers: {
                'Access-Code': password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (result.status != 200) {
            reject('Failed to start node');
            return;
        }

        const jsonResult = await result.json();

        if (jsonResult == true) {
            if (!options.disabledLogs) {
                console.log('Node stopped');
            }
            resolve();
        } else {
            reject('Failed to stop node');
        }
    });
};

module.exports = stop;