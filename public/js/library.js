function fetchLibrary(sortBy = "title") {
    let request = new XMLHttpRequest();
    request.open('GET', `/library/games?sortBy=${sortBy}`);

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

                let tableBody = document.getElementById("table-body");
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }

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
            } else {
                // TODO: Handle error!
            }
        }
    }

    request.send();
}