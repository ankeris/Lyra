// Effect variable
const opacity = 0.5;

// Image variables
const highlighted = document.querySelector('#currentHighlight');
const images = document.querySelectorAll('.items-box__item-images--item');
images[0].style.opacity = opacity;

// Video variables
const videoButton = document.querySelector('.video-instance') || null;
const videoWrapper = document.querySelector('.video-player-wrapper') || null;
const videoPlayer = videoWrapper ? videoWrapper.querySelector('.vid-player') : null;

// Events
images.forEach(img => img.addEventListener('click', changeImage));
if (videoWrapper) {
	videoButton.addEventListener('click', highlightVideo);
}

function changeImage(newImage) {
	newImage = newImage.target;
	// Only change image if it's different and not the current one
	if (newImage.getAttribute('src') !== highlighted.getAttribute('data-current-image')) {
		images.forEach(img => (img.style.opacity = 1));
		highlighted.style.backgroundImage = `url('${newImage.src}')`;
		highlighted.setAttribute('data-current-image', newImage.src);
		highlighted.classList.add('fade-in');
		newImage.style.opacity = opacity;
		setTimeout(() => highlighted.classList.remove('fade-in'), 500);
		// Hide video, show Image
		if (videoWrapper) {
			highlighted.classList.remove('hidden');
			videoWrapper.classList.add('hidden');
			videoPlayer.pause();
		}
	}
}

function highlightVideo(vid) {
	// Hide image, show Video
	videoPlayer.play();
	videoWrapper.classList.remove('hidden');
	highlighted.classList.add('hidden');
}
