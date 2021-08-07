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