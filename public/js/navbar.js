function expandBurger() {
    let burger = document.getElementById("burger");
    let menu = document.getElementById("navbar-menu");

    if (burger.getAttribute("class") == "navbar-burger") {
        burger.setAttribute("class", "navbar-burger is-active");
        menu.setAttribute("class", "navbar-menu is-active");
    } else {
        burger.setAttribute("class", "navbar-burger");
        menu.setAttribute("class", "navbar-menu ");
    }
}