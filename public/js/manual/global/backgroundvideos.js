import inView from 'in-view';

inView('.bg-video')
	.on('enter', el => {
		el.play();
	})
	.on('exit', el => {
		el.pause();
	});
