function renderResult(levelID, loaderID, status) {
    let spanClass;
    let iconClass;
    switch (status) {
        case 200:
            spanClass = 'icon has-text-success';
            iconClass = 'fas fa-check-circle fa-lg';
            break;
        default:
            spanClass = 'icon has-text-warning';
            iconClass = 'fas fa-exclamation-triangle fa-lg';
    }
    let level = document.getElementById(levelID);
    let loader = document.getElementById(loaderID);
    let span = document.createElement("span");
    let icon = document.createElement("icon");
    span.setAttribute("class", spanClass);
    icon.setAttribute("class", iconClass);
    span.appendChild(icon);
    loader.remove();
    level.appendChild(span);
}

function pingEndpoint(url, levelID, loaderID) {
    let request = new XMLHttpRequest();
    request.open('GET', url);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            renderResult(levelID, loaderID, request.status);
        }
    }

    request.send();
}

function fetchSystemInformation() {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/system/platform`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText)['data'];
            if (request.status === 200) {
                let distro = data['distro'];
                document.getElementById('os-text').innerHTML = distro;
            } else {
                document.getElementById('os-text').innerHTML = "<i class=\"fas fa-exclamation-triangle\"></i>";
            }
        }
    }

    request.send();
}

function requestNewToken() {
    let request = new XMLHttpRequest();
    request.open('PUT', `/api/igdb/regen-token`);

    let button = document.getElementById('request-token-button');
    button.disabled = true;
    button.setAttribute("class", "button is-warning is-loading");

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                button.innerHTML = "Success";
                button.setAttribute("class", "button is-success");
            } else {
                button.innerHTML = "Failed";
                button.setAttribute("class", "button is-danger");
            }
        }
    }

    request.send();
}

function maintenanceEndpointFetch(endpoint, id) {
    let request = new XMLHttpRequest();
    request.open('GET', endpoint);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let rowData = document.getElementById(id + '-data');
            let loader = document.getElementById(id + '-loader');

            let data = JSON.parse(request.responseText);
            loader.remove();
            if (request.status === 200) {
                let title = document.getElementById(id + '-title');
                let text = document.createElement("p");
                text.innerHTML = data['data'].length;
                let array = JSON.stringify(data['data']);
                text.setAttribute('onclick', `toggleModal('${id}', ${array})`);
                title.setAttribute('onclick', `toggleModal('${id}', ${array})`);
                rowData.appendChild(text);
            } else {
                let span = document.createElement("span");
                let icon = document.createElement("icon");
                span.setAttribute("class", 'icon has-text-warning');
                icon.setAttribute("class", 'fas fa-exclamation-triangle fa-lg');
                span.appendChild(icon);
                rowData.appendChild(span);
            }
        }
    }

    request.send();
}

function toggleModal(item, data) {
    let modal = document.getElementById('maintenance-modal');
    let tableBody = document.getElementById('maintenance-modal-table-body');
    let modalTitle = document.getElementById('maintenance-modal-title');
    if (modal.getAttribute('class') === 'modal is-active') {
        modalTitle.innerHTML = '';
        modal.setAttribute('class', 'modal');
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    } else {
        modalTitle.innerHTML = document.getElementById(item + '-title').innerHTML;
        data.forEach(game => {
            let titleData = document.createElement('th');
            let data = document.createElement('td');
            let tableRow = document.createElement('tr');
            let link = document.createElement('a');
            link.setAttribute('href', `/library/${game['id']}`);
            link.innerHTML = game['title'];
            data.innerHTML = game['edition'];
            titleData.appendChild(link);
            tableRow.appendChild(titleData);
            tableRow.appendChild(data);
            tableBody.appendChild(tableRow);
        });
        modal.setAttribute('class', 'modal is-active');
    }
}

function dbStatsFetch() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/db/stats');

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let rowData = document.getElementById('db-size-data');
            let loader = document.getElementById('db-size-loader');

            let data = JSON.parse(request.responseText);
            loader.remove();
            if (request.status === 200) {
                let title = document.getElementById('db-size-title');
                let text = document.createElement("p");
                let sizeInMB = (data['stats']['size'] / 1048576).toFixed(2);
                text.innerHTML = sizeInMB + ' MB';
                rowData.appendChild(text);
            } else {
                let span = document.createElement("span");
                let icon = document.createElement("icon");
                span.setAttribute("class", 'icon has-text-warning');
                icon.setAttribute("class", 'fas fa-exclamation-triangle fa-lg');
                span.appendChild(icon);
                rowData.appendChild(span);
            }
        }
    }

    request.send();
}