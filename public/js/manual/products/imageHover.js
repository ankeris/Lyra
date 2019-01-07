let productList = document.querySelectorAll('.items-box__item');
let observer;
// DOM Observation (actively checking what changes in DOM tree)
let observedElement = document.querySelector('.products');

let options = {
	attributes: true,
	subtree: true,
	childList: true
};

observer = new MutationObserver(mutated);
observer.observe(observedElement, options);

function mutated(mutationList) {
	mouseEvents(mutationList[0].addedNodes);
}

const play = box => {
	while (!box.classList.contains('items-box__item')) box = box.parentElement;
	let img = box.querySelector('.show');
	img.classList.remove('show');
	(img.nextElementSibling.className != 'items-box__item--description' ? img.nextElementSibling : box.firstElementChild).classList.add('show');
};

const stop = ({target: box, relatedTarget: rt}) => {
	while (!box.classList.contains('items-box__item')) box = box.parentElement;
	while (rt != box && rt) rt = rt.parentElement;
	if (rt === box) return;
	box.querySelector('.show').classList.remove('show');
	box.firstElementChild.classList.add('show');
	box.play = clearInterval(box.play);
};

function mouseEvents(list) {
	[...list].forEach(box => {
		if (box.children[0].classList != 'no-image-err') {
			box.addEventListener('mouseenter', function() {
				if (box.play) return;
				play(box);
				box.play = setInterval(() => play(box), 1000);
			});

			box.addEventListener('mouseleave', stop);
		} else {
			return;
		}
	});
}

mouseEvents(productList);
