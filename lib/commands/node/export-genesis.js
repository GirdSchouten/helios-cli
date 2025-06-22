const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");
const stopNode = require("./stop");
const containerDownloadFile = require("../../container/container-download-file");
const getContainer = require("../../container/get-container");
const getPathHelios = require("../../utils/getPathHelios");
const fs = require("fs");
const path = require("path");

function exportGenesis(options) {
    return new Promise(async (resolve, reject) => {
        const isRunning = await containerIsRunning();
        if (isRunning) {
            await stopNode({...options, disabledLogs: true});
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        const pathHelios = getPathHelios();
        if (!pathHelios) {
            reject("No path found, please start a node first");
            return;
        }
        await containerExec(['heliades', 'export', '--output-document=/root/.heliades/genesis.json', '--modules-to-export=bank,erc20,auth,hyperion,staking']);
        fs.copyFileSync(path.join(pathHelios, './data/node1/.heliades/genesis.json'), options.argv['output-document'] || './genesis.json');
        // await containerDownloadFile(await getContainer(), '/root/.heliades/genesis.json', options.argv['output-document'] || './genesis.json');
        resolve();
    });
};

module.exports = exportGenesis;