let consoleText;
let brandText;

function submitConsoleInfo() {
    let warningDiv = document.getElementById("warning-div");
    let warningMessage = document.createElement("p");
    warningMessage.setAttribute("class", "has-text-danger");

    while (warningDiv.firstChild) {
        warningDiv.removeChild(warningDiv.firstChild);
    }

    consoleText = document.getElementById("name-text").value.trim();
    brandText = document.getElementById("brand-text").value.trim();
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
                swapStepsProgress('console-info-segment', 'completion-segment');
                swapDiv('console-info-div', 'completion-div');

                document.getElementById('console-title').innerHTML = consoleText;
                document.getElementById('brand-title').innerHTML = brandText;
                document.getElementById('library-view').setAttribute("href", "/platforms/" + data['id']);
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