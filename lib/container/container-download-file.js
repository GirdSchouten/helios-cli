const fs = require('fs');

const containerDownloadFile = async (container, filePath, outputPath) => {
    return new Promise(async (resolve, reject) => {
        container.getArchive({ path: filePath }, (err, stream) => {
            if (err) {
              console.error('Error fetching archive:', err);
              reject(err);
              return;
            }
          
            const output = fs.createWriteStream(outputPath);
          
            stream.pipe(output);
          
            output.on('finish', () => {
              console.log('File has been downloaded successfully');
              resolve();
            });
          
            output.on('error', (err) => {
              console.error('Error writing file:', err);
              reject(err);
            });
        });
    })
}

module.exports = containerDownloadFile;