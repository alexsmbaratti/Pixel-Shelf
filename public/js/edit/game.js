function updateGameInfo(id) {
    let button = document.getElementById("edit-button");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    let request = new XMLHttpRequest();
    request.open('PUT', `/api/library/${id}`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {

            } else {
                console.log(data.err);
            }
        }
    }

    request.send(JSON.stringify({}));
}