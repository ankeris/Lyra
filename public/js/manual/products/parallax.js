function parallax() {
	let $slider = document.getElementById('slider');

	let yPos = window.pageYOffset / $slider.dataset.speed;
	yPos = -yPos;

	let coords = '50% ' + yPos + 'px';

	$slider.style.backgroundPosition = coords;
}

window.addEventListener('scroll', function() {
	parallax();
});
