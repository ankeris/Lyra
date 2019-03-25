import LazyLoad from 'vanilla-lazyload';

const lazyLoadOptions = {
	elements_selector: '.lazy',
	threshold: 60
};

export const lazyLoadInstance = new LazyLoad(lazyLoadOptions);
