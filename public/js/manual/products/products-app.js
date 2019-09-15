import { h, render, Component } from 'preact';
import Product from '../components/Product';
import CategoriesNavigation from '../components/CategoriesNavigation';
import Loading from '../components/Loading';
import Select from '../components/Select';
import FloatingButton from '../components/FloatingButton';
import {constructMenuCategories, isInScreen, scrollToItem} from '../components/helpers';

require('preact/debug');
class Products extends Component {
	constructor() {
		super();
		// set initial time:
		this.state = {
			products: [],
			categories: [],
			productsLoaded: false,
			infiniteScrollCount: 0,
			totalPages: null,
			isLoading: false,
			sortBy: null,
			isProductListInScreen: true
		};
		this.checkLoad = this.checkLoad.bind(this);
		this.setSort = this.setSort.bind(this);
		this.checkProductsVisible = this.checkProductsVisible.bind(this);
	}

	componentDidMount() {
		const currentCategoryId = window.categoryId;
		const isSearch = window.searchHint;
		// If category selected:
		if (isSearch) {
			this.searchProducts(isSearch);
		} else if (currentCategoryId) {
			this.getProductsForCategory();
		// No category - main products page
		} else {
			this.getAllProducts();
		}
		
		this.getAllCategories();
		this.getAllManufacturers();

		this.checkLoad();
	}

	checkLoad() {
		let allowNewLoad = true;
		const currentCategoryId = window.categoryId;
		
		window.addEventListener('scroll', (event) => {
			const bounding = this.elementToTriggerLoad ? this.elementToTriggerLoad.getBoundingClientRect() : null;
			if (bounding) {
				const distanceToBottom = bounding.bottom - window.innerHeight;
				if (distanceToBottom < 30 && allowNewLoad) {
					allowNewLoad = false;
					// If category selected:
					if (currentCategoryId) {
						if (this.state.infiniteScrollCount < this.state.totalPages) {
							this.getProductsForCategory().then(() => {
								allowNewLoad = true;
							});
						}
					// No category - main products page
					} else {
						if (this.state.infiniteScrollCount < this.state.totalPages) {
							this.getAllProducts().then(() => {
								allowNewLoad = true;
							});
						}
					}
				}
			}
			if (window.innerWidth <= 700) {
				const productSection = document.querySelector('.products');
				this.setState({
					isProductListInScreen: isInScreen(productSection)
				})
			} else {
				this.setState({
					isProductListInScreen: true
				})
			}
		})
	}

	getAllCategories() {
		// Always have all categories
		fetch('/api/categories/getAll').then((response) => {
			response.json().then(categories => {
				this.setState({
					categories: constructMenuCategories(categories)
				})
			})
		})
	}

	getAllManufacturers() {
		fetch('/api/manufacturers/getAll').then((response) => {
			response.json().then(manufacturers => {
				this.setState({
					manufacturers
				})
			})
		})
	}

	getProductsForCategory() {
		const currentCategoryId = window.categoryId;
		const categoryIsParent = window.categoryIsParent;
		this.setState({isLoading: true});
		return fetch(`/api/products/getAll/${currentCategoryId}
		${categoryIsParent ? 
		'?categoryIsParent=true' : '?categoryIsParent=false'}
		&page=${this.state.infiniteScrollCount}
		${this.state.sortBy ? '&sort='+this.state.sortBy : '&sort=false'}`)
		.then((response) => {
			return response.json().then(({data, totalPages}) => {
				this.setState({
					products: [...this.state.products, ...data],
					productsLoaded: true,
					infiniteScrollCount: this.state.infiniteScrollCount + 1,
					totalPages,
					isLoading: false
				})
			})
		})
	}

	searchProducts(hint) {
		fetch('/api/products/getSearched/?search=' + hint).then((response) => {
			response.json().then(({data}) => {
				console.log(data);
				this.setState({
					products: [...this.state.products, ...data],
					productsLoaded: true,
					isLoading: false
				})
			})
		})
	}

	getAllProducts() {
		this.setState({isLoading: true});
		return fetch(`/api/products/getAll?page=${this.state.infiniteScrollCount}
		${this.state.sortBy ? '&sort='+this.state.sortBy : '&sort=false'}`)
		.then((response) => {
			return response.json().then(({data, totalPages}) => {
				this.setState({
					products: [...this.state.products, ...data],
					productsLoaded: true,
					infiniteScrollCount: this.state.infiniteScrollCount + 1,
					totalPages,
					isLoading: false
				})
			})
		})
	}

	setSort(sortValue) {
		const currentCategoryId = window.categoryId;
		// Wipe out products
		this.setState({
			products: [],
			sortBy: sortValue,
			infiniteScrollCount: 0,
			productsLoaded: false
		})
        if (currentCategoryId) {
			this.getProductsForCategory();
		} else {
			this.getAllProducts();
		}
	}

	checkProductsVisible(el) {
		setTimeout(() => {
			if (window.innerWidth <= 700) {
				this.setState({
					isProductListInScreen: isInScreen(el)
				});
			}
		}, 100);
	}

	render(props, {products, categories, manufacturers, productsLoaded, isLoading, isProductListInScreen}) {
		return categories.length && products.length ? 
		<div className="products-wrapper content-section">
			<Select onChange={this.setSort}/>
			{isProductListInScreen ? null : <FloatingButton clicked={() => scrollToItem('.sort-bar__box')} text={'Produktai'}/> }
			<CategoriesNavigation categories={categories} manufacturers={manufacturers} link={'/produktai'}/>
			{categories.length ? 
				<section ref={this.checkProductsVisible} className="products products--threequarters">
					{products.map(product => {
						return <Product data={product} />
					})}
					{productsLoaded && !products.length ? <h3>Atsiprašome, šiuo metu ši kategorija neturi produktų</h3> : null}
				{isLoading ? <Loading/> : null}
				</section>
			: null }
			<div id="loader" ref={elementToTriggerLoad => this.elementToTriggerLoad = elementToTriggerLoad}></div>
		</div>
		:
		<div style="margin-bottom: 2000px;">
		</div>
	}
}

// render an instance of Products into <body>:
if (document.getElementById('app')) {
	render(<Products />, document.getElementById('app'));
}
