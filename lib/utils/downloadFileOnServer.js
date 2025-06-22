const fs = require("fs");
const { NodeSSH } = require("node-ssh");
const os = require("os");

const downloadFileOnServer = async (server, srcPath, destPath) => {
    return new Promise(async (resolve, reject) => {
        const ssh = new NodeSSH();

        let privateKey = undefined;
        let password = undefined;
        if (server.useSshKey) {
            if (fs.existsSync(os.homedir() + '/.ssh/id_rsa')) {
                privateKey = fs.readFileSync(os.homedir() + '/.ssh/id_rsa', 'utf8');
            } else {
                reject('SSH key not found. Please add a SSH key to your server or use a password.');
                return;
            }
        } else {
            password = server.password;
        }

        ssh.connect({
            host: server.ip,
            username: server.user,
            password: server.password,
            privateKey: privateKey,
        }).then(() => {
            return ssh.getFile(destPath, srcPath);
        }).then(result => {
            ssh.dispose();
            resolve();
        }).catch(err => {
            console.error('Erreur SSH :', err);
            reject();
        });
    });
};

module.exports = downloadFileOnServer;