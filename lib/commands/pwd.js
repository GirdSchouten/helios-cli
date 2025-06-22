const getPathHelios = require('../utils/getPathHelios');

const pwd = () => {
    return new Promise((resolve, reject) => {
        const pathHelios = getPathHelios();
        if (!pathHelios) {
            reject("No path found, please start a node first");
            return;
        }
        console.log(pathHelios);
        resolve();
    });
}

module.exports = pwd;