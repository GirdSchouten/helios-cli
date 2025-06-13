const ora = require('ora');
const path = require("path");
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const getImageVersion = require('../utils/getImageVersion');

function version(options) {
    return new Promise((resolve, reject) => {
        console.log("\nPorts exposed by your Helios node:\n");
        console.log(" Port   | Description                   | Recommendation");
        console.log("--------|-------------------------------|-----------------------------------------");
        console.log(" 8080   | HTTP interface (dev/API?)     | Can be blocked if not required");
        console.log(" 8545   | JSON-RPC (public)             | Strongly recommended to restrict");
        console.log(" 8546   | WebSocket RPC                 | Block if unused");
        console.log(" 8547   | Private/internal RPC          | Block if unused");
        console.log(" 1317   | Cosmos REST API               | Required for external queries");
        console.log(" 26656  | Tendermint P2P                | Required for peer connectivity");
        console.log(" 26657  | Tendermint RPC                | Should be secured or restricted");
        console.log(" 10337  | Internal service (?)          | Review and block if not used");
        console.log(" 9090   | Cosmos gRPC                   | Required for light clients\n");

        console.log("Suggested firewall rules (using UFW):\n");
        console.log("sudo ufw deny 8080");
        console.log("sudo ufw deny 8546");
        console.log("sudo ufw deny 8547");
        console.log("sudo ufw deny 10337\n");

        console.log("To allow local access to public RPC only:\n");
        console.log("sudo ufw allow from 127.0.0.1 to any port 8545\n");

        console.log("Note:");
        console.log("- These rules are suggestions and will not be applied automatically.");
        console.log("- Verify which ports are needed in your specific setup before applying.");
        console.log("- For advanced users, consider using nftables or iptables directly.\n");

        resolve(undefined);
    });
};

module.exports = version;