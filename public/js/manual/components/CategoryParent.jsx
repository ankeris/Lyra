import { h, render, Component } from 'preact';
import DropdownSVG from './DropdownSVG';
import NavigationItem from './NavigationItem';
import NavigationExposerItem from './NavigationExposerItem';
import { slidetoggle } from './helpers';

export default class extends Component {
	constructor(props) {
		super(props);
        this.slidetoggleEl = this.slidetoggleEl.bind(this);
	}
	slidetoggleEl() {
        slidetoggle(this.wrapper)
    }
	render({activeItem, category, link, childLink, isOpen, exposeSelection}, state) {
		return <div className="navigation-dropdown">
				<div className="navigation-dropdown--button">
					{	exposeSelection ? 
						<div onClick={() => exposeSelection(category)} className={`subcategory-box__item--text ${window.categoryKey == category.key ? 'active' : ''} ${activeItem == category.key ? 'active' : null}`}>{ category.name }</div>
						:
						<a href={link} className={`subcategory-box__item--text ${window.categoryKey == category.key ? 'active' : ''}`}>{ category.name }</a>
					}
					<DropdownSVG isOpen={isOpen} clicked={this.slidetoggleEl} />
				</div>
				<div className="subcategory-box js-accordion"  ref={wrapper => this.wrapper = wrapper}>
					{category.children.length ? 
						category.children.map(x => 
							!!exposeSelection ?
							<NavigationExposerItem activeItem={activeItem} clicked={(e) => exposeSelection(e)} navigationItem={x}/> :
							<NavigationItem link={`${childLink}${x.key}`} navigationItem={x} />
						)
					: null}
                </div>
			</div>
	}
}
            
