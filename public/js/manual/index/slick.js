let $ = require('jquery');
let slick = require('slick-carousel');

$('.highlighted-products').slick({
	infinite: true,
	autoplay: true,
	slidesToShow: 4,
	slidesToScroll: 1,
	prevArrow: '<button type="button" class="slick-prev" aria-label="slide previous"></button>',
	nextArrow: '<button type="button" class="slick-next" aria-label="slide next"></button>',
});