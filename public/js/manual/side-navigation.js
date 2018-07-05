$('.navigation-dropdown')
    .click(function () {
        $(this)
            .next('section')
            .slideToggle('slow');
        $('.dropdownSVG').toggleClass("rotate");
    });

const el = document.querySelector('.side-nav__box');

if (el) {
    const elTop = el
        .getBoundingClientRect()
        .top - document
        .body
        .getBoundingClientRect()
        .top - 60;

    const mq = window.matchMedia("(max-width: 700px)");

    window.addEventListener('scroll', function () {
        if (mq) {
            if (document.documentElement.scrollTop > elTop) {
                el.style.position = 'sticky';
                el.style.top = '60px';
            } else {
                el.style.top = 'auto';
            }
        }
    });
}

let subcategories = document.querySelectorAll('.subcategory-box__item');
console.log(subcategories);

// for (let i = 0; i >= subcategories.length; i++) {
// 	console.log(subcategories); }