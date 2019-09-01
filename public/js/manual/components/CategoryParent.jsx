import { h, render, Component } from 'preact';
import DropdownSVG from './DropdownSVG';
import Category from './Category';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	accordionate(e) {
		let parentItem = e.parentElement;
		
		parentItem.classList.toggle('accordion--active');
	
		let elementContent = parentItem.querySelector('.js-accordion');
		parentItem.style.height = e.dataset.height;
		
		if (elementContent) {
			let elementContentHeight = elementContent.offsetHeight;
			let newHeight;
			let heightAttr = parentItem.dataset.height;
	
			if (heightAttr === undefined) {
				newHeight = parentItem.offsetHeight + elementContentHeight;
				parentItem.dataset.height = parentItem.offsetHeight;
			}
			else {
				if (heightAttr < parentItem.offsetHeight) {
					newHeight = heightAttr;
				}
				else {
					newHeight = parentItem.offsetHeight + elementContentHeight;
				}
			}
			parentItem.style.height = newHeight + 'px';
		}
	}

	render({category, link, isOpen}, state) {
		return <div className="navigation-dropdown">
				<a href={link} className={`subcategory-box__item--text ${window.categoryKey == category.key ? 'active' : null}`}>{ category.name }</a>
				<DropdownSVG isOpen={isOpen} clicked={this.accordionate} />
				<div className="subcategory-box js-accordion">
					{category.children.length ? 
						category.children.map(x => 
							<Category link={`/produktai/${x.key}`} category={x} />
						)
					: null}
                </div>
			</div>
	}
}
            
