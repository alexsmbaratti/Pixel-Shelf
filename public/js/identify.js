function submit() {
    if (validateFields()) {
        let upc = document.getElementById("upc-text").value;

        let request = new XMLHttpRequest();
        request.open('POST', `/identify`);
        request.setRequestHeader('Content-Type', 'application/json');

        let params = {
            "upc": upc,
        };

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                let data = JSON.parse(request.responseText);
                if (request.status === 200) {
                    console.log(data);
                    console.log("TODO: Handle success!")
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