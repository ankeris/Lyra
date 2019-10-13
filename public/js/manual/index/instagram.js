import {lazyLoadInstance} from '../global/lazyload';
const $ = require('jquery');
const slick = require('slick-carousel');

const token = '7012478136.1677ed0.a70b84b80d2740838366a2c010e97662',
	num_photos = 10,
	container = document.getElementById( 'instafeed' ),
	scrElement = document.createElement( 'script' );
 
scrElement.setAttribute( 'src', 'https://api.instagram.com/v1/users/self/media/recent?access_token=' + token + '&callback=instaLoaded' );
window.instaLoaded = function({data}) {
	for(var x in data ){
		console.log(data);
		const currentImage = data[x];
		container.innerHTML += `
				<a class="items-box__instagram-item" href="${currentImage.link}" alt="Instagram nuotrauka" rel="noreferrer" target="_blank" aria-label="${currentImage.likes.count} likes">
					<img class="items-box__item--main-image lazy" data-lazy="${currentImage.images.low_resolution.url}"/>
					<div class="items-box__item--text">${currentImage.caption ? currentImage.caption.text : null}</div>
				</a>`;
	}
	lazyLoadInstance.update();

	$('#instafeed').slick({
		infinite: true,
		autoplay: false,
		slidesToShow: 6,
		speed: 200,
		slidesToScroll: 2,
		lazyLoad: 'ondemand',
		prevArrow: '<button type="button" class="slick-prev" aria-label="slide previous"></button>',
		nextArrow: '<button type="button" class="slick-next" aria-label="slide next"></button>',
		responsive: [
			{
				breakpoint: 2000,
				settings: {
					slidesToShow: 6,
					slidesToScroll: 1,
					infinite: true
				}
			},
			{
				breakpoint: 1400,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 1,
					infinite: true
				}
			},
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
		
	$('.items-box__item--text').each((index, value) => {
		const array = value.innerText.split(' ');
		
		value.innerText = array.filter(word => !word.startsWith('#')).join(' ');
		value.innerText.length > 280 ? (value.innerText = value.innerText.substring(0, 280) + '...') : null;
	});
}
document.body.appendChild( scrElement );
 