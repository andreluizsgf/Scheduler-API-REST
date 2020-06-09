const fs = require('fs');

const readFile = (returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile("./src/database/rules.json", encoding, (err, data) => {
        if (err) {
            throw err;
        }
        return returnJson ? JSON.parse(data) : data;
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            throw err;
        }

        callback();
    });
};

module.exports = {readFile, writeFile }