const searchIcon = document.querySelector('.search-bar__icon');
const searchInput = document.querySelector('#search-input');

searchIcon.addEventListener('click', () => {
	searchInput.classList.toggle("hidden");
	searchInput.classList.toggle("navigation__search-form--search-input");
	if (searchInput.className == "navigation__search-form--search-input") {
		searchInput.focus();
	}
})

window.addEventListener('resize', function (window) {
	console.log(window.target.innerWidth);
})

// const logo = document.querySelector('.main-navigation .logo');
// window.addEventListener('scroll', () => {
//     if (window.scrollY >= 30) {
//         logo.className = "logoSmall";
//     } else {
//         logo.className = "logo";
//     }
// })
