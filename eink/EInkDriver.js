var use = require('../config.json')['e-ink'];
const PythonShell = require('python-shell').PythonShell;

function EInkDriver() {
}

EInkDriver.prototype.drawLibrarySize = function drawLibrarySize() {
    new Promise(function (resolve, reject) {
        if (use) {
            console.log("Drawing library size...");
            let options = {
                mode: 'text',
                args: ['-1']
            };
            PythonShell.run('eink/library_size.py', options, function (err, res) {
		if (err) { throw err; }
                console.log(res);
            });
        }
    });
}

module.exports = EInkDriver;
