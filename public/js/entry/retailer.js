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
            if (request.status === 200) {
                let data = JSON.parse(request.responseText)['data'];
                console.log(data);
            } else {
            }
        }
    }

    request.send();
}