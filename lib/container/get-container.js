const Docker = require('dockerode');

module.exports = async () => {
    try {
        const docker = new Docker();
        const container = docker.getContainer('node1');

        return container;
    } catch (err) {
        throw new Error('Container not found');
    }
};