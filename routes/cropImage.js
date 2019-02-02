function cropCloudlinaryImage(img, width, height) {
	let oldUrl = img.secure_url.split('/');
	oldUrl.splice(oldUrl.length - 2, 0, `c_limit,h_${height},w_${width}`);
	return oldUrl.join('/');
}
module.exports = cropCloudlinaryImage;
