const ora = require('ora');
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const ethers = require('ethers');
const { ethToHelios } = require("@helios-chain-labs/address-converter");

function cmds() {
    var array = [
        {
            cmd: (success, failure) => {
                const wallet = ethers.Wallet.createRandom();
                const heliosAddress = ethToHelios(wallet.address);

                console.log(`Private Key    : ${wallet.privateKey}`);
                console.log(`Address        : ${wallet.address}`);
                console.log(`Cosmos Address : ${heliosAddress}`);
                success();
            }
        },
    ]

    return array;
}

function generateWallet(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = cmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora("Wallet generated successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = generateWallet;