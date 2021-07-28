function getIGDBInfo(id) {
    let loader = document.createElement("div");
    loader.setAttribute("class", "loader");
    loader.setAttribute("id", "igdb-loader");
    document.getElementById("loading-div").appendChild(loader);

    let igdbRequest = new XMLHttpRequest();
    igdbRequest.open('GET', `/wishlist/${id}/igdb`);

    igdbRequest.onreadystatechange = function () {
        if (igdbRequest.readyState === 4) {
            let data = JSON.parse(igdbRequest.responseText)['data'][0];
            if (igdbRequest.status === 200) {
                document.getElementById("igdb-loader").remove();
                document.getElementById("description").innerHTML = data['summary'];
                document.getElementById("igdb-link").innerHTML = 'View on IGDB';
                let tagsDiv = document.getElementById("tags-div");
                data['genres'].forEach(genre => {
                    let genreTag = document.createElement("span");
                    genreTag.setAttribute("class", "tag is-light mr-3");
                    genreTag.innerHTML = genre.name;
                    tagsDiv.appendChild(genreTag);
                });
                const ratingOrg = 1; // ESRB Ratings Only
                const ratingLegend = ["N/A", "Three", "Seven", "Twelve", "Sixteen", "Eighteen", "RP", "EC", "E", "E10", "T", "M", "AO"];
                let ratings = data['age_ratings'];
                for (let i = 0; i < ratings.length; i++) {
                    if (ratings[i]['category'] === ratingOrg) {
                        let image = document.createElement("img");
                        image.setAttribute("src", "/images/ratings/" + ratings[i]['rating'] + ".jpg");
                        document.getElementById("rating-figure").appendChild(image);
                        break;
                    }
                }
            } else {
                console.log("TODO: Handle error!")
            }
        }
    }
    igdbRequest.send();
}
