function append(text) {
    let schemaField = document.getElementById("schema");
    schemaField.value += text;
}

function submit() {
    if (validateFields()) {
        let schemaText = document.getElementById("schema").value;
        let massText = document.getElementById("mass-text").value;

        let request = new XMLHttpRequest();
        request.open('POST', `/add`);
        request.setRequestHeader('Content-Type', 'application/json');

        let params = {

        };

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    window.location.href = `/library/`;
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