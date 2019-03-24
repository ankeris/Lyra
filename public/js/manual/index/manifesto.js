$ = require('jquery');
let allSpans = document.querySelectorAll('.manifesto .message--huge span');

$(document).ready(function() {
	for (let i = 0; i < allSpans.length; i++) {
		setTimeout(function() {
			allSpans[i].className = 'fade-in';
		}, i * 700);
	}
});
