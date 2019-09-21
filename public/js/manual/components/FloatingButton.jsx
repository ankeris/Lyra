import { h, render, Component } from 'preact';
import DropdownSVG from './DropdownSVG';

export default class extends Component {
	constructor(props) {
        super(props);
	}
    
	render({text, clicked, extraclass}, state) {
        return <figure onClick={clicked} className={`button button--floating ${extraclass} content-center content-row`}>
        <span>{text.toUpperCase()}</span>
        <div><DropdownSVG clicked={() => {}} extraclass="bounce push-horizontal--small" color="black"/></div>
        </figure>
	}
}
