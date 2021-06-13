function getIGDBInfo(id) {
    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/library/${id}/igdb`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            let data = JSON.parse(igdbRequest.responseText);
            if (igdbRequest.status === 200) {
                console.log(data);
            } else {
                console.log("TODO: Handle error!")
            }
        }
    }

    igdbRequest.send();
}

function deleteGame(id) {
    let request = new XMLHttpRequest();
    request.open('DELETE', `/library/${id}`);
    request.setRequestHeader('Content-Type', 'application/json');

    let params = {
        "id": id
    };

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 204) {
                console.log("Success!");
            } else {
                console.log("TODO: Handle error!")
            }
        }
    }

    request.send(JSON.stringify(params));
}