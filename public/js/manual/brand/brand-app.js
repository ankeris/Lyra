import { h, render, Component } from 'preact';
import Product from '../components/Product';
import CategoriesNavigation from '../components/CategoriesNavigation';
import Loading from '../components/Loading';
import Select from '../components/Select';
import {constructMenuCategories} from '../components/helpers';

class Products extends Component {
	constructor() {
		super();
		// set initial time:
		this.state = {
            currentBrandKey: null,
			products: [],
			categories: [],
			productsLoaded: false,
			infiniteScrollCount: 0,
			totalPages: null,
			isLoading: false,
            sortBy: null,
		};
		this.checkLoad = this.checkLoad.bind(this);
		this.setSort = this.setSort.bind(this);
	}

	componentDidMount() {
		const currentCategoryId = window.categoryId;
        const currentBrandKey = window.currentBrandKey;

        this.setState({
            currentBrandKey
        })
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
        const currentBrandId = window.currentBrandId;
		// Always have all categories
		fetch(`/api/categories/getAll/manufacturer/${currentBrandId}`).then((response) => {
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
		///api
		const currentCategoryId = window.categoryId;
        const currentBrandId = window.currentBrandId;
		const categoryIsParent = window.categoryIsParent;
		this.setState({isLoading: true});
		return fetch(`/api/products/getAll/manufacturer/${currentBrandId}/category/${currentCategoryId}
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

	getAllProducts() {
        const currentBrandId = window.currentBrandId;
		this.setState({isLoading: true});
		return fetch(`/api/products/getAll/manufacturer/${currentBrandId}?page=${this.state.infiniteScrollCount}
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

	render(props, {products, categories, manufacturers, productsLoaded, isLoading, currentBrandKey}) {
		return currentBrandKey && categories.length ? 
		<div className="products-wrapper content-section">
			<Select onChange={this.setSort}/>
			<CategoriesNavigation categories={categories} manufacturers={manufacturers} link={`/prekiu-zenklai/${currentBrandKey}`}/>
				<section className="products products--threequarters">
					{products.map(product => {
						return <Product data={product} />
					})}
					{productsLoaded && !products.length ? <h3>Atsiprašome, šiuo metu ši kategorija neturi produktų</h3> : null}
				{isLoading ? <Loading/> : null}
				</section>
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
