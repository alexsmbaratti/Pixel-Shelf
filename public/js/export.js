function requestBackup() {
    let button = document.getElementById("submit");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('GET', `/api/export`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText)['data'];
            if (request.status === 200) {

            } else {
                button.setAttribute("class", "button is-link");
                button.disabled = false;
            }
        }
    }

    request.send();
}