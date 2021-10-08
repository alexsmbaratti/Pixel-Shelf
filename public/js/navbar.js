function expandBurger() {
    let burger = document.getElementById("burger");
    let menu = document.getElementById("navbar-menu");

    if (burger.classList.contains("navbar-burger")) {
        burger.classList.add("is-active");
        menu.classList.add("is-active");
    } else {
        burger.classList.remove("is-active");
        menu.classList.remove("is-active");
    }
}

function expandDropdown(id) {
    let dropdown = document.getElementById(id);

    if (dropdown.classList.contains("is-active")) {
        dropdown.classList.remove("is-active");
    } else {
        dropdown.classList.add("is-active");
    }
}