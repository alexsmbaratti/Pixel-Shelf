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
                            backgroundColors.push('white');
                            break;
                        case 1:
                            labels.push('Backlog');
                            backgroundColors.push('yellow');
                            break;
                        case 2:
                            labels.push('In Progress');
                            backgroundColors.push('blue');
                            break;
                        case 3:
                            labels.push('Completed');
                            backgroundColors.push('green');
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