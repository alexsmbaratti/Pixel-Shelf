function submit() {
    if (validateFields()) {
        let upc = document.getElementById("upc-text").value;
        let button = document.getElementById("identify-button");

        button.setAttribute("class", "button is-link is-loading");

        let request = new XMLHttpRequest();
        request.open('POST', `/identify`);
        request.setRequestHeader('Content-Type', 'application/json');

        let params = {
            "upc": upc,
        };

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                button.setAttribute("class", "button is-link");
                let data = JSON.parse(request.responseText).data;
                if (request.status === 200) {
                    console.log(data);
                    let modal = document.getElementById("identified-modal");
                    document.getElementById("identified-title").innerText = data.title;
                    document.getElementById("identified-platform").innerText = data.platform;
                    document.getElementById("identified-edition").innerText = data.edition;
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
    if (document.getElementById("upc-text").value.length > 0) {
        return true;
    }
    return false;
}

function closeModal() {
    let modal = document.getElementById("identified-modal");
    modal.setAttribute("class", "modal");
}