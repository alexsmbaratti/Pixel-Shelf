function fetchAmiibo(sortBy = "title") {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/figures?sortBy=${sortBy}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            let mainDiv = document.getElementById("main-div");
            while (mainDiv.firstChild) {
                mainDiv.removeChild(mainDiv.firstChild);
            }

            if (request.status === 200) {
                data = data['figures'];

                if (data.length == 0) {
                    let noAmiiboText = document.createElement("p");
                    noAmiiboText.setAttribute("class", "title has-text-centered");
                    noAmiiboText.innerHTML = "No Figures to Display...";
                    mainDiv.appendChild(noAmiiboText);
                    return;
                }

                let tableBody = document.getElementById("table-body");
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }

                data.forEach(figure => {
                    let link = document.createElement("a");
                    link.setAttribute("href", `/amiibo/${figure.id}`);
                    let title = document.createElement("th");
                    link.innerHTML = figure['title'];
                    title.appendChild(link);

                    let series = document.createElement("td");
                    series.innerHTML = figure['series'];

                    let dateAdded = document.createElement("td");
                    if (figure['dateAdded'] === null) {
                        dateAdded.innerHTML = 'Unknown';
                    } else {
                        let date = new Date(figure['dateAdded']);
                        dateAdded.innerHTML = (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + '-' + date.getUTCFullYear();
                    }

                    let cost = document.createElement("td");
                    cost.innerHTML = figure['cost'];

                    let row = document.createElement("tr");
                    row.appendChild(title);
                    row.appendChild(series);
                    row.appendChild(dateAdded);
                    row.appendChild(cost);

                    tableBody.appendChild(row);
                });
            } else {
                let noAmiiboText = document.createElement("p");
                noAmiiboText.setAttribute("class", "title has-text-centered");
                noAmiiboText.innerHTML = "An error has occurred!";
                mainDiv.appendChild(noAmiiboText);
            }
        }
    }

    request.send();
}