// effect variable
const opacity = 0.4;
// loop through all products (parent elements (wrappers))
for (product of products) {
    const [highlighted, allProds] = [product.querySelector('#currentHighlight'), product.querySelectorAll('.items-box__item-images--item')]
    //loop through inner Extra Image Collection block
    allProds.forEach(image => {
        image.addEventListener('click', imageClicked => {
            allProds.forEach(element => (element.style.opacity = 1)); //resets the opacity when toggle
            highlighted.setAttribute("style", `background-image: url(${imageClicked.target.src})`);
            highlighted.classList.add('fade-in');
            // reset classname for highlighted element
            setTimeout(() => highlighted.classList.remove('fade-in'), 500);
            imageClicked.target.style.opacity = opacity;
        });
    });
}
