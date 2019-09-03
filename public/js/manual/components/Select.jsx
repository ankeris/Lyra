import { h, render, Component } from 'preact';

export default class extends Component {
	constructor(props) {
		super(props);
	}

	render({onChange}, state) {
		return <figure class="sort-bar__box push-bottom content-section">
            <div className="form_box">
                <select 
                onChange={e => onChange(e.target.value)}
                name="filterlist" 
                class="sort-bar__box--button">
                    <option selected disabled>Rūšiuoti pagal</option>
                    <option value="price-high">Kaina: aukščiausia</option>
                    <option value="price-low">Kaina: žemiausia</option>
                    <option value="manufacturer">Gamintojas</option>
                </select>
            </div>
        </figure>
	}
}