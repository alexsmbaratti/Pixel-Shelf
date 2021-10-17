const categories = ['None', 'Console', 'Arcade', 'Platform', 'Operating System', 'Portable Console', 'Computer'];

function getIGDBInfo(id) {
    let loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    loader.setAttribute("id", "igdb-loader");
    document.getElementById("loading-div").appendChild(loader);

    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/api/platforms/${id}/igdb`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            let data = JSON.parse(igdbRequest.responseText)['data'];
            if (igdbRequest.status === 200) {
                console.log(data);
                document.getElementById("igdb-loader").remove();
                if (data['description']) {
                    document.getElementById("description").innerHTML = data['description'];
                } else {
                    document.getElementById("description").innerHTML = 'No Description Provided';
                }
                document.getElementById("igdb-link").innerHTML = 'View on IGDB';
                let tagsDiv = document.getElementById("tags-div");

                let categoryTag = document.createElement("span");
                categoryTag.setAttribute("class", "tag is-light mr-3");
                categoryTag.innerHTML = categories[data['category']];

                let generationTag = document.createElement("span");
                generationTag.setAttribute("class", "tag is-light mr-3");
                generationTag.innerHTML = 'Generation ' + data['generation'];

                tagsDiv.appendChild(categoryTag);
                tagsDiv.appendChild(generationTag);
            } else {
                document.getElementById("igdb-loader").remove();
                document.getElementById("description").innerHTML = "Failed to load IGDB information!";
                document.getElementById("igdb-link").innerHTML = 'View on IGDB';
            }
        }
    }

    igdbRequest.send();
}