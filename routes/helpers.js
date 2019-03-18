function cropCloudlinaryImage(img, width, height, useWebp) {
	let oldUrl = img.secure_url.split('/');
	oldUrl.splice(oldUrl.length - 2, 0, `c_limit,h_${height},w_${width}`);
	if (useWebp) {
		oldUrl[oldUrl.length - 1] = oldUrl[oldUrl.length - 1].replace('.jpg', '.webp').replace('.png', '.webp');
	}

	return oldUrl.join('/');
}

function setDiscountedPrice(discount, currentPrice) {
	return Math.round(currentPrice - (currentPrice / 100) * discount);
}

function getSort(filter) {
	if (filter == 'price-high') {
		return {
			price: -1
		};
	} else if (filter == 'price-low') {
		return {
			price: 1
		};
	}
}

function getRidOfMetadata(data, cropImages, width, height, supportWebP) {
	let result;
	// Some data has products array inside 'data.results' and some in just 'data' therefore we need conditional statement
	data.results ? (result = data.results) : (result = data);
	let filteredResult = [];
	// loop through each product
	result.forEach(r => {
		// check if cropImage setting is set to true and if image exists
		if (cropImages && r.images[0]) {
			// Changes the link for each picture to a fixed height and width - in order to load faster.
			r.images.forEach(img => {
				// change old secure_url to new (with new parameters);
				img.secure_url = cropCloudlinaryImage(img, height, width, supportWebP);
			});
			if (!r.Discount) {
				if (r.ProductType[0].discount > 0) {
					const discount = setDiscountedPrice(r.ProductType[0].discount, r.price);
					r.Discount = discount;
				}
			}
		}
		filteredResult.push(r.toObject());
	});
	return filteredResult;
}

module.exports = {
	cropCloudlinaryImage,
	setDiscountedPrice,
	getSort,
	getRidOfMetadata
};
