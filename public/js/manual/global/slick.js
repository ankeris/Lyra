let $ = require('jquery');
let slick = require('slick-carousel');

$('.highlighted-products').slick({
	infinite: true,
	autoplay: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	lazyLoad: 'ondemand',
	prevArrow: '<figure class="slick-prev" aria-label="slide previous"></figure>',
	nextArrow: '<figure class="slick-next" aria-label="slide next"></figure>',
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
				infinite: true
			}
		},
		{
			breakpoint: 940,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
				infinite: true
			}
		},
		{
			breakpoint: 700,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: true
			}
		}
	]
});
