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

function deleteGame(id) {
    let request = new XMLHttpRequest();
    request.open('DELETE', `/api/figures/${id}`);
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

function calculateSavings(msrp, cost) {
    return ((1 - (cost / msrp)) * 100).toFixed(2);
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