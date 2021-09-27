function renderCostChart(msrp = null, cost = null, sold = null) {
    let labels = [];
    let data = [];
    if (msrp != null) {
        data.push(msrp);
        labels.push('MSRP');
    }
    if (cost != null) {
        data.push(cost);
        labels.push('Bought at');
    }
    if (sold != null) {
        data.push(sold);
        labels.push('Sold For');
    }
    let borderColor;
    let backgroundColor;
    if (cost > msrp) { // Paid over MSRP
        borderColor = 'hsl(15, 100%, 39%)';
        backgroundColor = 'hsla(15, 100%, 39%, .2)';
    } else {
        borderColor = 'hsl(146, 100%, 39%)';
        backgroundColor = 'hsla(146, 100%, 39%, .2)';
    }

    let chart = new Chart(document.getElementById('cost-chart').getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                scaleFontColor: "#FFFFFF",
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                data: data
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: false,
                text: 'Cost Breakdown',
                fontColor: 'rgb(255, 255, 255)',
                fontSize: 22
            },
            animation: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: 'rgb(255, 255, 255)'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'rgb(255, 255, 255)',
                        callback: function (value, index, values) {
                            return '$' + value;
                        }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        if (data['labels'][tooltipItem[0]['index']] == 'Bought at') {
                            return 'Cost'
                        }
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
                        return '$' + data['datasets'][0]['data'][tooltipItem['index']];
                    },
                    afterLabel: function (tooltipItem, data) {
                        if (msrp != null && cost != null) {
                            if (tooltipItem['label'] == 'Bought at') {
                                let savings = calculateSavings(msrp, cost);
                                if (savings > 0) {
                                    return 'Savings of ' + savings + '%';
                                }
                            }
                        }
                    }
                },
                displayColors: false
            }
        }
    });
}

function getIGDBInfo(id, ratingOrg = 'ESRB') {
    let loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    loader.setAttribute("id", "igdb-loader");
    document.getElementById("loading-div").appendChild(loader);

    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/api/games/${id}/igdb`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            let data = JSON.parse(igdbRequest.responseText)['data'];
            if (igdbRequest.status === 200) {
                document.getElementById("igdb-loader").remove();
                document.getElementById("description").innerHTML = data['description'];
                document.getElementById("igdb-link").innerHTML = 'View on IGDB';
                let tagsDiv = document.getElementById("tags-div");
                data['genres'].forEach(genre => {
                    let genreTag = document.createElement("span");
                    genreTag.setAttribute("class", "tag is-light mr-3");
                    genreTag.innerHTML = genre['description'];
                    tagsDiv.appendChild(genreTag);
                });
                data['ratings'].forEach(rating => {
                    if (rating['ratingorg'] == ratingOrg) {
                        let ratingFigure = document.getElementById('rating-figure');
                        let image = document.createElement("img");
                        image.setAttribute("src", "/images/ratings/" + rating['id'] + ".jpg");
                        ratingFigure.appendChild(image);
                    }
                });
            } else {
                document.getElementById("igdb-loader").remove();
                document.getElementById("description").innerHTML = "Failed to load IGDB information!";
                document.getElementById("igdb-link").innerHTML = 'View on IGDB';
            }
        }
    }

    igdbRequest.send();
}

function deleteGame(id) {
    let request = new XMLHttpRequest();
    request.open('DELETE', `/api/library/${id}`);
    request.setRequestHeader('Content-Type', 'application/json');

    let button = document.getElementById("delete-button");
    button.setAttribute("class", "button is-danger is-loading");
    button.disabled = true;

    let params = {
        "id": id
    };

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 204) {
                location.href = "/library";
            } else {
                button.setAttribute("class", "button is-danger");
                button.disabled = false;
            }
        }
    }

    request.send(JSON.stringify(params));
}

function changeProgress(libraryID, progress) {
    let request = new XMLHttpRequest();
    request.open('PUT', `/api/library/${libraryID}/progress`);
    request.setRequestHeader('Content-Type', 'application/json');

    let params = {
        "progress": progress
    };

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 204) {
                document.getElementById("owned-segment").setAttribute("class", "steps-segment");
                document.getElementById("backlog-segment").setAttribute("class", "steps-segment");
                document.getElementById("playing-segment").setAttribute("class", "steps-segment");
                document.getElementById("completed-segment").setAttribute("class", "steps-segment");
                switch (progress) {
                    case 0:
                        document.getElementById("owned-segment").setAttribute("class", "steps-segment is-active");
                        break;
                    case 1:
                        document.getElementById("backlog-segment").setAttribute("class", "steps-segment is-active");
                        break;
                    case 2:
                        document.getElementById("playing-segment").setAttribute("class", "steps-segment is-active");
                        break;
                    case 3:
                        document.getElementById("completed-segment").setAttribute("class", "steps-segment is-active");
                        break;
                    default:
                }
            } else {
            }
        }
    }

    request.send(JSON.stringify(params));
}

function calculateSavings(msrp, cost) {
    return ((1 - (cost / msrp)) * 100).toFixed(2);
}

function print(id) {
    let request = new XMLHttpRequest();
    request.open('POST', `/api/thermal-printer/${id}`);
    request.setRequestHeader('Content-Type', 'application/json');

    let button = document.getElementById("print-button");
    button.setAttribute("class", "button is-success is-loading");
    button.disabled = true;

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                button.setAttribute("class", "button is-success");
                button.innerHTML = 'Printed!';
            } else {
                button.setAttribute("class", "button is-danger");
            }
        }
    }

    request.send();
}

function getRetailerInfo(retailerID) {
    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/api/retailers/${retailerID}`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            if (igdbRequest.status === 200) {
                let data = JSON.parse(igdbRequest.responseText)['data'];
                document.getElementById('retailer-text').innerHTML = data['retailer'];
                if (!data['online']) {
                    document.getElementById('online-icon').setAttribute('class', 'fas fa-times');
                    renderMap(data['retailer'], data['lat'], data['long']);
                } else {
                    document.getElementById('library-map').remove();
                    document.getElementById('online-icon').setAttribute('class', 'fas fa-check');
                }
            } else {
            }
        }
    }

    igdbRequest.send();
}

function renderMap(title, lat, long) {
    mapkit.init({
        authorizationCallback: function (done) {
            fetch('/api/maps/token')
                .then(res => res.json())
                .then(data => {
                    done(data.token)
                })
        }
    });

    let MarkerAnnotation = mapkit.MarkerAnnotation
    let location = new mapkit.Coordinate(lat, long)
    let region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(lat, long),
        new mapkit.CoordinateSpan(0.01, 0.01)
    );
    let map = new mapkit.Map("library-map", {
        colorScheme: "dark"
    });
    let pin = new MarkerAnnotation(location, {color: "#00c756", title: title});
    map.showItems([pin]);
    map.region = region;
}