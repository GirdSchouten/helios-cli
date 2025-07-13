const getPathHelios = require("../../utils/getPathHelios");
const containerIsRunning = require("../../container/container-is-running");
const exportGenesis = require("./export-genesis");
const fs = require("fs");
const generateGenesisFromExistGenesis = require("../../utils/generateGenesisFromExistGenesis");
const startNode = require("./start");
const stopNode = require("./stop");
const containerExecStream = require("../../container/container-exec-stream");
const containerExec = require("../../container/container-exec");
const Stream = require("stream");
const path = require("path");


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
            const metadata = fs.readFileSync(path.join(pathHelios, 'data/node1/.heliades/data/metadata.json'), 'utf8');
            const metadataJson = JSON.parse(metadata);
            const height = metadataJson.height;

            const info = await containerExec(['heliades', 'application-db', 'info', `--height=${height}`]);
            fs.writeFileSync(path.join(pathHelios, `info-${height}.json`), info);
            console.log(`info-${height}.json saved in ${pathHelios}`);

            const trace = await containerExec(['heliades', 'application-db', 'trace', `--height=${height}`]);
            fs.writeFileSync(path.join(pathHelios, `trace-${height}.json`), trace);
            console.log(`trace-${height}.json saved in ${pathHelios}`);

            await containerExecStream(['heliades', 'rollback', '--hard', '--delete-latest-state'], std);
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