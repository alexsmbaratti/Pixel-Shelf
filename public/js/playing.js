function fetchLibrary(sortBy = "title") {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/library/playing?sortBy=${sortBy}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            let mainDiv = document.getElementById("main-div");
            while (mainDiv.firstChild) {
                mainDiv.removeChild(mainDiv.firstChild);
            }

            if (request.status === 200) {
                data = data['currentlyPlaying'];

                if (data.length == 0) {
                    let noGamesText = document.createElement("p");
                    noGamesText.setAttribute("class", "title has-text-centered");
                    noGamesText.innerHTML = "No Games Marked as Currently Playing...";
                    mainDiv.appendChild(noGamesText);
                    return;
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
                let noGamesText = document.createElement("p");
                noGamesText.setAttribute("class", "title has-text-centered");
                noGamesText.innerHTML = "An error has occurred!";
                mainDiv.appendChild(noGamesText);
            }
        }
    }

    request.send();
}