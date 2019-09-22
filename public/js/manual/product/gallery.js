import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

function openPhotoSwipe(imagesArr, currentHighlight) {
	const pswpElement = document.querySelector('.pswp');
	let parsed = JSON.parse(imagesArr);

	// Find the index of highlighted item
	const found = parsed.findIndex(function(img) {
		return img.src == currentHighlight;
	});

	// Split array into two and begin array with highlight image
	const highlight = parsed.splice(0, found);
	parsed = [...parsed, ...highlight];

	const items = parsed;
	// define options (if needed)
	const options = {
		// history & focus options are disabled on CodePen
		history: false,
		focus: false,
		shareEl: false,
		tapToClose: true,
		clickToCloseNonZoomable: false,
		closeOnScroll: false,
		maxSpreadZoom: 3,
		getDoubleTapZoom: function(isMouseClick, item) {
			if (isMouseClick) {
				return 1.2;
			} else {
				return item.initialZoomLevel < 0.7 ? 1 : 1.5;
			}
		},
		bgOpacity: 0.9,
		showAnimationDuration: 200,
		hideAnimationDuration: 200
	};

	const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

	gallery.init();
}

const imgPressed = document.getElementById('currentHighlight');
if (imgPressed) {
	const arrayOfImages = imgPressed.getAttribute('data-images');
	imgPressed.addEventListener('click', e => {
		const currentHighlightImage = e.target.getAttribute('data-current-image');
		openPhotoSwipe(arrayOfImages, currentHighlightImage);
	});
}
