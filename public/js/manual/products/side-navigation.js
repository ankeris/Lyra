let $ = require('jquery');

$('.subcategory-box__item--svg').click(function() {
	$(this)
		.parent()
		.next('div')
		.slideToggle('fast');
	$(this).toggleClass('rotate');
});

$('.mobile-side-nav').click(function() {
	$(this)
		.next('aside')
		.slideToggle('slow');
	$(this.childNodes[3]).toggleClass('rotate');
});

// on page load
$(document).ready(function() {
	// If subcategory is selected, open it and rotate SVG
	const activeSubCategory = $('.subcategory-box .active');
	$(activeSubCategory)
		.parent()
		.prev('div')
		.children('.subcategory-box__item--svg')
		.toggleClass('rotate');
	$(activeSubCategory)
		.parent()
		.removeAttr('style');

	window.addEventListener('resize', function(e) {
		if (window.innerWidth >= 700) {
			$('.side-nav').removeAttr('style');
		}
	});
});

const el = document.querySelector('.side-nav__box');

// Change Side Navigation position to sticky While scrolling . . . . .
if (el) {
	const elTop = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 60;

	const mq = window.matchMedia('(max-width: 700px)');

	window.addEventListener('scroll', function() {
		if (mq) {
			if (document.documentElement.scrollTop > elTop) {
				el.style.position = 'sticky';
				el.style.top = '60px';
			} else {
				el.style.top = 'auto';
			}
		} else {
			console.log('hi');
		}
	});
}
