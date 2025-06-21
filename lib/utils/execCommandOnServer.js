const fs = require("fs");
const { NodeSSH } = require("node-ssh");
const os = require("os");

const execCommandOnServer = async (server, command) => {
    return new Promise(async (resolve, reject) => {
        const ssh = new NodeSSH();

        let privateKey = undefined;
        if (server.useSshKey) {
            if (fs.existsSync(os.homedir() + '/.ssh/id_rsa')) {
                privateKey = fs.readFileSync(os.homedir() + '/.ssh/id_rsa', 'utf8');
            } else {
                reject('SSH key not found. Please add a SSH key to your server or use a password.');
                return;
            }
        }

        ssh.connect({
            host: server.ip,
            username: server.user,
            privateKey: privateKey,
        }).then(() => {
            return ssh.execCommand(command.join(' '));
        }).then(result => {
            console.log(result.stdout);
            if (result.stderr) {
                console.log(result.stderr);
            }
            resolve();
        }).catch(err => {
            console.error('Erreur SSH :', err);
            reject();
        });
    });
};

module.exports = execCommandOnServer;