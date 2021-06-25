let gameID;
let editionID;
let gameTitle;

function submitGameInfo() {
    let titleText = document.getElementById("title-text").value;
    let platformSelect = document.getElementById("platform-selection");
    if (titleText.length == 0) { // If left blank
        return;
    }
    if (platformSelect[platformSelect.selectedIndex].id == -2) { // If left on Select Platform
        return;
    }
    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    if (platformSelect[platformSelect.selectedIndex].id != -1) { // The platform already exists
        let request = new XMLHttpRequest();
        request.open('POST', `/add/game`);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    console.log(data);
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
    }
}

function submitEditionInfo() {
    let editionText = document.getElementById("edition-text").value;
    let upcText = document.getElementById("upc-text").value;
    let msrpText = document.getElementById("msrp-text").value;

    let edition;
    if (editionText.length == 0) { // If left blank
        edition = 'Standard Edition';
    } else {
        edition = editionText;
    }
    if (isNaN(msrpText) && msrpText.length > 0) {
        return;
    }

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/add/edition`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                console.log(data);
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
        "edition": edition,
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

    document.getElementById("purchase-info-segment").setAttribute("class", "steps-segment is-active");
    document.getElementById("destination-segment").setAttribute("class", "steps-segment");

    updateCard('/html/purchase_info.html');
}

function submitPurchaseInfo() {
    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    document.getElementById("completion-segment").setAttribute("class", "steps-segment is-active");
    document.getElementById("purchase-info-segment").setAttribute("class", "steps-segment");

    updateCard('/html/completion.html');
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
                    document.getElementById('game-cover').setAttribute("src", "/library/" + gameID + "/covers");
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