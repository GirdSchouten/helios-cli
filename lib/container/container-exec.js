const containerIsRunning = require('./container-is-running');
const getContainer = require('./get-container');
const Stream = require('stream');
const Docker = require('dockerode');

function containerExec(commandLine = []) {
    return new Promise(async (resolve, reject) => {
        try {
            const isRunning = await containerIsRunning('node1');
            if (!isRunning) return reject('Container is not running');

            const { demuxStream } = (new Docker()).modem;
            const container = await getContainer();

            const exec = await container.exec({
                Cmd: commandLine,
                AttachStdout: true,
                AttachStderr: true,
            });

            exec.start((err, stream) => {
                if (err) return reject(err);

                let output = '';
                const stdout = new Stream.PassThrough();
                const stderr = new Stream.PassThrough();

                stdout.on('data', (data) => {
                    output += data.toString();
                });

                stderr.on('data', (data) => {
                    output += data.toString();
                    // console.error('stderr:', data.toString());
                });

                stream.on('end', () => {
                    resolve(output.trim());
                });

                // Démultiplexe stdout/stderr depuis le stream Docker brut
                demuxStream(stream, stdout, stderr);
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = containerExec;