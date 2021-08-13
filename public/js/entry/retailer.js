function renderMap(lat, long) {
    mapkit.init({
        authorizationCallback: function (done) {
            fetch('/api/maps/token')
                .then(res => res.json())
                .then(data => {
                    done(data.token)
                })
        }
    });

    let title = document.getElementById('title-text').innerHTML;
    let MarkerAnnotation = mapkit.MarkerAnnotation
    let location = new mapkit.Coordinate(lat, long)
    let region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(lat, long),
        new mapkit.CoordinateSpan(0.01, 0.01)
    );
    let map = new mapkit.Map("index-map", {
        colorScheme: "dark"
    });
    let pin = new MarkerAnnotation(location, {color: "#00c756", title: title});
    map.showItems([pin]);
    map.region = region;
}

function getGames(id) {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/retailers/${id}/library`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let tableBody = document.getElementById("table-body");
            if (request.status === 200) {
                let data = JSON.parse(request.responseText)['data'];
                data.forEach(game => {
                    let link = document.createElement("a");
                    link.setAttribute("href", `/library/${game.id}`);
                    let title = document.createElement("th");
                    link.innerHTML = game.title;
                    title.appendChild(link);

                    let row = document.createElement("tr");
                    row.appendChild(title);
                    tableBody.appendChild(row);
                });
            } else {
            }
        }
    }

    request.send();
}