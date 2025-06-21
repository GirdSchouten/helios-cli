const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");
const os = require("os");
const path = require("path");
const fs = require("fs");

function add(options) {
    return new Promise(async (resolve, reject) => {

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

        for (const server of serverConfig) {
            console.log(`${server.ip} - ${server.name} - ${server.user} - ${server.useSshKey ? 'SSH Key' : server.password.replace(/./g, '*')}`);
        }

        resolve();
    });
};

module.exports = add;