const selector = document.getElementById('cablePriceSelect');
const displayer = document.getElementById('cablePrice');

selector.addEventListener('change', (ev) => {
	displayer.innerHTML = `${ev.target.value} €`;
});