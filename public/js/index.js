var growthChart = undefined;

function getSize() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/size`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                document.getElementById('game-count-text').innerHTML = data.size + ' Games';
            } else {
                document.getElementById('game-count-text').innerHTML = '? Games';
            }
        }
    }

    request.send();
}

function getSizeByPlatforms() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/size?by=platform`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText)['data'];
            if (request.status === 200) {
                let labels = [];
                let values = [];
                let total = 0;

                data.forEach(platform => {
                    labels.push(platform['name']);
                    values.push(platform['COUNT(library.id)']);
                    total += platform['COUNT(library.id)'];
                });

                document.getElementById('game-count-text').innerHTML = total + ' Games';

                let chart = new Chart(document.getElementById('platforms-chart').getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            scaleFontColor: "#FFFFFF",
                            backgroundColor: ['red', 'yellow', 'green', 'blue', 'purple', 'orange', '#00FFFF'],
                            data: values
                        }]
                    },
                    options: {
                        legend: {
                            display: false
                        }
                    }
                });
            } else {
                document.getElementById('game-count-text').innerHTML = '? Games';
            }
        }
    }

    request.send();
}

function getSizeByProgress() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/size?by=progress`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText)['data'];
            if (request.status === 200) {
                let labels = [];
                let values = [];
                let backgroundColors = [];

                data.forEach(progress => {
                    switch (progress['progress']) {
                        case 0:
                            labels.push('In Library');
                            backgroundColors.push('#A0A0A0');
                            break;
                        case 1:
                            labels.push('Backlog');
                            backgroundColors.push('yellow');
                            break;
                        case 2:
                            labels.push('In Progress');
                            backgroundColors.push('hsl(200, 100%, 39%)');
                            break;
                        case 3:
                            labels.push('Completed');
                            backgroundColors.push('hsl(146, 100%, 39%)');
                            break;
                        default:
                            backgroundColors.push('#A0A0A0');
                            labels.push('Unknown');
                    }
                    values.push(progress['COUNT(library.id)']);
                });

                let chart = new Chart(document.getElementById('progress-chart').getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [{
                            scaleFontColor: "#FFFFFF",
                            backgroundColor: backgroundColors,
                            data: values
                        }]
                    },
                    options: {
                        legend: {
                            display: false
                        }
                    }
                });
            }
        }
    }

    request.send();
}

function getSizeByDateAdded() {
    growthChart = new Chart(document.getElementById('size-chart').getContext('2d'), {
        type: 'line',
        data: {
            datasets: [{
                label: "Games",
                scaleFontColor: "#FFFFFF",
                borderColor: 'hsl(146, 100%, 39%)',
                backgroundColor: 'hsla(146, 100%, 39%, .2)',
                data: []
            }, {
                label: "amiibo",
                scaleFontColor: "#FFFFFF",
                borderColor: 'hsl(0, 100%, 39%)',
                backgroundColor: 'hsla(0, 100%, 39%, .2)',
                data: []
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                fontColor: 'rgb(255, 255, 255)',
                fontSize: 24
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
                    type: 'time',
                    distribution: 'linear',
                    time: {
                        max: Date.now()
                    },
                    ticks: {
                        fontColor: 'rgb(255, 255, 255)'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'rgb(255, 255, 255)',
                        precision: 0
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        let date = new Date(tooltipItem[0]['label']);
                        return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
                    },
                    label: function (tooltipItem, data) {
                        if (tooltipItem['datasetIndex'] == 0) {
                            return data['datasets'][0]['data'][tooltipItem['index']]['y'] + ' Games';
                        } else if (tooltipItem['datasetIndex'] == 1) {
                            return data['datasets'][1]['data'][tooltipItem['index']]['y'] + ' amiibo';
                        } else {
                            return '';
                        }
                    }
                },
                displayColors: false
            }
        }
    });

    let libraryGrowthRequest = new XMLHttpRequest();
    libraryGrowthRequest.open('GET', `/api/library/size?by=date-added`);

    libraryGrowthRequest.onreadystatechange = function () {
        if (libraryGrowthRequest.readyState === 4) {
            let data = JSON.parse(libraryGrowthRequest.responseText)['data'];
            if (libraryGrowthRequest.status === 200) {
                let points = [];
                let runningTotal = 0;
                let earliestDate = null;

                data.forEach(progress => {
                    if (progress['timestamp'] === null) {
                        runningTotal += progress['COUNT(library.id)'];
                    } else {
                        if (earliestDate === null) {
                            earliestDate = new Date(progress['timestamp']);
                        }
                        runningTotal += progress['COUNT(library.id)'];
                        points.push({
                            x: new Date(progress['timestamp']),
                            y: runningTotal
                        });
                        growthChart.data.datasets[0].data = points;
                        growthChart.options.scales.xAxes[0].time.min = earliestDate;
                        growthChart.update();
                    }
                });
            }
        }
    }

    let figureGrowthRequest = new XMLHttpRequest();
    figureGrowthRequest.open('GET', `/api/figures/size?by=date-added`);

    figureGrowthRequest.onreadystatechange = function () {
        if (figureGrowthRequest.readyState === 4) {
            let data = JSON.parse(figureGrowthRequest.responseText)['data'];
            if (figureGrowthRequest.status === 200) {
                let points = [];
                let runningTotal = 0;
                let earliestDate = null;

                data.forEach(progress => {
                    if (progress['timestamp'] === null) {
                        runningTotal += progress['COUNT(figure.id)'];
                    } else {
                        if (earliestDate === null) {
                            earliestDate = new Date(progress['timestamp']);
                        }
                        runningTotal += progress['COUNT(figure.id)'];
                        points.push({
                            x: new Date(progress['timestamp']),
                            y: runningTotal
                        });
                        growthChart.data.datasets[1].data = points;
                        growthChart.options.scales.xAxes[0].time.min = earliestDate;
                        growthChart.update();
                    }
                });
            }
        }
    }

    libraryGrowthRequest.send();
    figureGrowthRequest.send();
}

function getRandomPlayingGame() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/playing`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let data = JSON.parse(request.responseText)['currentlyPlaying'];
                if (data.length > 0) {
                    let randomIndex = Math.floor(Math.random() * data.length);
                    let url = '/library/' + data[randomIndex]['id'];
                    let coverURL = '/api/games/' + data[randomIndex]['gameID'] + '/cover';
                    document.getElementById('currently-playing-cover').setAttribute('src', coverURL);
                    document.getElementById('currently-playing-cover').setAttribute('title', data[randomIndex]['title']);
                    document.getElementById('currently-playing-link').setAttribute('href', url);
                }
            } else {
            }
        }
    }

    request.send();
}

function getBacklog() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/backlog`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let tableBody = document.getElementById("table-body");
            if (request.status === 200) {
                let data = JSON.parse(request.responseText)['backlog'];
                if (data.length > 0) {
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
                }
            } else {
            }
        }
    }

    request.send();
}

function tabToggle(id) {
    let tabs = document.getElementById('tabs').children;
    let divs = document.getElementById('tab-divs').children;
    for (let div of divs) {
        div.setAttribute('class', 'is-hidden');
    }
    for (let tab of tabs) {
        if (tab.getAttribute('id') === 'tab-' + id) {
            tab.setAttribute('class', 'is-active');
            document.getElementById('div-' + id).setAttribute('class', '');
        } else {
            tab.setAttribute('class', '');
        }
    }
}

function getPlaces() {
    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/api/retailers?online=false`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            if (igdbRequest.status === 200) {
                let data = JSON.parse(igdbRequest.responseText)['data'];
                renderMap(data);
            } else {
            }
        }
    }

    igdbRequest.send();
}

function renderMap(places = []) {
    if (places.length === 0) {
        return;
    }
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
    let map = new mapkit.Map("index-map", {
        colorScheme: "dark"
    });
    let pins = [];
    let minLat = places[0]['lat'];
    let maxLat = places[0]['lat'];
    let minLong = places[0]['long'];
    let maxLong = places[0]['long'];
    places.forEach(place => {
        let location = new mapkit.Coordinate(place['lat'], place['long']);
        pins.push(new MarkerAnnotation(location, {color: "#00c756", title: place['retailer']}));
        if (place['lat'] < minLat) {
            minLat = place['lat'];
        }
        if (place['lat'] > maxLat) {
            maxLat = place['lat'];
        }
        if (place['long'] < minLong) {
            minLong = place['long'];
        }
        if (place['long'] > maxLong) {
            maxLong = place['long'];
        }
    });
    let latRange = Math.abs(maxLat - minLat);
    let longRange = Math.abs(maxLong - minLong);
    let region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(minLat + ((maxLat - minLat) / 2), minLong + ((maxLong - minLong) / 2)),
        new mapkit.CoordinateSpan(latRange + latRange / 10, longRange + longRange / 10)
    );
    map.showItems(pins);
    map.region = region;
}