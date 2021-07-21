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

    if (editedMSRP !== originalMSRP) {
        data['msrp'] = editedMSRP;
    }
    if (editedCost !== originalCost) {
        data['cost'] = editedCost;
    }
    if (editedUPC !== originalUPC) {
        data['upc'] = editedUPC;
    }

    let request = new XMLHttpRequest();
    request.open('PUT', `/api/library/${id}`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                location.href = "/library/" + id;
            } else {
                console.log(data.err);
            }
        }
    }

    if (data.constructor === Object && Object.keys(data).length === 0) {
        console.log("No changes detected.");
    } else {
        request.send(JSON.stringify(data));
    }
}