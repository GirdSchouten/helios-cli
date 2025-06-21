const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");

function heliades(options) {
    return new Promise(async (resolve, reject) => {
        const isRunning = await containerIsRunning();
        if (!isRunning) {
            reject('Container is not running');
            return;
        }

        const output = await containerExec(['heliades', ... options.argv._.slice(2)]);

        console.log(output);

        resolve();
    });
};

module.exports = heliades;