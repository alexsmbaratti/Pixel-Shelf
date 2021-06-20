function sortBy(sortCriteria) {
    switch (sortCriteria) {
        case "title":
            break;
        case "platform":
            break;
        case "dateAdded":
            break;
        case "cost":
            break;
        case "edition":
            break;
        default:

    }
}

function fetchLibrary() {
    let request = new XMLHttpRequest();
    request.open('GET', `/library/games`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                data = data.library;
                console.log(data);

                let mainDiv = document.getElementById("main-div");
                while (mainDiv.firstChild) {
                    mainDiv.removeChild(mainDiv.firstChild);
                }

                let titleHeader = document.createElement("th");
                let platformHeader = document.createElement("th");
                let dateHeader = document.createElement("th");
                let costHeader = document.createElement("th");
                let editionHeader = document.createElement("th");
                titleHeader.innerHTML = 'Title';
                platformHeader.innerHTML = 'Platform';
                dateHeader.innerHTML = 'Date Added';
                costHeader.innerHTML = 'Cost';
                editionHeader.innerHTML = 'Edition';

                let header = document.createElement("tr");
                header.appendChild(titleHeader);
                header.appendChild(platformHeader);
                header.appendChild(dateHeader);
                header.appendChild(costHeader);
                header.appendChild(editionHeader);

                let tableHead = document.createElement("thead");
                tableHead.appendChild(header);

                let tableBody = document.createElement("tbody");
                data.forEach(game => {
                    let link = document.createElement("a");
                    link.setAttribute("href", `/library/${game.id}`);
                    let title = document.createElement("th");
                    link.innerHTML = game.title;
                    title.appendChild(link);

                    let platform = document.createElement("td");
                    platform.innerHTML = game.platform;

                    let dateAdded = document.createElement("td");
                    dateAdded.innerHTML = game.dateAdded;

                    let cost = document.createElement("td");
                    cost.innerHTML = game.cost;

                    let edition = document.createElement("td");
                    edition.innerHTML = game.edition;

                    let row = document.createElement("tr");
                    row.appendChild(title);
                    row.appendChild(platform);
                    row.appendChild(dateAdded);
                    row.appendChild(cost);
                    row.appendChild(edition);

                    tableBody.appendChild(row);
                });

                let table = document.createElement("table");
                table.setAttribute("class", "table is-hoverable is-striped is-fullwidth");
                table.appendChild(tableHead);
                table.appendChild(tableBody);

                mainDiv.appendChild(table);
            } else {
                // TODO: Handle error!
            }
        }
    }

    request.send();
}