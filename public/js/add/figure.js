var seriesID = null;
var amiiboID = null;

function seriesSelect() {
    let selectedValue = document.getElementById('series-selection').value;
    let button = document.getElementById('series-submit-button');
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
        swapDiv('series-div', 'amiibo-div');
        document.getElementById('amiibo-info-segment').setAttribute('class', 'steps-segment is-active');
        document.getElementById('series-info-segment').setAttribute('class', 'steps-segment');
    } else {
        let button = document.getElementById('series-submit-button');
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
            let button = document.getElementById('series-submit-button');
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                seriesID = data['id'];
                swapDiv('series-div', 'amiibo-div');
                document.getElementById('amiibo-info-segment').setAttribute('class', 'steps-segment is-active');
                document.getElementById('series-info-segment').setAttribute('class', 'steps-segment');
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

function amiiboSelect() {
    let selectedValue = document.getElementById('type-selection').value;
    let button = document.getElementById('amiibo-submit-button');
    let amiiboText = document.getElementById('amiibo-text').value;

    if (selectedValue < 0) {
        button.disabled = true;
    } else {
        if (amiiboText.length <= 0) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    }
}

function postAmiibo() {
    let amiiboText = document.getElementById('amiibo-text').value;

    let request = new XMLHttpRequest();
    request.open('POST', `/api/amiibo`);
    request.setRequestHeader('Content-Type', 'application/json');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let button = document.getElementById('amiibo-submit-button');
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                amiiboID = data['id'];
                swapDiv('amiibo-div', 'purchase-div');
                document.getElementById('purchase-info-segment').setAttribute('class', 'steps-segment is-active');
                document.getElementById('amiibo-info-segment').setAttribute('class', 'steps-segment');
            } else {
                button.setAttribute("class", "button is-link is-danger");
                button.disabled = false;
            }
        }
    }

    request.send(JSON.stringify({
        "title": document.getElementById('amiibo-text').value,
        "seriesID": seriesID,
        "msrp": document.getElementById('msrp-text').value,
        "type": document.getElementById('type-selection').value
    }));
}

function swapDiv(oldDivID, newDivID) {
    document.getElementById(oldDivID).setAttribute('class', 'is-hidden');
    document.getElementById(newDivID).setAttribute('class', '');
}