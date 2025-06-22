const getPathHelios = require("../../utils/getPathHelios");
const containerIsRunning = require("../../container/container-is-running");
const exportGenesis = require("./export-genesis");
const fs = require("fs");
const containerExec = require("../../container/container-exec");
const generateGenesisFromExistGenesis = require("../../utils/generateGenesisFromExistGenesis");
const startNode = require("./start");
const stopNode = require("./stop");
const path = require("path");

const testnetReset = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pathHelios = getPathHelios();
            if (!pathHelios) {
                reject("No path found, please start a node first");
                return;
            }
            const isRunning = await containerIsRunning();
            if (!isRunning) {
                reject('Container is not running');
                return;
            }
            await stopNode({...options, disabledLogs: true});
        
            if (!fs.existsSync('./genesis.json')) {
                reject('Genesis file not found');
                return;
            }
            if (!fs.existsSync('./tiny_genesis.json')) {
                reject('Tiny genesis file not found');
                return;
            }

            const initializerAddress = await containerExec(['heliades','keys', 'show', 'user0', '-a', '--bech=acc', '--keyring-backend=local']);

            console.log('initializerAddress:', initializerAddress);

            const genesis = fs.readFileSync('./genesis.json').toString();
            const tinyGenesis = fs.readFileSync('./tiny_genesis.json').toString();
            const newGenesisJson = await generateGenesisFromExistGenesis(genesis, tinyGenesis, initializerAddress);

            const heliadesDirectory = path.join(pathHelios,'data/node1/.heliades');

            fs.writeFileSync(path.join(heliadesDirectory, 'config/genesis.json'), JSON.stringify(newGenesisJson, null, 2));
            ['application.db', 'blockstore.db', 'state.db', 'tx_index.db', 'snapshots', 'cs.wal', 'evidence.db'].forEach(file => {
                fs.rmSync(path.join(heliadesDirectory, 'data', file), { force: true, recursive: true });
            });
            ['gentx'].forEach(file => {
                fs.rmSync(path.join(heliadesDirectory, 'config', file), { force: true, recursive: true });
            });
            fs.writeFileSync(path.join(heliadesDirectory, 'data/priv_validator_state.json'), JSON.stringify({
                height: newGenesisJson.initial_height.toFixed(0),
                round: 0,
                step: 0
            }, null, 2));

            console.log(await containerExec(['heliades', 'gentx', 'user0', '1000000000000000000ahelios', '--chain-id', '42000', '--keyring-backend=local', '--gas-prices', '1000000000ahelios', '--gas', '300000']));
            console.log(await containerExec(['heliades', 'collect-gentxs']));
            await startNode(options);
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log(await containerExec(['cat', '/root/.heliades/data/metadata.json']));
            resolve();
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

module.exports = testnetReset;