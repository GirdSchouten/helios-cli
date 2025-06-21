const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");
const os = require("os");
const path = require("path");
const fs = require("fs");

function add(options) {
    return new Promise(async (resolve, reject) => {

        const serverIp = options.argv.ip;
        const serverName = options.argv.name;
        const serverUser = options.argv.user;
        const serverPassword = options.argv.password || '';
        const useSshKey = options.argv.useSSHKey === 'true' || false;

        if (serverIp == undefined || serverName == undefined || serverUser == undefined || (serverPassword == undefined && !useSshKey)) {
            reject('Please specify a server --ip, --name, --user and --password or --useSSHKey');
            return;
        }

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

        if (serverConfig.find(x => x.ip == serverIp)) {
            reject(`Server ${serverIp} already exists`);
            return;
        }

        serverConfig.push({
            ip: serverIp,
            name: serverName,
            user: serverUser,
            password: serverPassword,
            useSshKey: useSshKey
        });
        fs.writeFileSync(serverConfigPath, JSON.stringify(serverConfig, null, 2));

        console.log(`Server ${serverIp} added`);
        resolve();
    });
};

module.exports = add;