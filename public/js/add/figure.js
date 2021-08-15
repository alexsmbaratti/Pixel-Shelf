var seriesID = null;

function seriesSelect() {
    let selectedValue = document.getElementById('series-selection').value;
    let button = document.getElementById('submit-button');
    let addSeriesDiv = document.getElementById('add-series-div');
    let newSeries = document.getElementById('series-text').value;

    if (selectedValue == -1) {
        addSeriesDiv.setAttribute('class', '');
    } else {
        addSeriesDiv.setAttribute('class', 'is-hidden');
    }

    if (selectedValue < 0) {
        if (selectedValue == -1 && newSeries.length > 0) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    } else {
        button.disabled = false;
    }
}

function submitSeriesInfo() {
    let selectedValue = document.getElementById('series-selection').value;
    if (selectedValue == -1) {
        postSeries();
    } else if (selectedValue >= 0) {
        seriesID = selectedValue;
    } else {
        button.setAttribute("class", "button is-link is-danger");
        button.setAttribute("class", "button is-link is-danger");
    }
}

function postSeries() {
    let newSeries = document.getElementById('series-text').value;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/series`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            button.setAttribute("class", "button is-link is-danger");
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                seriesID = data['id'];
            } else {
                button.setAttribute("class", "button is-link is-danger");
                button.disabled = false;
            }
        }
    }

    request.send(JSON.stringify({
        "series": newSeries
    }));
}