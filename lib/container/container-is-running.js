const getContainer = require('./get-container');

module.exports = async () => {
    try {
        const container = await getContainer();

        return new Promise((resolve, reject) => {
            container.inspect(function (err, data) {
                if (err || !data) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    } catch (err) {
        return false;
    }
};