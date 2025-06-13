const executeShellCommand = require('./executeShellCommandLine');

module.exports = function getImageVersion() {
    return new Promise((resolve, reject) => {
        executeShellCommand(`docker inspect heliosfoundation/docker-helios-nodemanager:latest --format='{{index .Config.Labels "version"}}'`, (version) => {
            resolve(version.trim());
        }, () => {
            reject();
        }, false, console.log);
    });
}