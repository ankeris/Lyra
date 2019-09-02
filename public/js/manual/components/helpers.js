export function accordionate(e) {
	let parentItem = e.parentElement;
    
	parentItem.classList.toggle('accordion--active');

	let elementContent = parentItem.querySelector('.js-accordion');
	parentItem.style.height = e.dataset.height;
    
	if (elementContent) {
		let elementContentHeight = elementContent.offsetHeight;
		let newHeight;
		let heightAttr = parentItem.dataset.height;

		if (heightAttr === undefined) {
			newHeight = parentItem.offsetHeight + elementContentHeight;
			parentItem.dataset.height = parentItem.offsetHeight;
		}
		else {
			if (heightAttr < parentItem.offsetHeight) {
				newHeight = heightAttr;
			}
			else {
				newHeight = parentItem.offsetHeight + elementContentHeight;
			}
		}
		parentItem.style.height = newHeight + 'px';
	}
}