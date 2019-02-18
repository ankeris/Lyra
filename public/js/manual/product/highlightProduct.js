// Effect variable
const opacity = 0.5;

// Image variables
const highlighted = document.querySelector('#currentHighlight');
const images = document.querySelectorAll('.items-box__item-images--item');
images[0].style.opacity = opacity;

// Events
images.forEach(img => img.addEventListener('click', changeImage));

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
	}
}
