const { readFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile)

module.exports = async () => {
    const content = await readFileAsync('./dashboard/Models/index.html', { encoding: 'UTF-8'})

    return content;
}