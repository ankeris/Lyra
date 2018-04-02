let products = document.querySelectorAll('.items-box__item');
const parentEl = document.querySelector('.items-box');

// loops through products
for (let i = 0; i < products.length; i++) {
    if(products[i - 1]) {
        // if there is a previous product, check if the class name is same
        if(!(products[i].getAttribute('class') == products[i - 1].getAttribute('class'))) {
            let el = createElementFromHTML(products[i].getAttribute('manufacturer'));
            parentEl.insertBefore(el, products[i]);
        }   
    } else {
        let el = createElementFromHTML(products[i].getAttribute('manufacturer'));
        parentEl.insertBefore(el, products[i]);
    }
}

function createElementFromHTML(manufacturer) {
    let element = document.createElement('div');
    element.setAttribute('class', 'items-box__item--separator');
    element.innerHTML = manufacturer.trim();
    return element;
}
