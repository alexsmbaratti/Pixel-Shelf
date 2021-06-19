var config = require('../config.json');
const {spawn} = require('child_process');

function EInkDriver() {
    EInkDriver.prototype.useEInk = config['useEInk'];
}

EInkDriver.prototype.drawLibrarySize = function drawLibrarySize() {
    if (EInkDriver.prototype.useEInk) {
        const python = spawn('python3', ['library_size.py']);
        python.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        python.on('close', (code) => {
            console.log("Existed with code " + code);
        });
    }
}

module.exports = EInkDriver;