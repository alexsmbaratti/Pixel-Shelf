let retailerText;
let subText;
let id;

function submitRetailerInfo() {
    let warningDiv = document.getElementById("warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("class", "has-text-danger");

    while (warningDiv.firstChild) {
        warningDiv.removeChild(warningDiv.firstChild);
    }

    retailerText = document.getElementById("retailer-text").value;
    subText = document.getElementById("subtext-text").value;
    if (retailerText.length === 0) { // If left blank
        warningMessage.innerHTML = "You must enter a retailer name.";
        warningDiv.appendChild(warningMessage);
        return;
    }

    if (subText.length === 0) { // If left blank
        subText = null;
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
        "subtext": subText
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