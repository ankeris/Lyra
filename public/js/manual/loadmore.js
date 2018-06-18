//ajax
// Load more products

let currentPage = 1;

function addNextPage(currentPage){
    currentPage++;
    let parameters = {
          "currentPage": currentPage
        };

    $.get( "/products", parameters, function(data) {                                 
        $.each(data, function (key) {
            $(".products").append(data);
        });
    });
}

let scrollNews = _.throttle(function(e) {
    if($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        addNextPage(currentPage);
    }
}, 500);
window.addEventListener("scroll", scrollNews, false);