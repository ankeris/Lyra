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
			allProducts: [],
			filteredProducts: [],
			categories: [],
			currentPage: 1,
			pageSize: 3,
			productsLoaded: false,
			infiniteScrollCount: 0,
			totalPages: null,
			isLoading: false,
			currentCategory: false
		};
		this.checkLoad = this.checkLoad.bind(this);
		this.setSort = this.setSort.bind(this);
		this.setCategory = this.setCategory.bind(this);
		this.resetFilters = this.resetFilters.bind(this);
	}

	componentDidMount() {
		// If category selected:
		this.getAllDiscountedProducts();
		this.getAllManufacturers();
		this.checkLoad();
	}

	checkLoad() {
		window.addEventListener('scroll', (event) => {
			const bounding = this.elementToTriggerLoad ? this.elementToTriggerLoad.getBoundingClientRect() : null;
			if (bounding) {
				const distanceToBottom = bounding.bottom - window.innerHeight;
				if (!this.state.currentCategory) {
					if (distanceToBottom < 30) {
						if (this.state.allProducts.length > this.state.pageSize * (this.state.currentPage)) {
							this.setState({
								currentPage: this.state.currentPage + 1,
								filteredProducts: this.state.allProducts.slice(0, this.state.pageSize * (this.state.currentPage + 1)),
							});
						}
					}
				} else {
					// for category:
					const filteredByCat = this.state.allProducts.filter(x => x.ProductType.key == this.state.currentCategory.key);
					if (distanceToBottom < 30) {
						if (filteredByCat.length >= this.state.pageSize * (this.state.currentPage)) {
							this.setState({
								currentPage: this.state.currentPage + 1,
								filteredProducts: filteredByCat.slice(0, this.state.pageSize * (this.state.currentPage + 1)),
							});
						}
					}
				}
			}
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

	getAllDiscountedProducts() {
		this.setState({isLoading: true});
		return fetch('/api/products/getAll/discounted')
		.then((response) => {
			return response.json().then((data) => {
				this.setState({
					allProducts: data,
					infiniteScrollCount: this.state.infiniteScrollCount + 1,
					isLoading: false
				});
				this.unifyConstructCategories(data.map(x => x.ProductType));
				this.setFilteredProducts();
			});
		});
	};

	setFilteredProducts() {
		if (this.state.currentCategory) {
			const filteredByCat = this.state.allProducts.filter(x => x.ProductType.key == this.state.currentCategory.key);
			this.setState({
				filteredProducts: filteredByCat.slice(0, this.state.pageSize * this.state.currentPage),
			})
		} else {
			this.setState({
				filteredProducts: this.state.allProducts.slice(0, this.state.pageSize * this.state.currentPage),
			})
		}
	}
	
	setCategory(currentCategory) {
		this.setState({
			currentCategory,
			filteredProducts: this.state.allProducts.filter(x => x.ProductType.key == currentCategory.key).slice(0, this.state.pageSize),
			currentPage: 1
		})
	}

	unifyConstructCategories(categories) {
		const filtered = categories.reduce((accumulator, currentValue) => {
			if (!accumulator.some(x => x._id == currentValue._id)) accumulator.push(currentValue);
			return accumulator
		}, []);
		this.setState({
			categories: constructMenuCategories(filtered)
		})
	};

	setSort(newSortValue) {
		switch (newSortValue) {
			case 'price-high':
				this.setState({
					allProducts: this.state.allProducts.sort((a, b) => parseFloat(b.Discount) - parseFloat(a.Discount)),
				});
				this.setFilteredProducts();
				break;
			case 'price-low':
				this.setState({
					allProducts: this.state.allProducts.sort((a, b) => parseFloat(a.Discount) - parseFloat(b.Discount)),
				});
				break;
			case 'manufacturer':
				this.setState({
					allProducts: this.state.allProducts.sort((a, b) => a.Manufacturer && b.Manufacturer ? a.Manufacturer.name.localeCompare(b.Manufacturer.name) : 1),
				});
				break;		
			default:
		}
		this.setFilteredProducts();
	}

	resetFilters() {
		this.setState({
			currentCategory: false,
			filteredProducts: this.state.allProducts.slice(0, this.state.pageSize),
			currentPage: 1
		})
		this.setFilteredProducts();
	}

	render(props, {currentCategory, filteredProducts, allProducts, categories, manufacturers, isLoading, currentBrandKey}) {
		return allProducts.length ? 
		<div className="products-wrapper content-section">
			<Select currentCategory={currentCategory} onButtonClick={this.resetFilters} onChange={this.setSort}/>
			<CategoriesNavigation hideManufacturers={true} categories={categories} manufacturers={manufacturers} exposeSelection={(cat) => this.setCategory(cat)} link={`/prekiu-zenklai/${currentBrandKey}`}/>
				<section className="products products--threequarters">
					{filteredProducts.map(product => {
						return <Product data={product} />
					})}
				{isLoading ? <Loading/> : null}
				</section>
			<div id="loader" ref={elementToTriggerLoad => this.elementToTriggerLoad = elementToTriggerLoad}></div>
		</div>
		:
		<div style="margin-bottom: 2000px;">
			{isLoading ? <Loading/> : null}
		</div>
	}
}

// render an instance of Products into <body>:
if (document.getElementById('app')) {
	render(<Products />, document.getElementById('app'));
}
