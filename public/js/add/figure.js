var seriesID = null;
var amiiboID = null;
var figureID = null;

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
    let seriesSelect = document.getElementById('series-selection');
    if (selectedValue == -1) {
        postSeries();
    } else if (selectedValue >= 0) {
        seriesID = selectedValue;
        document.getElementById('amiibo-series').innerHTML = seriesSelect[seriesSelect.selectedIndex].innerHTML;
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
                document.getElementById('amiibo-series').innerHTML = document.getElementById('series-text').value;
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
                document.getElementById('amiibo-title').innerHTML = document.getElementById('amiibo-text').value;
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

function postFigure() {
    let request = new XMLHttpRequest();
    request.open('POST', `/api/figures`);
    request.setRequestHeader('Content-Type', 'application/json');

    let cost = document.getElementById('cost-text').value;
    if (cost.length == 0) {
        cost = null;
    }

    let timestamp = new Date(document.getElementById("calendar-input").value).toISOString();
    let dateCheck = document.getElementById("date-check").checked;
    if (dateCheck) {
        timestamp = null;
    }

    let retailerSelect = document.getElementById("retailer-selection");
    let retailerID = retailerSelect[retailerSelect.selectedIndex].value;
    if (retailerID < 1) {
        retailerID = null;
    }

    let conditionSelect = document.getElementById("condition-selection");

    let inBox = document.getElementById("box-check").checked;

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let button = document.getElementById('purchase-submit-button');
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                figureID = data['id'];
                swapDiv('purchase-div', 'completion-div');
                document.getElementById('completion-segment').setAttribute('class', 'steps-segment is-active');
                document.getElementById('purchase-info-segment').setAttribute('class', 'steps-segment');
                document.getElementById('library-view').setAttribute('href', '/amiibo/' + figureID);
            } else {
                button.setAttribute("class", "button is-link is-danger");
                button.disabled = false;
            }
        }
    }

    request.send(JSON.stringify({
        "cost": cost,
        "timestamp": timestamp,
        "condition": conditionSelect.selectedIndex == 0,
        "inbox": inBox,
        "retailerID": retailerID,
        "amiiboID": amiiboID
    }));
}

function swapDiv(oldDivID, newDivID) {
    document.getElementById(oldDivID).setAttribute('class', 'is-hidden');
    document.getElementById(newDivID).setAttribute('class', '');
}

function dateCheck() {
    let dateCheck = document.getElementById("date-check").checked;
    if (dateCheck) {
        document.getElementById("calendar-input").disabled = true;
    } else {
        document.getElementById("calendar-input").disabled = false;
    }
}

function getRetailers() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/retailers`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                let retailerSelect = document.getElementById("retailer-selection");
                let data = JSON.parse(request.responseText)['data'];
                data.forEach(retailer => {
                    let option = document.createElement('option');
                    option.setAttribute('value', retailer['id']);
                    if (retailer['subtext']) {
                        option.innerHTML = retailer['retailer'] + ' - ' + retailer['subtext'];
                    } else {
                        option.innerHTML = retailer['retailer'];
                    }
                    retailerSelect.appendChild(option);
                });

                let newRetailerOption = document.createElement('option');
                newRetailerOption.setAttribute('value', '-1');
                newRetailerOption.innerHTML = '-- New Retailer --';
                retailerSelect.appendChild(newRetailerOption);
            } else {
            }
        }
    }

    request.send();
}