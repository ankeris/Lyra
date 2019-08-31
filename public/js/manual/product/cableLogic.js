const selector = document.getElementById('cablePriceSelect');
const displayer = document.getElementById('cablePrice');

if (selector && displayer) {
	selector.addEventListener('change', (ev) => {
		displayer.innerHTML = `${ev.target.value} €`;
	});
}