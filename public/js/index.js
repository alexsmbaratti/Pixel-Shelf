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
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/size?by=date-added`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText)['data'];
            if (request.status === 200) {
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
                    }
                });

                console.log(points);

                let chart = new Chart(document.getElementById('size-chart').getContext('2d'), {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: "Games",
                            scaleFontColor: "#FFFFFF",
                            borderColor: 'hsl(146, 100%, 39%)',
                            backgroundColor: 'hsla(146, 100%, 39%, .2)',
                            data: points
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
                                    min: earliestDate,
                                    max: Date.now()
                                },
                                ticks: {
                                    fontColor: 'rgb(255, 255, 255)'
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    fontColor: 'rgb(255, 255, 255)'
                                }
                            }]
                        }
                    }
                });
            }
        }
    }

    request.send();
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
                    let coverURL = '/library/' + data[randomIndex]['gameID'] + '/cover';
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
    for (let tab of tabs) {
        let keyword = tab.getAttribute('id').split('-')[1];
        let div = document.getElementById('div-' + keyword);
        if (tab.getAttribute('id') === 'tab-' + id) {
            tab.setAttribute('class', 'is-active');
            div.setAttribute('class', '');
        } else {
            tab.setAttribute('class', '');
            div.setAttribute('class', 'is-hidden');
        }
    }
}