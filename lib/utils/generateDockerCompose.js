const yaml = require('yaml');
const os = require('os');
const path = require('path');

const generateDockerCompose = (options) => {
    let services = {};
    let baseIp = 2;
    let nodeName = 'node1';

    let volumePath = `./data/${nodeName}/.heliades`;

    if (os.platform() === 'win32') {
        const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
        volumePath = path.join(localAppData, 'Helios', nodeName, '.heliades');
        // Docker don't like backslashes
        volumePath = volumePath.replace(/\\/g, '/');
    }

    let port = options.argv.port || 8080;

    services[nodeName] = {
        build: "latest",
        image: "heliosfoundation/docker-helios-nodemanager:latest",
        container_name: nodeName,
        ports: [
            `${port}:8080`,
            `${8545}:8545`,
            `${8546}:8546`,
            `${8547}:8547`,
            `${1317}:1317`,
            `${26657}:26657`,
            `${26656}:26656`,
            `${10337}:10337`,
            `${9090}:9090`
        ],
        networks: {
            heliosnet: { ipv4_address: `192.168.1.${baseIp}` }
        },
        command: "npm run prod",
        environment: {
            MANAGER_ACTIONS: JSON.stringify([])
        },
        volumes: [
            `${volumePath}:/root/.heliades`
        ]
    };

    const dockerCompose = {
        version: '3.8',
        services,
        networks: {
            heliosnet: {
                driver: "bridge",
                ipam: { config: [{ subnet: "192.168.1.0/24" }] }
            }
        }
    };

    return yaml.stringify(dockerCompose);
};

module.exports = generateDockerCompose;