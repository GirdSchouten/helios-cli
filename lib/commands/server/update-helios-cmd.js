const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");
const os = require("os");
const path = require("path");
const fs = require("fs");
const execCommandOnServer = require("../../utils/execCommandOnServer");
const cmd = require("./cmd");

function updateHeliosCmd(options) {
    return cmd({...options, command: ['bash', '-c', 'npm install -g @helios-chain-labs/helios-cli']});
};

module.exports = updateHeliosCmd;