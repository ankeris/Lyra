//ajax
// Load more products
let currentPage = 1;

function addNextPage(currentPage){

    currentPage++;
    let parameters = {
        "page": currentPage
    };

    $.get("/products", parameters, function(data) {
        $(".products").append($(data).find('.products .items-box__item'));
    });
}

let scrollNews = _.throttle(function(e) {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        addNextPage(currentPage);
    }
}, 500);
window.addEventListener("scroll", scrollNews, false);