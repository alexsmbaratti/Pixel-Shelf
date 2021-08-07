function fetchAmiibo(sortBy = "title") {
    let request = new XMLHttpRequest();
    request.open('GET', `/api/amiibo?sortBy=${sortBy}`);

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            let data = JSON.parse(request.responseText);
            let mainDiv = document.getElementById("main-div");
            while (mainDiv.firstChild) {
                mainDiv.removeChild(mainDiv.firstChild);
            }

            if (request.status === 200) {

            } else if (request.status === 501) {
                let noAmiiboText = document.createElement("p");
                noAmiiboText.setAttribute("class", "title has-text-centered");
                noAmiiboText.innerHTML = "Coming Soon...";
                mainDiv.appendChild(noAmiiboText);
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