function fetchWishlist(sortBy = "title") {
    let request = new XMLHttpRequest();
    request.open('GET', `/wishlist/games?sortBy=${sortBy}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            if (request.status === 200) {
                data = data.library;

                let mainDiv = document.getElementById("main-div");
                while (mainDiv.firstChild) {
                    mainDiv.removeChild(mainDiv.firstChild);
                }

                if (data.length == 0) {
                    let noGamesText = document.createElement("p");
                    noGamesText.setAttribute("class", "title has-text-centered");
                    noGamesText.innerHTML = "No Games to Display...";
                    mainDiv.appendChild(noGamesText);
                    return;
                }

                let tableBody = document.getElementById("table-body");
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }

                data.forEach(game => {
                    let link = document.createElement("a");
                    link.setAttribute("href", `/wishlist/${game.id}`);
                    let title = document.createElement("th");
                    link.innerHTML = game.title;
                    title.appendChild(link);

                    let platform = document.createElement("td");
                    platform.innerHTML = game.platform;

                    let msrp = document.createElement("td");
                    msrp.innerHTML = game.msrp;

                    let edition = document.createElement("td");
                    edition.innerHTML = game.edition;

                    let row = document.createElement("tr");
                    row.appendChild(title);
                    row.appendChild(platform);
                    row.appendChild(msrp);
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