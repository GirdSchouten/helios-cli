const fs = require('fs');
const path = require('path');
const os = require('os');

const savePathHelios = (pathOfExecution) => {
    const homeDir = os.homedir();
    const cliConfigPath = path.join(homeDir, '.helios-cli');

    if (!fs.existsSync(cliConfigPath)) {
        fs.mkdirSync(cliConfigPath);
    }
    const pwdFilePath = path.join(cliConfigPath, 'pwd');
    fs.writeFileSync(pwdFilePath, pathOfExecution);
}

module.exports = savePathHelios;