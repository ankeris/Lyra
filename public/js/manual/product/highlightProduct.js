import '../index/slick.js';
import {player} from './video';
// Effect variable
const opacity = 0.5;

// Image variables
const highlighted = document.querySelector('#currentHighlight');
const images = document.querySelectorAll('.items-box__item-images--item');
images[0].style.opacity = opacity;

// Video variables
const videoButton = document.querySelector('.video-instance') || null;
const video = document.querySelector('.video-player-wrapper') || null;

// Events
images.forEach(img => img.addEventListener('click', changeImage));
if (video) {
	videoButton.addEventListener('click', highlightVideo);
}

function changeImage(newImage) {
	images.forEach(img => (img.style.opacity = 1));
	highlighted.style.backgroundImage = `url('${newImage.target.src}')`;
	highlighted.setAttribute('data-current-image', newImage.target.src);
	highlighted.classList.add('fade-in');
	newImage.target.style.opacity = opacity;
	setTimeout(() => highlighted.classList.remove('fade-in'), 500);
	// Hide video, show Image
	if (video) {
		highlighted.classList.remove('hidden');
		video.classList.add('hidden');
		player.pause();
	}
}

function highlightVideo(vid) {
	// Hide image, show Video
	video.classList.remove('hidden');
	highlighted.classList.add('hidden');
}
