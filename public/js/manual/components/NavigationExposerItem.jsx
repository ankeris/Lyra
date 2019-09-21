import { h, render, Component } from 'preact';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	render({activeItem, navigationItem, clicked}, state) {
		return <div onClick={() => clicked(navigationItem)} className={`side-nav__list-box--item ${window.categoryKey == navigationItem.key ? 'active' : ''} ${activeItem == navigationItem.key ? 'active' : '' }`}>
            <span className="subcategory-box__item--text">{ navigationItem.name }</span>
        </div>
	}
}