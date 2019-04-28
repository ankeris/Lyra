import LazyLoad from 'vanilla-lazyload';

const lazyLoadOptions = {
	elements_selector: '.lazy',
	threshold: 0,
	class_loaded: 'fade-in'
};

export const lazyLoadInstance = new LazyLoad(lazyLoadOptions);
