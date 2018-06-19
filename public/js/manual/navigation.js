$('.navigation-dropdown').click(function() {
    $(this).next('section').slideToggle('slow');
    $('.dropdownSVG').toggleClass("rotate");
    // if ($(this).next('section').is(':visible')) {
    //     $('html, body').animate({scrollTop: $(this).position().top}, 700);
    // }
});