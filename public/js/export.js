function requestBackup() {
    let button = document.getElementById("submit");
    button.disabled = true;

    window.open('/api/export');
}