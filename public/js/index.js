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
                getRandomPlayingGame();
            } else {
                document.getElementById('game-count-text').innerHTML = '? Games';
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
                    let url = '/library/' + data[randomIndex]['id'] + '/cover';
                    document.getElementById('currently-playing-cover').setAttribute('src', url);

                }
            } else {
            }
        }
    }

    request.send();
}