function requestBackup() {
    let button = document.getElementById("submit");
    button.setAttribute("class", "button is-link is-loading");
    button.disabled = true;

    window.open('/api/export');
}