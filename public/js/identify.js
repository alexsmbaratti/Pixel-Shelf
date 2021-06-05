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
                let data = JSON.parse(request.responseText).data;
                if (request.status === 200) {
                    console.log(data);
                    let modal = document.getElementById("identified-modal");
                    document.getElementById("identified-title").innerText = data.title;
                    modal.setAttribute("class", "modal is-active");
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

function closeModal() {
    let modal = document.getElementById("identified-modal");
    modal.setAttribute("class", "modal");
}