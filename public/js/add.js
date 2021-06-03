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
            "cost": document.getElementById("cost-text").value
        };

        console.log(params);

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {

                } else {

                }
            }
        }

        request.send(JSON.stringify(params));
    }
}

function validateFields() {
    return true; // TODO
}