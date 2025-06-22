const getPathHelios = require("../../utils/getPathHelios");
const containerIsRunning = require("../../container/container-is-running");
const exportGenesis = require("./export-genesis");
const fs = require("fs");

const testnetReset = (options) => {
    return new Promise(async (resolve, reject) => {
        const pathHelios = getPathHelios();
        if (!pathHelios) {
            reject("No path found, please start a node first");
            return;
        }
        const isRunning = await containerIsRunning();
        if (!isRunning) {
            reject('Container is not running');
            return;
        }
        await exportGenesis(options);
    
        if (!fs.existsSync('./genesis.json')) {
            reject('Genesis file not found');
            return;
        }

    });
}

module.exports = testnetReset;