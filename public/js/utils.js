function swapDiv(oldDivID, newDivID) {
    document.getElementById(oldDivID).classList.add("is-hidden");
    document.getElementById(newDivID).classList.remove("is-hidden");
}

function swapStepsProgress(oldStepID, newStepID) {
    document.getElementById(oldStepID).classList.remove("is-active");
    document.getElementById(newStepID).classList.add("is-active");
}