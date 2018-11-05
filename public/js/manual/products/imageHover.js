// let imageInt = 0;
// let timeOut;
// let productList = document.querySelectorAll('.items-box__item');
// let observer;

// // Add event for each product, when mouse enters
// function mouseEvents(listOfElements) {
//   listOfElements.forEach(el => {
//     el.addEventListener('mouseenter', function(e) {
//       startAnim(el);
//     });
  
//     el.addEventListener('mouseleave', function() {
//         stopanim(el)
//     })
//   })
// }
// // DOM Observation (actively checking what changes in DOM tree)
// let observedElement = document.querySelector('.products');
// let options = {
//   attributes: true,
//   subtree: true,
//   childList: true
// }
// observer = new MutationObserver(mutated);
// observer.observe(observedElement, options);
// function mutated(mutationList) {
//   mouseEvents(mutationList[0].addedNodes);
// }
// mouseEvents(productList);

// // DOM Manipulation functions
// function changeBack(el) {
//   for (let i = 0; i < el.children[0].children[0].children.length; i++) {
//     // Adds "hidden" class to ALL of the images for a product
//     el.children[0].children[0].children[i].classList.add('hidden');
//   }
//   // Removes "hidden" class for the first image of the item
//   el.children[0].children[0].children[0].classList.remove('hidden');
// }

// function changeImages(el) {
//     imageInt += 1;
//     if (imageInt === el.children[0].children[0].children.length) {
//       // reset to 0 after going through all
//       imageInt = 0;
//     }
//     for (let i = 0; i < el.children[0].children[0].children.length; i++) {
//       // Adds "hidden" class to ALL of the images for a product
//       el.children[0].children[0].children[i].classList.add('hidden');
//     }
//     // Removes "hidden" class for one
//     el.children[0].children[0].children[imageInt].classList.remove('hidden');
//     timeOut = setTimeout(changeImages.bind(null, el), 1000);
// }

// function startAnim(element) {
//   changeImages(element);
// }

// function stopanim(element) {
//   changeBack(element);
//   clearTimeout(timeOut);
//   imageInt = 0;
// }

let productList = document.querySelectorAll('.items-box__item');
let observer;
// DOM Observation (actively checking what changes in DOM tree)
let observedElement = document.querySelector('.products');
let options = {
  attributes: true,
  subtree: true,
  childList: true
}
observer = new MutationObserver(mutated);
observer.observe(observedElement, options);
function mutated(mutationList) {
  mouseEvents(mutationList[0].addedNodes);
}

const play = (box) => {
  while (!box.classList.contains('items-box__item')) box = box.parentElement;
  let img = box.querySelector('.show');
  img.classList.remove('show');
  (img.nextElementSibling.className != 'items-box__item--description' ? 
  img.nextElementSibling : box.firstElementChild).classList.add('show');
}

const stop = ({target: box, relatedTarget: rt}) => {
  console.log('hi')
  while (!box.classList.contains('items-box__item')) box = box.parentElement;
  while (rt != box && rt) rt = rt.parentElement;
  if (rt === box) return;
  box.querySelector('.show').classList.remove('show');
  box.firstElementChild.classList.add('show');
  box.play = clearInterval(box.play);
}

function mouseEvents(list) {
  console.log(list);
  [...list].forEach((box) => {
    box.addEventListener(
      'mouseenter', 
      function() {
        if (box.play) return;
        play(box);
        box.play = setInterval(() => play(box), 1000);
      }
    );
    
    box.addEventListener('mouseleave', stop);
  });
}

mouseEvents(productList);