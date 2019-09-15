import { h, render, Component } from 'preact';
import DropdownSVG from './DropdownSVG';

export default class extends Component {
	constructor(props) {
        super(props);
	}
    
	render({text, clicked}, state) {
        return <figure onClick={clicked} class="button button--dark button--floating content-center content-row">
        <span>{text.toUpperCase()}</span>
        <div><DropdownSVG clicked={() => {}} extraclass="bounce dropdownSVG push-horizontal--small" color="white"/></div>
        </figure>
	}
}
