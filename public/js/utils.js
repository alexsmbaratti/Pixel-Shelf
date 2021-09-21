function swapDiv(oldDivID, newDivID) {
    document.getElementById(oldDivID).classList.add("is-hidden");
    document.getElementById(newDivID).classList.remove("is-hidden");
}

function swapStepsProgress(oldStepID, newStepID) {
    document.getElementById(oldStepID).classList.remove("is-active");
    document.getElementById(newStepID).classList.add("is-active");
}

function toggleButton(buttonID) {
    let button = document.getElementById(buttonID);
    if (button.classList.contains('is-outlined')) {
        button.classList.remove('is-outlined');
        button.classList.remove('is-light');
        button.classList.add('is-primary');
    } else {
        button.classList.add('is-outlined');
        button.classList.remove('is-primary');
        button.classList.add('is-light');
    }
}