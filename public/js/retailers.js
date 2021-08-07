function fetchRetailers(sortBy = "retailer") {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/retailers?sortBy=${sortBy}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            let mainDiv = document.getElementById("main-div");
            while (mainDiv.firstChild) {
                mainDiv.removeChild(mainDiv.firstChild);
            }

            if (request.status === 200) {
                data = data['data'];

                if (data.length == 0) {
                    let noRetailerText = document.createElement("p");
                    noRetailerText.setAttribute("class", "title has-text-centered");
                    noRetailerText.innerHTML = "No Retailers to Display...";
                    mainDiv.appendChild(noRetailerText);
                    return;
                }

                let tableBody = document.getElementById("table-body");
                while (tableBody.firstChild) {
                    tableBody.removeChild(tableBody.firstChild);
                }

                data.forEach(retailer => {
                    let link = document.createElement("a");
                    link.setAttribute("href", `/retailer/${retailer.id}`);
                    let title = document.createElement("th");
                    if (retailer['subtext']) {
                        link.innerHTML = retailer['retailer'] + ' - ' + retailer['subtext'];
                    } else {
                        link.innerHTML = retailer['retailer'];
                    }
                    title.appendChild(link);

                    let online = document.createElement("th");
                    let iconText = document.createElement("span");
                    iconText.setAttribute("class", "icon-text");
                    let iconSpan = document.createElement("span");
                    iconSpan.setAttribute("class", "icon");
                    let icon = document.createElement("i");
                    if (retailer['online']) {
                        icon.setAttribute("class", "fas fa-check");
                    } else {
                        icon.setAttribute("class", "fas fa-times");
                    }

                    iconSpan.appendChild(icon);
                    iconText.appendChild(iconSpan);
                    online.appendChild(iconText);

                    let row = document.createElement("tr");
                    row.appendChild(title);
                    row.appendChild(online);
                    tableBody.appendChild(row);
                });
            } else if (request.status === 501) {
                let noRetailerText = document.createElement("p");
                noRetailerText.setAttribute("class", "title has-text-centered");
                noRetailerText.innerHTML = "Coming Soon...";
                mainDiv.appendChild(noRetailerText);
            } else {
                let noRetailerText = document.createElement("p");
                noRetailerText.setAttribute("class", "title has-text-centered");
                noRetailerText.innerHTML = "An error has occurred!";
                mainDiv.appendChild(noRetailerText);
            }
        }
    }

    request.send();
}