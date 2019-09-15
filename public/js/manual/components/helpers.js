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

export function slidetoggle(EL) {
	let currentHeight = EL.clientHeight;
	let possibleScrollHeight = EL.scrollHeight;
	// isCollapsed if currentHeight === 0 (if current height is 0 then isCollapsed = true)
	let isCollapsed = !currentHeight;
	// If no CSS height set set a flag.
	let noHeightSet = !EL.style.height;
	// animate itself
	EL.style.height = (isCollapsed || noHeightSet ? possibleScrollHeight : 0) + 'px';
	if (isCollapsed || noHeightSet) {
		EL.previousElementSibling.querySelector('.subcategory-box__item--svg').classList.add('rotate');
	} else {
		EL.previousElementSibling.querySelector('.subcategory-box__item--svg').classList.remove('rotate');
	}
}

export function constructMenuCategories(categories) {
	for (let index = 0; index < categories.length; index++) {
		const currentValue = categories[index];
		if (currentValue.ChildCategoryOf) {
			if (!categories.some(x => x._id == currentValue.ChildCategoryOf._id)) {
				categories.push(currentValue.ChildCategoryOf);
			}
			const parent = categories.find(x => x._id == currentValue.ChildCategoryOf._id);
			if (parent) {
				if (!parent.children) {
					parent.children = [];
				}
				parent.children = [...parent.children, currentValue];
			}
			
			categories[index] = 0;
		}
	}
	return categories.filter(x => x !== 0);
}

export const isInScreen = (element) => {
	const bounding = element ? element.getBoundingClientRect() : null;
	if (bounding) {
		const distanceToBottom = bounding.top - window.innerHeight;
		return distanceToBottom < 10;
	}
};

export const scrollToItem = (idOrClass) => {
	const item = document.querySelector(idOrClass);
	const pos = item.getBoundingClientRect().top - 35;
	let time = 350;
	if (isNaN(pos)) {
		throw 'Position must be a number';
	}
	if (pos < 0) {
		throw 'Position can not be negative';
	}
	let currentPos = window.scrollY || window.screenTop;
	if (currentPos < pos) {
		let t = 10;
		for (let i = currentPos; i <= pos; i += 25) {
			t += 10;
			setTimeout(function() {
				window.scrollTo(0, i);
			}, t / 2);
		}
	} else {
		time = time || 2;
		let i = currentPos;
		let x;
		x = setInterval(function() {
			window.scrollTo(0, i);
			i -= 10;
			if (i <= pos) {
				clearInterval(x);
			}
		}, time);
	}
};