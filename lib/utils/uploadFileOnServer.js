const fs = require("fs");
const { NodeSSH } = require("node-ssh");
const os = require("os");

const uploadFileOnServer = async (server, srcPath, destPath) => {
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
            return ssh.putFile(srcPath, destPath);
        }).then(result => {
            ssh.dispose();
            resolve();
        }).catch(err => {
            console.error('Erreur SSH :', err);
            reject();
        });
    });
};

module.exports = uploadFileOnServer;