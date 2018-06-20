//ajax
// Load more products
let currentPage = 1;
let AllProductsLoaded = false;

$("#loading-content").hide();

function addNextPage() {
	currentPage++;
	let parameters = {
		"page": currentPage,
		"filterlist": document.querySelector('.variables').getAttribute('data-sort'),
	};

	const category = document.querySelector('.variables').getAttribute('data-category');
	const count = document.querySelector('.variables').getAttribute('data-count');
	const brand = document.querySelector('.variables').getAttribute('data-brand');

	if (category) {
		if (!AllProductsLoaded) {
			$("#loading-content").show();
			$.get("/products/" + category, parameters, function (data) {
				$(".products").append($(data).find('.products .items-box__item'));
				if ($(data).find('.products .items-box__item').length == 0) {
					AllProductsLoaded = true;
					$("#loading-content").hide();
				}
			});
		}
	} else if (!brand) {
		if (!AllProductsLoaded) {
			$("#loading-content").show();
			$.get("/products", parameters, function (data) {
				$(".products").append($(data).find('.products .items-box__item'));
				if ($(data).find('.products .items-box__item').length == 0) {
					AllProductsLoaded = true;
					$("#loading-content").hide();
				}
			});
		}
	} else if (brand) {
		if (!AllProductsLoaded) {
			$("#loading-content").show();
			$.get("/brands/" + brand, parameters, function (data) {
				$(".products").append($(data).find('.products .items-box__item'));
				if ($(data).find('.products .items-box__item').length == 0) {
					AllProductsLoaded = true;
					$("#loading-content").hide();
				}
			});
		}
	}
}

let scrollNews = _.throttle(function (e) {
	if ($(window).scrollTop() + $(window).height() > $(document).height() - 240) {
		addNextPage();
	}
}, 1000);

window.addEventListener("scroll", scrollNews, false);
