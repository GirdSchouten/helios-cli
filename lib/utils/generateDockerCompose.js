const yaml = require('yaml');
const os = require('os');
const path = require('path');

const generateDockerCompose = (options) => {
    let services = {};
    let numberOfNodes = Number(options.argv["_"][1]) || 1;
    let baseIp = 2;
    let port = options.argv.port || 8080;

    for (let i = 0; i < numberOfNodes; i++) {
        let nodeName = `node${i + 1}`;
        let volumePath = `./data/${nodeName}/.heliades`;

        if (os.platform() === 'win32') {
            const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
            volumePath = path.join(localAppData, 'Helios', nodeName, '.heliades');
            // Docker don't like backslashes
            volumePath = volumePath.replace(/\\/g, '/');
        }
        services[nodeName] = {
            build: "latest",
            image: "heliosfoundation/docker-helios-nodemanager:latest",
            container_name: nodeName,
            ports: [
                `${port + i}:8080`,
                i === 0 ? `${8545}:8545` : undefined,
                i === 0 ? `${8546}:8546` : undefined,
                i === 0 ? `${8547}:8547` : undefined,
                i === 0 ? `${1317}:1317` : undefined,
                i === 0 ? `${26657}:26657` : undefined,
                i === 0 ? `${26656}:26656` : undefined,
                i === 0 ? `${10337}:10337` : undefined,
                i === 0 ? `${9090}:9090` : undefined
            ].filter((x) => x !== undefined),
            networks: {
                heliosnet: { ipv4_address: `192.168.1.${baseIp + i}` }
            },
            command: "npm run prod",
            environment: {
                MANAGER_ACTIONS: JSON.stringify([])
            },
            volumes: [
                `${volumePath}:/root/.heliades`
            ]
        };
    }

    const dockerCompose = {
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