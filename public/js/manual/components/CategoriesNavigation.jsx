import { h, render, Fragment, Component } from 'preact';
import CategoryParent from './CategoryParent';
import NavigationItem from './NavigationItem';
import NavigationExposerItem from './NavigationExposerItem';
import DropdownSVG from './DropdownSVG';
import { accordionate, slidetoggle } from './helpers';

export default class extends Component {
	constructor(props) {
        super(props);
        this.getOpenStatus = this.getOpenStatus.bind(this);
        this.slidetoggleEl = this.slidetoggleEl.bind(this);
    }
    getOpenStatus(category) {
        return category.key == window.categoryKey || category.children.find(x => x.key == window.categoryKey);
    }
    slidetoggleEl() {
        slidetoggle(this.wrapper)
    }
    
	render({hideManufacturers, categories, manufacturers, link, exposeSelection}, state) {
		return <aside className="side-nav">
            <div className="side-nav__box">
                {hideManufacturers ? null : 
                    <div id="manufacturers-dropdown" className="navigation-dropdown">
                        <a href="/prekiu-zenklai" className="subcategory-box__item--text">Gamintojai</a>
                        <DropdownSVG clicked={this.slidetoggleEl} />
                        {manufacturers && manufacturers.length ? 
                            <div className="subcategory-box js-accordion" ref={wrapper => this.wrapper = wrapper}>
                                {
                                    manufacturers.map((manufacturer) => 
                                    <NavigationItem link={`/prekiu-zenklai/${manufacturer.key}`} navigationItem={manufacturer} />)
                                }
                            </div>
                        : null}
                    </div>
                }
                {categories.map(category => {
                    return category.children && category.children.length ?
                    <CategoryParent 
                        exposeSelection={(e) => exposeSelection(e)}
                        isOpen={this.getOpenStatus(category)} 
                        link={`${link}/${category.key}`}
                        childLink={`${link}/`}
                        category={category}
                    />
                    :
                    !!exposeSelection ?
                    <NavigationExposerItem clicked={(e) => exposeSelection(e)} navigationItem={category}/> :
                    <NavigationItem link={`${link}/${category.key}`} navigationItem={category} />
                })}
            </div>
        </aside>
	}
}