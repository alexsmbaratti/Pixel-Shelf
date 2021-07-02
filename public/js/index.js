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
                            backgroundColor: ['red', 'yellow', 'green', 'blue', 'purple', 'orange', 'grey'],
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