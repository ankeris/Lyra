import { h, render, Component } from 'preact';

export default class extends Component {
	constructor(props) {
		super(props);
		this.svgWasClicked = this.svgWasClicked.bind(this);
	}
	
	componentDidMount() {
		if (this.props.isOpen) {
			this.svgWasClicked(this.svg)
		}
	}

	svgWasClicked() {
		this.props.clicked(this.svg)
	}

	render(props, state) {
		return <svg 
		ref={svg => this.svg = svg}
		onClick={this.svgWasClicked} 
		className="subcategory-box__item--svg" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3.7 1.82">
        <title>Dropdown</title>
        <path className="cls-1" d="M.22.48H0l1.79,1.8a.07.07,0,0,0,.1,0L3.7.48H3.48L1.89,2.06a0,0,0,0,1-.07,0L.22.48" transform="translate(0 -0.48)"/>
        </svg>
	}
}
