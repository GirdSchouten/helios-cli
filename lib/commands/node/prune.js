const getPathHelios = require("../../utils/getPathHelios");
const containerIsRunning = require("../../container/container-is-running");
const exportGenesis = require("./export-genesis");
const fs = require("fs");
const generateGenesisFromExistGenesis = require("../../utils/generateGenesisFromExistGenesis");
const startNode = require("./start");
const stopNode = require("./stop");
const containerExecStream = require("../../container/container-exec-stream");
const Stream = require("stream");


const prune = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            await stopNode({...options, disabledLogs: true});
            await new Promise(resolve => setTimeout(resolve, 5000));
            const std = new Stream.PassThrough();
            std.on('data', (data) => {
                process.stdout.write(data.toString());
            });
            await containerExecStream(['heliades', 'prune', 'custom', '--pruning-keep-recent', '10', '--pruning-interval', '10'], std);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await startNode(options);
            resolve();
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

module.exports = prune;