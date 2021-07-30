function updateGameInfo(id) {
    let button = document.getElementById("edit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let data = {};

    let editedUPC = document.getElementById("upc-text").value;
    let originalUPC = document.getElementById("upc-text").getAttribute("placeholder");

    let editedMSRP = document.getElementById("msrp-text").value;
    let originalMSRP = document.getElementById("msrp-text").getAttribute("placeholder");

    let editedCost = document.getElementById("cost-text").value;
    let originalCost = document.getElementById("cost-text").getAttribute("placeholder");

    let editedIGDB = document.getElementById("igdb-text").value;
    let originalIGDB = document.getElementById("igdb-text").getAttribute("placeholder");

    let editedBox = document.getElementById("box-check").checked;
    let originalBox = document.getElementById("box-check").getAttribute("data-original");

    let editedManual = document.getElementById("manual-check").checked;
    let originalManual = document.getElementById("manual-check").getAttribute("data-original");

    if (editedMSRP !== originalMSRP) {
        data['msrp'] = editedMSRP;
    }
    if (editedCost !== originalCost) {
        data['cost'] = editedCost;
    }
    if (editedUPC !== originalUPC) {
        data['upc'] = editedUPC;
    }
    if (editedIGDB !== originalIGDB) {
        data['igdbURL'] = editedIGDB;
    }
    if (String(editedBox) !== originalBox) {
        data['box'] = editedBox;
    }
    if (String(editedManual) !== originalManual) {
        data['manual'] = editedManual;
    }

    let request = new XMLHttpRequest();
    request.open('PUT', `/api/library/${id}`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 204) {
                window.location.href = "/library/" + id;
            } else {
                console.log(data.err);
            }
        }
    }

    if (data.constructor === Object && Object.keys(data).length === 0) {
        console.log("No changes detected.");
        window.location.href = "/library/" + id;
    } else {
        request.send(JSON.stringify(data));
    }
}