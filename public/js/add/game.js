let gameID;
let editionID;

function submitGameInfo() {
    let warningDiv = document.getElementById("game-warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.classList.add("has-text-danger");

    while (warningDiv.firstChild) {
        warningDiv.removeChild(warningDiv.firstChild);
    }

    let titleText = document.getElementById("title-text").value;
    let platformSelect = document.getElementById("platform-selection");
    if (titleText.length == 0) { // If left blank
        warningMessage.innerHTML = "You must enter a game title.";
        warningDiv.appendChild(warningMessage);
        return;
    }
    if (platformSelect[platformSelect.selectedIndex].value == -2) { // If left on Select Platform
        warningMessage.innerHTML = "You must select a platform.";
        warningDiv.appendChild(warningMessage);
        return;
    }
    let button = document.getElementById("game-submit-button");
    button.classList.add("is-loading");
    button.disabled = true;

    if (platformSelect[platformSelect.selectedIndex].value != -1) { // The platform already exists
        let request = new XMLHttpRequest();
        request.open('POST', `/api/games`);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    gameID = data.id;

                    document.getElementById('game-title').innerHTML = titleText;
                    document.getElementById('game-cover').setAttribute("src", "/api/games/" + gameID + "/cover");

                    swapStepsProgress('game-info-segment', 'edition-info-segment');
                    swapDiv('game-info-div', 'edition-info-div');
                } else {
                    warningMessage.innerHTML = data.err;
                    warningDiv.appendChild(warningMessage);
                }
            }
        }

        request.send(JSON.stringify({
            "title": titleText,
            "platform": platformSelect[platformSelect.selectedIndex].value
        }));
    } else {
        warningMessage.innerHTML = "Adding new platforms is not implemented yet.";
        warningDiv.appendChild(warningMessage);
        button.classList.remove("is-loading");
        button.disabled = false;
    }
}

function submitEditionInfo() {
    let editionText = document.getElementById("edition-text").value;
    let upcText = document.getElementById("upc-text").value;
    let msrpText = document.getElementById("msrp-text").value;

    if (isNaN(msrpText) && msrpText.length > 0) {
        return;
    }

    if (msrpText.length === 0) {
        msrpText = null;
    }

    if (upcText.length === 0) {
        upcText = null;
    }

    let button = document.getElementById("edition-submit-button");
    button.classList.add("is-loading");
    button.disabled = true;

    let isDigital = document.getElementById("digital-check").checked;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/editions`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                editionID = data.id;

                swapStepsProgress('edition-info-segment', 'destination-segment');
                swapDiv('edition-info-div', 'destination-div');
            } else {
                console.log(data.err);
                button.classList.add("is-danger");
                button.classList.remove("is-loading");
                button.innerHTML = "Error!"
            }
        }
    }

    request.send(JSON.stringify({
        "edition": editionText.length == 0 ? "Standard Edition" : editionText,
        "upc": upcText,
        "msrp": msrpText,
        "digital": isDigital,
        "gameID": gameID
    }));
}

function submitDestinationInfo() {
    if (!document.getElementById('collection-radio').checked && !document.getElementById('wishlist-radio').checked) {
        return;
    }

    let button = document.getElementById("destination-submit-button");
    button.classList.add("is-loading");
    button.disabled = true;

    swapStepsProgress('destination-segment', 'purchase-info-segment');
    if (document.getElementById('collection-radio').checked) {
        getRetailers();
    } else if (document.getElementById('wishlist-radio').checked) {
        swapDiv('destination-div', 'wishlist-info-div');
    }
}

function submitPurchaseInfo() {
    let cost = document.getElementById("cost-text").value;
    if (cost.length == 0) {
        cost = null;
    }

    let timestamp = new Date(document.getElementById("calendar-input").value).toISOString();
    let dateCheck = document.getElementById("date-check").checked;
    if (dateCheck) {
        timestamp = null;
    }

    let conditionSelect = document.getElementById("condition-selection");
    let hasBox = !document.getElementById("box-button").classList.contains('is-outlined');
    let hasManual = !document.getElementById("manual-button").classList.contains('is-outlined');
    let isGift = document.getElementById("gift-check").checked;

    let notes = document.getElementById("notes-field").value;
    if (notes.length === 0) {
        notes = null;
    }

    let retailerSelect = document.getElementById("retailer-selection");
    let retailerID = retailerSelect[retailerSelect.selectedIndex].value;
    if (retailerID < 1) {
        retailerID = null;
    }

    let button = document.getElementById("submit-button");
    button.classList.add("is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/library`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                let libraryID = data.id;
                document.getElementById('library-view').setAttribute("href", "/library/" + libraryID);

                swapStepsProgress('purchase-info-segment', 'completion-segment');
                swapDiv('purchase-info-div', 'completion-div');
            } else {
                console.log(data.err);
                button.classList.add("is-danger");
                button.classList.remove("is-loading");
                button.innerHTML = "Error!"
            }
        }
    }

    request.send(JSON.stringify({
        "cost": cost,
        "timestamp": timestamp,
        "condition": conditionSelect.selectedIndex == 0,
        "box": hasBox,
        "manual": hasManual,
        "retailerID": retailerID,
        "gift": isGift,
        "notes": notes,
        "editionID": editionID
    }));
}

function submitWishlistInfo() {
    let button = document.getElementById("submit-button");
    button.classList.add("is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/wishlist`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                let wishlistID = data.id;

                document.getElementById('library-view').setAttribute("href", "/wishlist/" + wishlistID);
                document.getElementById('view-in-button').innerHTML = "View in Wishlist";

                swapStepsProgress('purchase-info-segment', 'completion-segment');
                swapDiv('wishlist-info-div', 'completion-div');
            } else {
                console.log(data.err);
                button.classList.add("is-danger");
                button.classList.remove("is-loading");
                button.innerHTML = "Error!"
            }
        }
    }

    request.send(JSON.stringify({
        "editionID": editionID
    }));
}

function giftCheck() {
    let giftCheck = document.getElementById("gift-check").checked;
    if (giftCheck) {
        document.getElementById("cost-text").disabled = true;
    } else {
        document.getElementById("cost-text").disabled = false;
    }
}

function dateCheck() {
    let dateCheck = document.getElementById("date-check").checked;
    if (dateCheck) {
        document.getElementById("calendar-input").disabled = true;
    } else {
        document.getElementById("calendar-input").disabled = false;
    }
}

function getRetailers() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/retailers`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let retailerSelect = document.getElementById("retailer-selection");
                let data = JSON.parse(request.responseText)['data'];
                data.forEach(retailer => {
                    let option = document.createElement('option');
                    option.setAttribute('value', retailer['id']);
                    if (retailer['subtext']) {
                        option.innerHTML = retailer['retailer'] + ' - ' + retailer['subtext'];
                    } else {
                        option.innerHTML = retailer['retailer'];
                    }
                    retailerSelect.appendChild(option);
                });

                let newRetailerOption = document.createElement('option');
                newRetailerOption.setAttribute('value', '-1');
                newRetailerOption.innerHTML = '-- New Retailer --';
                retailerSelect.appendChild(newRetailerOption);

                swapDiv('destination-div', 'purchase-info-div');
            } else {
                // TODO: Allow a retry
            }
        }
    }

    request.send();
}

function toggleButton(buttonID) {
    let button = document.getElementById(buttonID);
    if (button.classList.contains('is-outlined')) {
        button.classList.remove('is-outlined');
        button.classList.remove('is-light');
        button.classList.add('is-primary');
    } else {
        button.classList.add('is-outlined');
        button.classList.remove('is-primary');
        button.classList.add('is-light');
    }
}