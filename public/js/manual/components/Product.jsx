import { h, render, Component } from 'preact';

export default class Product extends Component {
    constructor(props) {
        super(props);
        // set initial time:
    }
    componentDidMount() {
        const play = box => {
        	while (!box.classList.contains('items-box__item')) box = box.parentElement;
        	let img = box.querySelector('.show');
        	img.classList.remove('show');
        	(img.nextElementSibling.className != 'items-box__item--description' ? img.nextElementSibling : box.firstElementChild).classList.add('show');
        };

        const stop = ({target: box, relatedTarget: rt}) => {
        	while (!box.classList.contains('items-box__item')) box = box.parentElement;
        	while (rt != box && rt) rt = rt.parentElement;
        	if (rt === box) return;
        	box.querySelector('.show').classList.remove('show');
        	box.firstElementChild.classList.add('show');
        	box.play = clearInterval(box.play);
        };

        function mouseEvents(box) {
        	if (box.children[0].classList != 'no-image-err') {
        		box.addEventListener('mouseenter', function() {
        			if (box.play) return;
        			play(box);
        			box.play = setInterval(() => play(box), 1000);
        		});
        		box.addEventListener('mouseleave', stop);
        	} else {
        		return;
        	}
        }

        mouseEvents(this.productNode);
    }

    render({ data }, state) {
        return <a 
        ref={productNode => this.productNode = productNode}
        className="items-box__item content-center fade-in"
        aria-label={data.title}
        title={data.title}
        href={`/produktai/${data.Manufacturer ? data.Manufacturer.key : null}/${data.ProductType ? data.ProductType.key : null}/${data.slug}`}
    >
        {data.images[0] ?
            data.images.map((image, idx) => {
                return idx == 0 ?
                <img className="items-box__item--main-image show" alt={data.title} src={image.secure_url}></img>
                :
                <img className="items-box__item--main-image" alt={data.title} src={image.secure_url}></img>
            })
            :
            <div className="no-image-err">
                <p>Atsiprašome, šis produktas neturi nuotraukos</p>
            </div>
        }
        <p className="items-box__item--description">
            <span className="items-box__item--description-title">{data.Manufacturer ? data.Manufacturer.name.toUpperCase() : null} - {data.title.toUpperCase()}</span>
            <br />
            { data.ProductType ?
                data.ProductType.nameSingular ?
                    <span className="items-box__item--description-type">{data.ProductType.nameSingular.toLowerCase()}</span>
                    :
                    <span className="items-box__item--description-type">{data.ProductType.name.toLowerCase()}</span>
                :
                null
            }
                <br />
                {data.Discount ?
                    <span className="items-box__item--description-price"><b className="price-discount">{data.Discount}€</b> &nbsp;<strike>{data.price}€</strike></span>
                    :
                    <span className="items-box__item--description-price">{data.price}€</span>
                }
            </p>
        </a>;
    }
}
            
