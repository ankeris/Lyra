const wordsWrapper = document.querySelector('.manifesto .message--huge');
const allSpans = document.querySelectorAll('.manifesto .message--huge span');
const logo = document.getElementById('logoDissapear');
document.addEventListener('DOMContentLoaded', function() {
	setTimeout(() => {
		logo.classList.add('fade-out');
		setTimeout(() => {
			logo.classList.add('hidden');
			wordsWrapper.classList.remove('hidden');
			wordsWrapper.classList.add('fade-in');
			for (let i = 0; i < allSpans.length; i++) {
				setTimeout(function() {
					allSpans[i].className = 'fade-in';
				}, i * 300);
			}
		}, 400);
	}, 1500);
}, false);
