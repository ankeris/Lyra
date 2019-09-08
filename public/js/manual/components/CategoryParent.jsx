import { h, render, Component } from 'preact';
import DropdownSVG from './DropdownSVG';
import NavigationItem from './NavigationItem';
import { slidetoggle } from './helpers';

export default class extends Component {
	constructor(props) {
		super(props);
        this.slidetoggleEl = this.slidetoggleEl.bind(this);
	}
	slidetoggleEl() {
        slidetoggle(this.wrapper)
    }
	render({category, link, childLink, isOpen}, state) {
		return <div className="navigation-dropdown">
				<div className="navigation-dropdown--button">
					<a href={link} className={`subcategory-box__item--text ${window.categoryKey == category.key ? 'active' : ''}`}>{ category.name }</a>
					<DropdownSVG isOpen={isOpen} clicked={this.slidetoggleEl} />
				</div>
				<div className="subcategory-box js-accordion"  ref={wrapper => this.wrapper = wrapper}>
					{category.children.length ? 
						category.children.map(x => 
							<NavigationItem link={`${childLink}${x.key}`} navigationItem={x} />
						)
					: null}
                </div>
			</div>
	}
}
            
