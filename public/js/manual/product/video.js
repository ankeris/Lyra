import Plyr from 'plyr/dist/plyr';
import 'plyr/dist/plyr.css';
const player = new Plyr('#player');

if (document.querySelector('#player')) {
	document.querySelector('#player').addEventListener('ready', event => {
		player.volume = 0;
		player.play();
	});
}

export {player};
