const $ = require('jquery');

const searchIcon = document.querySelector('.search-bar .searchIcon');
const searchInput = document.querySelector('#search-input');
const searchForm = document.querySelector('.search-form');

searchIcon.addEventListener('click', () => {
	searchForm.classList.toggle('dropdown');
	if (searchForm.classList.contains('dropdown')) {
		searchInput.focus();
	}
});

const [stripe1, stripe2, stripe3] = [
	document.querySelectorAll('.main-navigation__burger--stripe')[0],
	document.querySelectorAll('.main-navigation__burger--stripe')[1],
	document.querySelectorAll('.main-navigation__burger--stripe')[2]
];

window.addEventListener('resize', function(window) {
	if (window.target.innerWidth >= 760) {
		$('.main-navigation .main-navigation__box').removeAttr('style');
		$(stripe1).attr('class', 'main-navigation__burger--stripe');
		$(stripe2).attr('class', 'main-navigation__burger--stripe');
		$(stripe3).attr('class', 'main-navigation__burger--stripe');
	}
});

$('.main-navigation .main-navigation__burger').click(function() {
	$('.main-navigation .main-navigation__box').animate(
		{
			height: 'toggle',
			opacity: 'toggle'
		},
		{
			progress: {
				width: 'linear',
				height: 'easeOutBounce'
			}
		}
	);
	$(stripe1).toggleClass('stripe1');
	$(stripe2).toggleClass('stripe2');
	$(stripe3).toggleClass('invisible');
});
