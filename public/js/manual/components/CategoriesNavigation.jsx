import { h, render, Fragment, Component } from 'preact';
import CategoryParent from './CategoryParent';
import NavigationItem from './NavigationItem';
import DropdownSVG from './DropdownSVG';
import { accordionate } from './helpers';

export default class extends Component {
	constructor(props) {
        super(props);
        this.getOpenStatus = this.getOpenStatus.bind(this);
    }
    
    getOpenStatus(category) {
        return category.key == window.categoryKey || category.children.find(x => x.key == window.categoryKey);
    }
    
	render({categories, manufacturers, link}, state) {
		return <aside className="side-nav">
            <div className="side-nav__box">
                <div id="manufacturers-dropdown" className="navigation-dropdown">
                    <a href="/prekiu-zenklai" className="subcategory-box__item--text">Gamintojai</a>
                    <DropdownSVG clicked={accordionate} />
                    {manufacturers && manufacturers.length ? 
                        <div className="subcategory-box js-accordion">
                            {
                                manufacturers.map((manufacturer) => 
                                <NavigationItem link={`/prekiu-zenklai/${manufacturer.key}`} navigationItem={manufacturer} />)
                            }
                        </div>
                    : null}
                </div>
                {categories.map(category => {
                    return category.children && category.children.length ?
                    <CategoryParent 
                    isOpen={this.getOpenStatus(category)} 
                    link={`${link}/${category.key}`}
                    childLink={`${link}/`}
                    category={category}/>
                    :
                    <NavigationItem link={`${link}/${category.key}`} navigationItem={category} />
                })}
            </div>
        </aside>
	}
}