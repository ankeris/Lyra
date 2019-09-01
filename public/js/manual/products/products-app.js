import { h, render, Component } from 'preact';
import Product from '../components/Product';
import CategoriesNavigation from '../components/CategoriesNavigation';
import Loading from '../components/Loading';

class Products extends Component {
	constructor() {
		super();
		// set initial time:
		this.state = {
			products: [],
			categories: [],
			productsLoaded: false
		};
	}

	componentDidMount() {
		const currentCategoryId = window.categoryId;
		
        if (currentCategoryId) {
			fetch('/api/product/getAll/' + currentCategoryId).then((response) => {
				response.json().then(products => {
					console.log(products);
					
					this.setState({
						products,
						productsLoaded: true
					})
				})
			})
		} else {
			fetch('/api/product/getAll').then((response) => {
				response.json().then(products => {
					this.setState({
						products,
						productsLoaded: true
					})
				})
			})
		}
		fetch('/api/category/getAll').then((response) => {
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

	render(props, {products, categories, productsLoaded}) {
		return productsLoaded && categories.length ? 
		<div class="products-wrapper content-section">
			<CategoriesNavigation categories={categories} page={'products-page'}/>
			<section class="products products--threequarters">
				{products.map(product => {
					return <Product data={product} />
				})}
				{!products.length ? <h3>Atsiprašome, šiuo metu ši kategorija neturi produktų</h3> : null}
			</section>
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
