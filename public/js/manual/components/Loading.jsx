import { h, render, Component } from 'preact';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	render({colorName = 'black'}, state) {
		return <div className="loading-speakers-box">
        <svg width="150px" id="frame" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80.65">
        <defs>
        <style>
        stroke-miterlimit:10;stroke-width:1.3px;}
        </style>
        </defs>
        <title>subwoofers</title>
        <g id="speaker">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M0,9.68V90.32H53V9.68ZM51.37,88.56H1.66V11.44H51.37Z" transform="translate(0 -9.68)"/>
        <g id="mids">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M26.52,43.59A20.26,20.26,0,1,0,46.78,63.85,20.26,20.26,0,0,0,26.52,43.59Zm0,39A18.73,18.73,0,1,1,45.25,63.85,18.73,18.73,0,0,1,26.52,82.58Z" transform="translate(0 -9.68)"/></g>
        <g id="mids-inner">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M26.52,46.84a17,17,0,1,0,17,17A17,17,0,0,0,26.52,46.84Zm0,32.73A15.72,15.72,0,1,1,42.24,63.85,15.72,15.72,0,0,1,26.52,79.57Z" transform="translate(0 -9.68)"/></g>
        <circle id="highs" className="speakers-cls-2" style={`fill: ${colorName}; stroke: ${colorName}`} cx="26.52" cy="15.73" r="6.72"/></g>
        <g id="speaker-2" data-name="speaker">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M73.48,9.68V90.32h53V9.68Zm51.37,78.88H75.14V11.44h49.71Z" transform="translate(0 -9.68)"/>
        <g id="mids-2" data-name="mids">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M100,43.59a20.26,20.26,0,1,0,20.26,20.26A20.26,20.26,0,0,0,100,43.59Zm0,39a18.73,18.73,0,1,1,18.73-18.73A18.73,18.73,0,0,1,100,82.58Z" transform="translate(0 -9.68)"/></g>
        <g id="mids-inner-2" data-name="mids-inner">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M100,46.84a17,17,0,1,0,17,17A17,17,0,0,0,100,46.84Zm0,32.73a15.72,15.72,0,1,1,15.72-15.72A15.72,15.72,0,0,1,100,79.57Z" transform="translate(0 -9.68)"/></g>
        <circle id="highs-2" data-name="highs" className="speakers-cls-2" style={`fill: ${colorName}; stroke: ${colorName}`} cx="100" cy="15.73" r="6.72"/></g>
        <g id="speaker-3" data-name="speaker">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M147,9.68V90.32h53V9.68Zm51.37,78.88H148.63V11.44h49.71Z" transform="translate(0 -9.68)"/>
        <g id="mids-3" data-name="mids">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M173.48,43.59a20.26,20.26,0,1,0,20.26,20.26A20.26,20.26,0,0,0,173.48,43.59Zm0,39a18.73,18.73,0,1,1,18.73-18.73A18.73,18.73,0,0,1,173.48,82.58Z" transform="translate(0 -9.68)"/></g>
        <g id="mids-inner-3" data-name="mids-inner">
        <path className="speakers-cls-1" style={`fill: ${colorName}`} d="M173.48,46.84a17,17,0,1,0,17,17A17,17,0,0,0,173.48,46.84Zm0,32.73a15.72,15.72,0,1,1,15.72-15.72A15.72,15.72,0,0,1,173.48,79.57Z" transform="translate(0 -9.68)"/></g>
        <circle id="highs-3" data-name="highs" className="speakers-cls-2" style={`fill: ${colorName}; stroke: ${colorName}`} cx="173.48" cy="15.73" r="6.72"/></g></svg>
    </div>
	}
}
            
