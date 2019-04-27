import LazyLoad from 'vanilla-lazyload';

const lazyLoadOptions = {
	elements_selector: '.lazy',
	threshold: 60,
	class_loaded: 'fade-in'
};

export const lazyLoadInstance = new LazyLoad(lazyLoadOptions);
