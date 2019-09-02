import { h, render, Component } from 'preact';
import DropdownSVG from './DropdownSVG';
import NavigationItem from './NavigationItem';
import { accordionate } from './helpers';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	render({category, link, childLink, isOpen}, state) {
		return <div className="navigation-dropdown">
				<a href={link} className={`subcategory-box__item--text ${window.categoryKey == category.key ? 'active' : null}`}>{ category.name }</a>
				<DropdownSVG isOpen={isOpen} clicked={accordionate} />
				<div className="subcategory-box js-accordion">
					{category.children.length ? 
						category.children.map(x => 
							<NavigationItem link={`${childLink}${x.key}`} navigationItem={x} />
						)
					: null}
                </div>
			</div>
	}
}
            
