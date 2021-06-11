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