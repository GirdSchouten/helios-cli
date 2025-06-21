const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");
const stopNode = require("./stop");
const containerDownloadFile = require("../../container/container-download-file");
const getContainer = require("../../container/get-container");

function exportGenesis(options) {
    return new Promise(async (resolve, reject) => {
        const isRunning = await containerIsRunning();
        if (isRunning) {
            await stopNode({...options, disabledLogs: true})
        }
        await containerExec(['heliades', 'export', '--output-document=/root/.heliades/genesis.json']);
        await containerDownloadFile(await getContainer(), '/root/.heliades/genesis.json', options.argv['output-document'] || './genesis.json');
        resolve();
    });
};

module.exports = exportGenesis;