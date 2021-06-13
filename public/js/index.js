let request = new XMLHttpRequest();
request.open('GET', `/library/size`);

request.onreadystatechange = function () {
    if (request.readyState === 4) {
        let data = JSON.parse(request.responseText);
        if (request.status === 200) {
            document.getElementById('game-count-text').innerHTML = data.size + ' Games';
        } else {
            console.log("TODO: Handle error!")
        }
    }
}

request.send();