import { h, render, Component } from 'preact';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	render({navigationItem, link}, state) {
		return <a href={link} className={`side-nav__list-box--item ${window.categoryKey == navigationItem.key ? 'active' : ''}`}>
            <span className="subcategory-box__item--text">{ navigationItem.name }</span>
        </a>
	}
}
            
