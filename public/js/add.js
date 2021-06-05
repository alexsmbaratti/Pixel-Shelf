function submit() {
    if (validateFields()) {
        let platformSelect = document.getElementById("platform-selection");
        let conditionSelect = document.getElementById("condition-check");

        let request = new XMLHttpRequest();
        request.open('POST', `/add`);
        request.setRequestHeader('Content-Type', 'application/json');

        let params = {
            "title": document.getElementById("title-text").value,
            "platform": platformSelect[platformSelect.selectedIndex].id,
            "edition": document.getElementById("edition-text").value,
            "condition": conditionSelect.selectedIndex == 0,
            "msrp": document.getElementById("msrp-text").value,
            "cost": document.getElementById("cost-text").value,
            "month": 1,
            "day": 1,
            "year": 1,
            "upc": "1"
        };

        console.log(params);

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    console.log("TODO: Redirect to new page")
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