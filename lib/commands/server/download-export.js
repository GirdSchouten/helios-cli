const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");
const os = require("os");
const path = require("path");
const fs = require("fs");
const execCommandOnServer = require("../../utils/execCommandOnServer");
const downloadFileOnServer = require("../../utils/downloadFileOnServer");

const downloadExportGenesis = async (server) => {
    return new Promise(async (resolve, reject) => {
        await execCommandOnServer(server, 'helios node export-genesis --output-document=genesis.json');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await downloadFileOnServer(server, 'genesis.json', './genesis.json');
    });
};

function downloadExport(options) {
    return new Promise(async (resolve, reject) => {

        if (options.argv.name == undefined && options.argv.all == undefined) {
            reject('Please specify a server name or --all');
            return;
        }

        const isAll = options.argv.all === "true";
        const command = options.argv._.slice(2);

        const homeDir = os.homedir();
        const cliConfigPath = path.join(homeDir, '.helios-cli');

        if (!fs.existsSync(cliConfigPath)) {
            fs.mkdirSync(cliConfigPath);
        }

        const serverConfigPath = path.join(cliConfigPath, 'servers.json');

        if (!fs.existsSync(serverConfigPath)) {
            fs.writeFileSync(serverConfigPath, JSON.stringify([], null, 2));
        }

        const serverConfig = JSON.parse(fs.readFileSync(serverConfigPath, 'utf8'));

        if (isAll) {
            await Promise.all(serverConfig.map((x) => downloadExportGenesis(x, command)));
        } else {
            const server = serverConfig.find(x => x.name == options.argv.name);
            if (!server) {
                reject(`Server ${options.argv.name} not found`);
                return;
            }
            await downloadExportGenesis(server, command);
        }

        resolve();
    });
};

module.exports = downloadExport;