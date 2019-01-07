import * as PhotoSwipe from 'photoswipe';
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

function openPhotoSwipe(imagesArr) {
	var pswpElement = document.querySelector('.pswp');
	let parsed = JSON.parse(imagesArr);
	// build items array
	var items = parsed;
	// define options (if needed)
	var options = {
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

	var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

	gallery.init();
}

const imgPressed = document.getElementById('currentHighlight');
const arrayOfImages = imgPressed.getAttribute('data-images');

imgPressed.addEventListener('click', () => {
	openPhotoSwipe(arrayOfImages);
});
