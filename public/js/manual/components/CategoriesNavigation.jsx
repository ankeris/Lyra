import { h, render, Fragment, Component } from 'preact';
import CategoryParent from './CategoryParent';
import Category from './Category';

export default class extends Component {
	constructor(props) {
        super(props);
        this.getOpenStatus = this.getOpenStatus.bind(this);
    }
    
    getOpenStatus(category) {
        return category.key == window.categoryKey || category.children.find(x => x.key == window.categoryKey);
    }
    
	render({categories}, state) {
		return <aside className="side-nav">
            <div className="side-nav__box">
                <div id="manufacturers-dropdown">
                    <a href="/prekiu-zenklai" className="subcategory-box__item--text">Gamintojai</a>
                </div>
                {categories.map(category => {
                    return category.children && category.children.length ?
                    <CategoryParent isOpen={this.getOpenStatus(category)} link={`/produktai/${category.key}`} category={category}/> 
                    :
                    <Category link={`/produktai/${category.key}`} category={category} />
                })}
            </div>
        </aside>
	}
}