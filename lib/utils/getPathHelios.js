const fs = require('fs');
const path = require('path');
const os = require('os');

const getPathHelios = () => {
    const homeDir = os.homedir();
    const cliConfigPath = path.join(homeDir, '.helios-cli');
    const pwdFilePath = path.join(cliConfigPath, 'pwd');
    if (fs.existsSync(pwdFilePath)) {
        return fs.readFileSync(pwdFilePath, 'utf8');
    }
    return null;
}

module.exports = getPathHelios;