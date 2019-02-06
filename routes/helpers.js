function cropCloudlinaryImage(img, width, height) {
	let oldUrl = img.secure_url.split('/');
	oldUrl.splice(oldUrl.length - 2, 0, `c_limit,h_${height},w_${width}`);
	return oldUrl.join('/');
}

function setDiscountedPrice(discount, currentPrice) {
	return Math.round(currentPrice - (currentPrice / 100) * discount);
}

module.exports = {
	cropCloudlinaryImage,
	setDiscountedPrice
};
