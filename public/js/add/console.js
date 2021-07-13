let consoleText;
let brandText;
let id;

function submitConsoleInfo() {
    let warningDiv = document.getElementById("warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("class", "has-text-danger");

    while (warningDiv.firstChild) {
        warningDiv.removeChild(warningDiv.firstChild);
    }

    consoleText = document.getElementById("name-text").value;
    brandText = document.getElementById("brand-text").value;
    if (consoleText.length === 0) { // If left blank
        warningMessage.innerHTML = "You must enter a platform name.";
        warningDiv.appendChild(warningMessage);
        return;
    }

    if (brandText.length === 0) { // If left blank
        warningMessage.innerHTML = "You must enter a brand name.";
        warningDiv.appendChild(warningMessage);
        return;
    }

    let button = document.getElementById("submit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/consoles`);
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

                updateCard('/html/console_completion.html');
            } else {
                button.setAttribute("class", "button is-link is-danger");
                button.disabled = false;
                console.log(data.err);
            }
        }
    }

    request.send(JSON.stringify({
        "name": consoleText,
        "brand": brandText
    }));
}

function updateCard(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.getElementById("add-card-div").innerHTML = request.responseText;
                if (url == '/html/console_completion.html') {
                    document.getElementById('console-title').innerHTML = consoleText;
                    document.getElementById('brand-title').innerHTML = brandText;
                    document.getElementById('library-view').setAttribute("href", "/platform/" + id);
                }
            } else {
                document.getElementById("add-card-div").innerText = "An error has occurred.";
            }
        }
    }
    request.send();
}