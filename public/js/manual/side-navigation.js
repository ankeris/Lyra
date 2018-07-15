$('.navigation-dropdown')
	.click(function () {
		$(this)
			.next('div')
			.slideToggle('slow');
		$(this.childNodes[3]).toggleClass("rotate");
	});

// hide Parent category if it has no sub categories ((this should be handled in server side))
$(document).ready(function () {
	$('.navigation-dropdown').each(function (index, value) {
		if (!$(this).next('div').children().length) {
			$(this).next('div').remove();
			$(this).remove();
		}
	});
});

const el = document.querySelector('.side-nav__box');

// Change Side Navigation position to sticky While scrolling . . . . .
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
