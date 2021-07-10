let gameID;
let editionID;
let libraryID;
let gameTitle;

function submitGameInfo() {
    let warningDiv = document.getElementById("warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("class", "has-text-danger");

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
    if (platformSelect[platformSelect.selectedIndex].id == -2) { // If left on Select Platform
        warningMessage.innerHTML = "You must select a platform.";
        warningDiv.appendChild(warningMessage);
        return;
    }
    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    if (platformSelect[platformSelect.selectedIndex].id != -1) { // The platform already exists
        let request = new XMLHttpRequest();
        request.open('POST', `/api/games`);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    gameID = data.id;
                    gameTitle = titleText;

                    let card = document.getElementById("add-card-div");
                    while (card.firstChild) {
                        card.removeChild(card.firstChild);
                    }

                    document.getElementById("edition-info-segment").setAttribute("class", "steps-segment is-active");
                    document.getElementById("game-info-segment").setAttribute("class", "steps-segment");

                    updateCard('/html/edition_info.html');
                } else {
                    console.log(data.err);
                }
            }
        }

        request.send(JSON.stringify({
            "title": titleText,
            "platform": platformSelect[platformSelect.selectedIndex].id
        }));
    } else {
        warningMessage.innerHTML = "Adding new platforms is not implemented yet.";
        warningDiv.appendChild(warningMessage);
        button.setAttribute("class", "button is-link");
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

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/editions`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                editionID = data.id;

                let card = document.getElementById("add-card-div");
                while (card.firstChild) {
                    card.removeChild(card.firstChild);
                }

                document.getElementById("destination-segment").setAttribute("class", "steps-segment is-active");
                document.getElementById("edition-info-segment").setAttribute("class", "steps-segment");

                updateCard('/html/destination.html');
            } else {
                console.log(data.err);
                button.setAttribute("class", "button is-danger");
                button.innerHTML = "Error!"
            }
        }
    }

    request.send(JSON.stringify({
        "edition": editionText.length == 0 ? "Standard Edition" : editionText,
        "upc": upcText,
        "msrp": msrpText,
        "gameID": gameID
    }));
}

function submitDestinationInfo() {
    if (!document.getElementById('collection-radio').checked && !document.getElementById('wishlist-radio').checked) {
        return;
    }

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    document.getElementById("destination-segment").setAttribute("class", "steps-segment");
    if (document.getElementById('collection-radio').checked) {
        document.getElementById("purchase-info-segment").setAttribute("class", "steps-segment is-active");
        updateCard('/html/purchase_info.html');
    } else if (document.getElementById('wishlist-radio').checked) {
        document.getElementById("completion-segment").setAttribute("class", "steps-segment is-active");
        updateCard('/html/wishlist_completion.html');
    }
}

function submitPurchaseInfo() {
    let cost = document.getElementById("cost-text").value;
    if (cost.length == 0) {
        cost = null;
    }

    let year = parseInt(document.getElementById("calendar-input").value.split('-')[0]);
    let month = parseInt(document.getElementById("calendar-input").value.split('-')[1]);
    let day = parseInt(document.getElementById("calendar-input").value.split('-')[2]);

    let conditionSelect = document.getElementById("condition-selection");
    let hasBox = document.getElementById("box-check").checked;
    let hasManual = document.getElementById("manual-check").checked;

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/library`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                libraryID = data.id;

                let card = document.getElementById("add-card-div");
                while (card.firstChild) {
                    card.removeChild(card.firstChild);
                }

                document.getElementById("completion-segment").setAttribute("class", "steps-segment is-active");
                document.getElementById("purchase-info-segment").setAttribute("class", "steps-segment");

                updateCard('/html/completion.html');
            } else {
                console.log(data.err);
                button.setAttribute("class", "button is-danger");
                button.innerHTML = "Error!"
            }
        }
    }

    request.send(JSON.stringify({
        "cost": cost,
        "month": month,
        "day": day,
        "year": year,
        "condition": conditionSelect.selectedIndex == 0,
        "box": hasBox,
        "manual": hasManual,
        "retailerID": null,
        "editionID": editionID
    }));
}

function submitWishlistInfo() {
    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/wishlist`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                libraryID = data.id; // Stand-in for wishlist ID

                let card = document.getElementById("add-card-div");
                while (card.firstChild) {
                    card.removeChild(card.firstChild);
                }

                document.getElementById("completion-segment").setAttribute("class", "steps-segment is-active");
                document.getElementById("purchase-info-segment").setAttribute("class", "steps-segment");

                updateCard('/html/wishlist_completion.html');
            } else {
                console.log(data.err);
                button.setAttribute("class", "button is-danger");
                button.innerHTML = "Error!"
            }
        }
    }

    request.send(JSON.stringify({
        "editionID": editionID
    }));
}

function updateCard(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.getElementById("add-card-div").innerHTML = request.responseText;
                if (url == '/html/completion.html') {
                    document.getElementById('game-title').innerHTML = gameTitle;
                    document.getElementById('library-view').setAttribute("href", "/library/" + libraryID);
                    document.getElementById('game-cover').setAttribute("src", "/library/" + gameID + "/cover");
                } else if (url == '/html/wishlist_completion.html') {
                    document.getElementById('game-title').innerHTML = gameTitle;
                    document.getElementById('library-view').setAttribute("href", "/wishlist/" + libraryID);
                    document.getElementById('game-cover').setAttribute("src", "/library/" + gameID + "/cover");
                }
            } else {
                document.getElementById("add-card-div").innerText = "An error has occurred.";
            }
        }
    }
    request.send();
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