const getPathHelios = require("../../utils/getPathHelios");
const containerIsRunning = require("../../container/container-is-running");
const exportGenesis = require("./export-genesis");
const fs = require("fs");
const containerExec = require("../../container/container-exec");
const generateGenesisFromExistGenesis = require("../../utils/generateGenesisFromExistGenesis");
const startNode = require("./start");
const stopNode = require("./stop");
const path = require("path");

const testnetReset = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pathHelios = getPathHelios();
            if (!pathHelios) {
                reject("No path found, please start a node first");
                return;
            }
            const metadata = JSON.parse(fs.readFileSync(path.join(pathHelios, 'data/node1/.heliades/data/metadata.json')).toString());
            console.log(metadata);
            resolve();
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

module.exports = testnetReset;