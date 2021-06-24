let gameID;

function submit() {
    if (validateFields()) {
        let platformSelect = document.getElementById("platform-selection");
        let conditionSelect = document.getElementById("condition-selection");

        let titleText = document.getElementById("title-text").value;
        let editionText = document.getElementById("edition-text").value;
        let msrpText = document.getElementById("msrp-text").value;
        let costText = document.getElementById("cost-text").value;
        let igdbText = document.getElementById("igdb-text").value;
        let upcText = document.getElementById("upc-text").value;

        let request = new XMLHttpRequest();
        request.open('POST', `/add`);
        request.setRequestHeader('Content-Type', 'application/json');

        let params = {
            "title": titleText,
            "platform": platformSelect[platformSelect.selectedIndex].id,
            "edition": editionText.length == 0 ? "Standard Edition" : editionText,
            "condition": conditionSelect.selectedIndex == 0,
            "msrp": msrpText.length == 0 ? "59.99" : msrpText,
            "cost": costText.length == 0 ? "59.99" : costText,
            "month": 1,
            "day": 1,
            "year": 1,
            "upc": upcText.length == 0 ? null : upcText,
            "igdb-url": igdbText.length == 0 ? null : igdbText
        };

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    window.location.href = `/library/${data.id}`;
                } else {
                    console.log("TODO: Handle error!")
                }
            }
        }

        request.send(JSON.stringify(params));
    }
}

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
        request.open('POST', `/add/gameinfo`);
        request.setRequestHeader('Content-Type', 'application/json');

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    console.log(data);
                    gameID = data.id;

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

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    document.getElementById("destination-segment").setAttribute("class", "steps-segment is-active");
    document.getElementById("edition-info-segment").setAttribute("class", "steps-segment");

    updateCard('/html/destination.html');
}

function submitDestinationInfo() {
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