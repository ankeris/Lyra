import { h, render, Component } from 'preact';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	render({category, link}, state) {
		return <a href={link} className={`side-nav__list-box--item ${window.categoryKey == category.key ? 'active' : null}`}>
            <span className="subcategory-box__item--text">{ category.name }</span>
        </a>
	}
}
            
