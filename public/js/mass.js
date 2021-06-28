function append(text) {
    let schemaField = document.getElementById("schema");
    schemaField.value += text;
}

// Notes: Cannot have commas in variable names; cannot have two variables next to each other without delimiters; game consoles must exist prior; game console is case-sensitive
function submit() {
    if (true) {
        let button = document.getElementById("submit");
        let schemaText = document.getElementById("schema").value;
        let massText = document.getElementById("mass-text").value;
        let ignoreFirstLine = document.getElementById("ignore-check").checked;

        button.setAttribute("class", "button is-link is-loading");
        button.disabled = true;

        let request = new XMLHttpRequest();
        request.open('POST', `/add/mass`);
        request.setRequestHeader('Content-Type', 'application/json');

        var parsed = [];

        if (ignoreFirstLine) {
            let firstLineIndex = massText.indexOf('\n') + 2;
            massText = massText.substring(firstLineIndex);
        }

        massText.split('\n').forEach(function (line) {
            var obj = {};
            console.log(line);
            let schemaBuffer = schemaText;
            let massBuffer = line;
            while (schemaBuffer.length > 0) {
                let schemaChar = schemaBuffer.charAt(0);
                let massChar = massBuffer.charAt(0);
                if (schemaChar == '{') {
                    let tempSub = schemaBuffer.indexOf('}');
                    let nextDelimiter = schemaBuffer.charAt(tempSub + 1);
                    let keyData = massBuffer.substring(0, massBuffer.indexOf(nextDelimiter));

                    switch (schemaBuffer.substring(1, tempSub)) {
                        case 'TITLE':
                            obj["title"] = keyData;
                            break;
                        case 'PLATFORM':
                            obj["platform"] = keyData;
                            break;
                        case 'YEAR':
                            obj["year"] = parseInt(keyData);
                            break;
                        case 'MONTH':
                            obj["month"] = parseInt(keyData);
                            break;
                        case 'DAY':
                            obj["day"] = parseInt(keyData);
                            break;
                        case 'IGDB':
                            obj["igdb-url"] = keyData;
                            break;
                        case 'COST':
                            if (keyData.charAt(0) == '$') {
                                obj["cost"] = keyData.substring(1);
                            } else {
                                obj["cost"] = keyData;
                            }
                            break;
                        case 'UPC':
                            if (keyData.length == 0) { // Default Value
                                obj["upc"] = null;
                            } else {
                                obj["upc"] = keyData;
                            }
                            break;
                        case 'EDITION':
                            if (keyData.length == 0) { // Default Value
                                obj["edition"] = "Standard Edition";
                            } else {
                                obj["edition"] = keyData;
                            }
                            break;
                        case 'MSRP':
                            if (keyData.charAt(0) == '$') {
                                obj["msrp"] = keyData.substring(1);
                            } else {
                                obj["msrp"] = keyData;
                            }
                        case 'IGNORE':
                        default:
                    }
                    schemaBuffer = schemaBuffer.substring(tempSub);
                    massBuffer = massBuffer.substring(massBuffer.indexOf(nextDelimiter));
                } else {
                    if (schemaChar == massChar) {
                        schemaBuffer = schemaBuffer.substring(1);
                        massBuffer = massBuffer.substring(1);
                    } else {
                        schemaBuffer = schemaBuffer.substring(1);
                    }
                }
            }
            if (obj["condition"] == null) {
                obj["condition"] = true; // Default to new copy
            }
            console.log(obj);
            parsed.push(obj);
        });

        let params = parsed;

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    window.location.href = `/library/`;
                } else {
                    console.log("TODO: Handle error!");
                    button.setAttribute("class", "button is-link");
                    button.disabled = false;
                }
            }
        }

        request.send(JSON.stringify(params));
    }
}

function validateFields() {
    let requiredParams = [',', '{TITLE}', '{PLATFORM}'];
    let schemaText = document.getElementById("schema").value;
    if (schemaText.length > 0) {
        // TODO: Iterate over required params
        if (document.getElementById("mass-text").value.length > 0) {
            return true;
        }
    }
    return false;
}