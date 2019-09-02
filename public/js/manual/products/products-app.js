import { h, render, Component } from 'preact';
import Product from '../components/Product';
import CategoriesNavigation from '../components/CategoriesNavigation';
import Loading from '../components/Loading';
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
			isLoading: false
		};
		this.checkLoad = this.checkLoad.bind(this);
	}

	componentDidMount() {
		const currentCategoryId = window.categoryId;
		// If category selected:
        if (currentCategoryId) {
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
		})
	}

	getAllCategories() {
		// Always have all categories
		fetch('/api/categories/getAll').then((response) => {
			response.json().then(categories => {
				const sortedCategories = categories.reduce((accumulator, currentValue) => {
					if (currentValue.IsParentCategory) {
					// Push this as a new parent
					accumulator.push({ ...currentValue, children: [] });
					} else if (currentValue.ChildCategoryOf && currentValue.ChildCategoryOf._id) {
						const parent = accumulator.find(category => category._id === currentValue.ChildCategoryOf._id)	
						// add as children to parent
						if (parent) {
							parent.children.push(currentValue);
						}
					} else {
						accumulator.push(currentValue);
					}
					return accumulator;
				}, []);
				
				this.setState({
					categories: sortedCategories
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
		&page=${this.state.infiniteScrollCount}`)
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

	getAllProducts() {
		this.setState({isLoading: true});
		return fetch(`/api/products/getAll?page=${this.state.infiniteScrollCount}`)
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

	render(props, {products, categories, manufacturers, productsLoaded, isLoading}) {
		return productsLoaded && categories.length ? 
		<div className="products-wrapper content-section">
			<CategoriesNavigation categories={categories} manufacturers={manufacturers} page={'products-page'}/>
			<section className="products products--threequarters">
				{products.map(product => {
					return <Product data={product} />
				})}
				{!products.length ? <h3>Atsiprašome, šiuo metu ši kategorija neturi produktų</h3> : null}
			{isLoading ? <Loading/> : null}
			</section>
			<div ref={elementToTriggerLoad => this.elementToTriggerLoad = elementToTriggerLoad}></div>
		</div>
		:
		<div style="margin-bottom: 2000px;">
			<Loading />
		</div>
	}
}

// render an instance of Products into <body>:
if (document.getElementById('app')) {
	render(<Products />, document.getElementById('app'));
}
