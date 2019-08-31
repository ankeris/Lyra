import { h, render, Component } from 'preact';
import Product from '../components/Product';

class Clock extends Component {
	constructor() {
		super();
		// set initial time:
		this.state = {
			products: [],
			categories: []
		};
	}

	componentDidMount() {
        // update time every second
        fetch('/api/product/getAll').then((response) => {
			response.json().then(products => {
				this.setState({
					products
				})
			})
		})

		fetch('/api/category/getAll').then((response) => {
			response.json().then(categories => {
				const sortedCategories = categories.reduce((accumulator, currentValue) => {
					if (currentValue.IsParentCategory) {
					// Push this as a new parent
					accumulator.push({ name: currentValue.name, _id: currentValue._id, children: [] });
					} else if (currentValue.ChildCategoryOf && currentValue.ChildCategoryOf._id) {
						const parent = accumulator.find(category => category._id === currentValue.ChildCategoryOf._id)	
						// add as children to parent
						if (parent) {
							parent.children.push(currentValue);
						}
					}
					return accumulator;
				}, []);
				console.log(sortedCategories);
				
				this.setState({
					categories
				})
			})
		})
	}

	render(props, {products}) {
		return <div class="products-wrapper content-section">
			<section class="products products--threequarters">
				{products.map(product => {
					return <Product data={product} />
				})}
			</section>
		</div>;
	}
}

// render an instance of Clock into <body>:
if (document.getElementById('app')) {
	render(<Clock />, document.getElementById('app'));
}
