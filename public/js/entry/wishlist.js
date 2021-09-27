function getIGDBInfo(id, ratingOrg = 'ESRB') {
    let loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    loader.setAttribute("id", "igdb-loader");
    document.getElementById("loading-div").appendChild(loader);

    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/api/games/${id}/igdb`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            let data = JSON.parse(igdbRequest.responseText)['data'];
            if (igdbRequest.status === 200) {
                document.getElementById("igdb-loader").remove();
                document.getElementById("description").innerHTML = data['description'];
                document.getElementById("igdb-link").innerHTML = 'View on IGDB';
                let tagsDiv = document.getElementById("tags-div");
                data['genres'].forEach(genre => {
                    let genreTag = document.createElement("span");
                    genreTag.setAttribute("class", "tag is-light mr-3");
                    genreTag.innerHTML = genre['description'];
                    tagsDiv.appendChild(genreTag);
                });
                data['ratings'].forEach(rating => {
                    if (rating['ratingorg'] == ratingOrg) {
                        let ratingFigure = document.getElementById('rating-figure');
                        let image = document.createElement("img");
                        image.setAttribute("src", "/images/ratings/" + rating['id'] + ".jpg");
                        ratingFigure.appendChild(image);
                    }
                });
            } else {
                console.log("TODO: Handle error!")
            }
        }
    }
    igdbRequest.send();
}

function toggleModal() {
    let modal = document.getElementById('add-modal');
    if (modal.getAttribute('class') === 'modal is-active') {
        modal.setAttribute('class', 'modal');
    } else {
        modal.setAttribute('class', 'modal is-active');
    }
}