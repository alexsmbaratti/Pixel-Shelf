var config = require('../config.json');
const PythonShell = require('python-shell').PythonShell;

function EInkDriver() {
    EInkDriver.prototype.useEInk = config['useEInk'];
}

EInkDriver.prototype.drawLibrarySize = function drawLibrarySize() {
    new Promise(function (resolve, reject) {
        if (EInkDriver.prototype.useEInk) {
            let options = {
                mode: 'text',
                args: ['-1']
            };
            PythonShell.run('./eink/library_size.py', options, function (err, res) {
                console.log(res);
            });
        }
    });
}

module.exports = EInkDriver;