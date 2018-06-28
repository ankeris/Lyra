$('.navigation-dropdown').click(function () {
	$(this).next('section').slideToggle('slow');
	$('.dropdownSVG').toggleClass("rotate");
	// if ($(this).next('section').is(':visible')) {
	//     $('html, body').animate({scrollTop: $(this).position().top}, 700);
	// }
});

const el = document.querySelector('.side-nav__box');
if (el) {
    const elTop = el.getBoundingClientRect().top - document.body.getBoundingClientRect().top - 60;

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
