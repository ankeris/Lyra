const logo = document.querySelector('.main-navigation .logo');
const searchIcon = document.querySelector('.search-bar__icon');
const searchInput = document.querySelector('#search-input');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 30) {
        logo.className = "logoSmall";
    } else {
        logo.className = "logo";
    }
})

searchIcon.addEventListener('click', () => {
    searchInput.classList.toggle("hidden");
    searchInput.classList.toggle("navigation__search-form--search-input");
    if (searchInput.className == "navigation__search-form--search-input") {
        searchInput.focus();
    }
})