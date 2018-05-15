// effect variable
const opacity = 0.5;

const highlighted = document.querySelector('#currentHighlight');
const images = document.querySelectorAll('.items-box__item-images--item');

images[0].style.opacity = opacity;

images.forEach(img => img.addEventListener('click', changeImage));

function changeImage(newImage) {
    images.forEach(img => (img.style.opacity = 1))
    highlighted.style.backgroundImage = `url('${newImage.target.src}')`;
    highlighted.classList.add('fade-in');
    newImage.target.style.opacity = opacity;
    setTimeout(() => highlighted.classList.remove("fade-in"), 500);
}

console.log(highlighted.style.backgroundImage);