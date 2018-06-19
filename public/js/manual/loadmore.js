//ajax
// Load more products
let currentPage = 1;

function addNextPage(){
    currentPage++;
    let parameters = {
        "page": currentPage,
        "filterlist": document.querySelector('.variables').getAttribute('data-sort'),
    };

    const category = document.querySelector('.variables').getAttribute('data-category');
    const count = document.querySelector('.variables').getAttribute('data-count');

    if (category) {
        $.get("/products/" + category, parameters, function(data) {
            $(".products").append($(data).find('.products .items-box__item'));
        });
    } else {
        $.get("/products", parameters, function(data) {
            $(".products").append($(data).find('.products .items-box__item'));
        });
    }
}

let scrollNews = _.throttle(function(e) {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        addNextPage();
    }
}, 500);

window.addEventListener("scroll", scrollNews, false);

$(document).ready( function() {
    $("#loading-content").hide();
    $(document).ajaxStart(function() {
        $("#loading-content").show();
    });

    $(document).ajaxStop(function() {
        $("#loading-content").hide();
    });
});