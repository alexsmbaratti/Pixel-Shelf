function submit() {
    if (validateFields()) {
        let platformSelect = document.getElementById("platform-selection");
        let conditionSelect = document.getElementById("condition-selection");

        let titleText = document.getElementById("title-text").value;
        let editionText = document.getElementById("edition-text").value;
        let msrpText = document.getElementById("msrp-text").value;
        let costText = document.getElementById("cost-text").value;
        let igdbText = document.getElementById("igdb-text").value;
        let upcText = document.getElementById("upc-text").value;

        let request = new XMLHttpRequest();
        request.open('POST', `/add`);
        request.setRequestHeader('Content-Type', 'application/json');

        let params = {
            "title": titleText,
            "platform": platformSelect[platformSelect.selectedIndex].id,
            "edition": editionText.length == 0 ? "Standard Edition" : editionText,
            "condition": conditionSelect.selectedIndex == 0,
            "msrp": msrpText.length == 0 ? "59.99" : msrpText,
            "cost": costText.length == 0 ? "59.99" : costText,
            "month": 1,
            "day": 1,
            "year": 1,
            "upc": upcText.length == 0 ? null : upcText,
            "igdb-url": igdbText.length == 0 ? null : igdbText
        };

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    window.location.href = `/library/${data.id}`;
                } else {
                    console.log("TODO: Handle error!")
                }
            }
        }

        request.send(JSON.stringify(params));
    }
}

function validateFields() {
    return true; // TODO
}

function giftCheck() {
    let giftCheck = document.getElementById("gift-check").checked;
    if (giftCheck) {
        document.getElementById("cost-text").disabled = true;
    } else {
        document.getElementById("cost-text").disabled = false;
    }
}