const logo = document.querySelector('.main-navigation .logo');

window.addEventListener('scroll', () => {
    if (window.scrollY >= 60) {
        logo.className = "logoSmall";
    } else {
        logo.className = "logo";
    }
})