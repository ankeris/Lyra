// effect variable
const opacity = 0.4;
// loop through all products (parent elements (wrappers))
for (product of products) {
    const [highlighted, allProds] = [product.querySelector('#currentHighlight'), product.querySelectorAll('.items-box__item-images--item')]
    //loop through inner Extra Image Collection block
    allProds.forEach(image => {
        image.addEventListener('click', imageClicked =>
        highlighted.setAttribute("style", `background-image: url(${imageClicked.target.src})`)
        );
    });
}
