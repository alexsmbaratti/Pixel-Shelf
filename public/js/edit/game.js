let originalRetailerID = null;

function updateGameInfo(id) {
    let button = document.getElementById("edit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let data = {};

    let editedTitle = document.getElementById("title-text").value;
    let originalTitle = document.getElementById("title-text").getAttribute("placeholder");

    let editedEdition = document.getElementById("edition-text").value;
    let originalEdition = document.getElementById("edition-text").getAttribute("placeholder");

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

    let editedGift = document.getElementById("gift-check").checked;
    let originalGift = document.getElementById("gift-check").getAttribute("data-original");

    let retailerSelect = document.getElementById("retailer-selection");
    let editedRetailerID = retailerSelect[retailerSelect.selectedIndex].value;

    if (editedTitle !== originalTitle) {
        data['title'] = editedTitle;
    }
    if (editedEdition !== originalEdition) {
        data['edition'] = editedEdition;
    }
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
    if (String(editedGift) !== originalGift) {
        data['gift'] = editedGift;
    }
    if (originalRetailerID === null && editedRetailerID === -2) {

    } else if (editedRetailerID !== originalRetailerID) {
        data['retailerid'] = editedRetailerID;
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

function getRetailers(id = null) {
    originalRetailerID = id;

    let request = new XMLHttpRequest();
    request.open('GET', `/api/retailers`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let retailerSelect = document.getElementById("retailer-selection");
                let data = JSON.parse(request.responseText)['data'];
                let unknownOption = document.createElement('option');
                unknownOption.setAttribute('value', '-2');
                unknownOption.innerHTML = 'Unknown';
                if (id === null) {
                    unknownOption.selected = true;
                }
                retailerSelect.appendChild(unknownOption);
                data.forEach(retailer => {
                    let option = document.createElement('option');
                    option.setAttribute('value', retailer['id']);
                    if (retailer['subtext']) {
                        option.innerHTML = retailer['retailer'] + ' - ' + retailer['subtext'];
                    } else {
                        option.innerHTML = retailer['retailer'];
                    }
                    if (id === retailer['id']) {
                        option.selected = true;
                    }
                    retailerSelect.appendChild(option);
                });
            } else {
            }
        }
    }

    request.send();
}