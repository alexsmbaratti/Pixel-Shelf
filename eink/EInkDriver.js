var use = require('../config.json')['e-ink'];
const PythonShell = require('python-shell').PythonShell;
var SQLite3Driver = require('../models/SQLite3Driver');

function EInkDriver() {
    EInkDriver.prototype.driver = new SQLite3Driver();
}

EInkDriver.prototype.drawLibrarySize = function drawLibrarySize() {
    new Promise(function (resolve, reject) {
        if (use) {
            console.log("Drawing library size...");
            EInkDriver.prototype.driver.getLibrarySize().then(result => {
                let options = {
                    mode: 'text',
                    args: [result]
                };
                PythonShell.run('eink/library_size.py', options, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log(res);
                });
            }).catch(err => {
                console.log(err);
            });
        }
    });
}

EInkDriver.prototype.drawGame = function drawGame(upc) {
    new Promise(function (resolve, reject) {
        if (use) {
            console.log("Querying game by UPC...");
            EInkDriver.prototype.driver.lookupByUPC(upc).then(result => {
                let options = {
                    mode: 'text',
                    args: [result.title, result.platform]
                };
                PythonShell.run('eink/game_display.py', options, function (err, res) {
                    if (err) {
                        throw err;
                    }
                    console.log(res);
                });
            }).catch(err => {
                console.log(err);
            });
        }
    });
}

module.exports = EInkDriver;
