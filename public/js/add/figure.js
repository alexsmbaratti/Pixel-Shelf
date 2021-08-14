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
        // POST new series
    } else if (selectedValue >= 0) {
        // GET existing series
    } else {
        // Something went wrong
    }
}