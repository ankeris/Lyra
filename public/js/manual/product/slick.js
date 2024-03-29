let $ = require('jquery');
let slick = require('slick-carousel');

$('.items-box__item-images').slick({
	variableWidth: false,
	infinite: false,
	slidesToShow: 4,
	lazyLoad: 'ondemand',
	prevArrow: '<figure class="slick-prev" aria-label="slide previous"></figure>',
	nextArrow: '<figure class="slick-next" aria-label="slide next"></figure>',
	responsive: [
		{
			breakpoint: 700,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 550,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1
			}
		},
	]
});
