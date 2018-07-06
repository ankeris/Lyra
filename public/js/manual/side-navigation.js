$('.navigation-dropdown')
	.click(function () {
		$(this)
			.next('section')
			.slideToggle('slow');
		$('.subcategory-box__item--svg').toggleClass("rotate");
	});

const el = document.querySelector('.side-nav__box');

// Change Navigation position to sticky While scrolling . . .  . .
if (el) {
	const elTop = el
		.getBoundingClientRect()
		.top - document
		.body
		.getBoundingClientRect()
		.top - 60;

	const mq = window.matchMedia("(max-width: 700px)");

	window.addEventListener('scroll', function () {
		if (mq) {
			if (document.documentElement.scrollTop > elTop) {
				el.style.position = 'sticky';
				el.style.top = '60px';
			} else {
				el.style.top = 'auto';
			}
		}
	});
}


// Front-end solution for styling sub-categories
