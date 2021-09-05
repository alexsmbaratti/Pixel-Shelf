let retailerText;
let subText;
let id;
let latitude;
let longitude;

function submitRetailerInfo() {
    let warningDiv = document.getElementById("warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("class", "has-text-danger");

    while (warningDiv.firstChild) {
        warningDiv.removeChild(warningDiv.firstChild);
    }

    retailerText = document.getElementById("retailer-text").value;
    subText = document.getElementById("subtext-text").value;
    let urlText = document.getElementById("url-text").value;
    let isOnline = document.getElementById("tab-online").classList.contains('is-active');
    if (retailerText.length === 0) { // If left blank
        warningMessage.innerHTML = "You must enter a retailer name.";
        warningDiv.appendChild(warningMessage);
        return;
    }

    if (subText.length === 0) { // If left blank
        subText = null;
    }

    if (urlText.length === 0) { // If left blank
        urlText = null;
    }

    if (!isOnline) {
        latitude = document.getElementById("latitude-text").value;
        if (isNaN(latitude) || isNaN(parseFloat(latitude))) {
            latitude = null;
        }

        longitude = document.getElementById("longitude-text").value;
        if (isNaN(longitude) || isNaN(parseFloat(longitude))) {
            longitude = null;
        }
    }

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/retailers`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                let card = document.getElementById("add-card-div");
                id = data['id'];

                while (card.firstChild) {
                    card.removeChild(card.firstChild);
                }

                document.getElementById("console-info-segment").setAttribute("class", "steps-segment");
                document.getElementById("completion-segment").setAttribute("class", "steps-segment is-active");

                updateCard('/html/retailer_completion.html');
            } else {
                button.setAttribute("class", "button is-link is-danger");
                button.disabled = false;
                console.log(data.err);
            }
        }
    }

    request.send(JSON.stringify({
        "retailer": retailerText,
        "subtext": subText,
        "online": isOnline,
        "lat": latitude,
        "long": longitude,
        "url": urlText
    }));
}

function updateCard(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.getElementById("add-card-div").innerHTML = request.responseText;
                if (url == '/html/retailer_completion.html') {
                    document.getElementById('retailer-title').innerHTML = retailerText;
                    if (subText !== null) {
                        document.getElementById('subtext-title').innerHTML = subText;
                    }
                    document.getElementById('retailer-view').setAttribute("href", "/retailers/" + id);
                }
            } else {
                document.getElementById("add-card-div").innerText = "An error has occurred.";
            }
        }
    }
    request.send();
}

function toggleOnline(isOnline) {
    let physicalDiv = document.getElementById("physical-div");
    let onlineDiv = document.getElementById("online-div");

    if (!isOnline) {
        document.getElementById("tab-online").classList.remove('is-active');
        document.getElementById("tab-brick").classList.add('is-active');

        onlineDiv.setAttribute('class', 'is-hidden');
        physicalDiv.setAttribute('class', '');
    } else {
        document.getElementById("tab-brick").classList.remove('is-active');
        document.getElementById("tab-online").classList.add('is-active');

        physicalDiv.setAttribute('class', 'is-hidden');
        onlineDiv.setAttribute('class', '');
    }
}