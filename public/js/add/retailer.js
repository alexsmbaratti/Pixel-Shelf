function submitRetailerInfo() {
    let latitude;
    let longitude;

    let warningDiv = document.getElementById("warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("class", "has-text-danger");

    while (warningDiv.firstChild) {
        warningDiv.removeChild(warningDiv.firstChild);
    }

    let retailerText = document.getElementById("retailer-text").value.trim();
    let subText = document.getElementById("subtext-text").value.trim();
    let urlText = document.getElementById("url-text").value.trim();
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
        latitude = document.getElementById("latitude-text").value.trim();
        if (isNaN(latitude) || isNaN(parseFloat(latitude))) {
            latitude = null;
        }

        longitude = document.getElementById("longitude-text").value.trim();
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
                swapStepsProgress('console-info-segment', 'completion-segment');
                swapDiv('retailer-info-div', 'retailer-completion-div');

                document.getElementById('retailer-title').innerHTML = retailerText;
                document.getElementById('retailer-view').setAttribute("href", "/retailers/" + data['id']);
                if (subText !== null) {
                    document.getElementById('subtext-title').innerHTML = subText;
                }
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
