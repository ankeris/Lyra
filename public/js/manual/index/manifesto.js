let allSpans = document.querySelectorAll('#manifesto .message span');

for (let i = 0; i < allSpans.length; i++) {
    setTimeout(function() {
        allSpans[i].className = 'fade-in';
    }, i * 700);
}
