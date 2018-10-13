const Instafeed = require('instafeed.js');
let $ = require('jquery');
let slick = require('slick-carousel');

const userFeed = new Instafeed({
    get: 'user',
    userId: '7012478136',
    limit: 10,
    resolution: 'standard_resolution',
    accessToken: '7012478136.1677ed0.5376c43243c642f2af5fe2b9d6712770',
    sortBy: 'most-recent',
    template: `
    <div class="items-box__instagram-item">
        <a href="{{link}}" rel="noreferrer" target="_blank" aria-label="{{likes}} likes">
            <div class="items-box__item--main-image" style="background-image: url('{{image}}')">
                <div class="items-box__item--text">{{caption}}</div>
            </div>
        </a>
    </div>`
})

userFeed.run();

$(document).ready(checkContainer);

function checkContainer () {
    if($('.items-box__instagram-item').is(':visible')) {
        $('#instafeed').slick({
            infinite: true,
            autoplay: false,
            slidesToShow: 6,
            speed: 200,
            slidesToScroll: 2,
            lazyLoad: 'ondemand',
            prevArrow: '<button type="button" class="slick-prev" aria-label="slide previous"></button>',
            nextArrow: '<button type="button" class="slick-next" aria-label="slide next"></button>',
            responsive: [
                {
                    breakpoint: 2000,
                    settings: {
                      slidesToShow: 6,
                      slidesToScroll: 1,
                      infinite: true,
                    }
                },
                {
                    breakpoint: 1400,
                    settings: {
                      slidesToShow: 5,
                      slidesToScroll: 1,
                      infinite: true,
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                      slidesToShow: 4,
                      slidesToScroll: 1,
                      infinite: true,
                    }
                },
                {
                  breakpoint: 940,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                  }
                },
                {
                    breakpoint: 700,
                    settings: {
                      slidesToShow: 2,
                      slidesToScroll: 1,
                      infinite: true,
                    }
                }
            ]
        });

        $(".items-box__item--text").each(
            (index, value) => {
                let array = value.innerText.split(" ");
                value.innerText = array.filter(word => !word.startsWith('#')).join(' ');
            }
        );
    } else {
      setTimeout(checkContainer, 50); //wait 50 ms, then try again
    }
  }




// {{type}} - the image's type, can be image or video.
// {{width}} - the image's width, in pixels.
// {{height}} - the image's height, in pixels.
// {{orientation}} - the image's orientation, can be square, portrait, or landscape.
// {{link}} - URL to view the image on Instagram's website.
// {{image}} - URL of the image source. The size is inherited from the resolution option.
// {{caption}} - Image's caption text. Defaults to empty string if there isn't one.
// {{likes}} - Number of likes the image has.
// {{comments}} - Number of comments the image has.
// {{location}} - Name of the location associated with the image. Defaults to empty string.
// {{id}} - Unique ID of the image. Useful if you want to use iPhone hooks to open the images directly in the Instagram app.
// {{model}} - Full JSON object of the image. If you want to get a property of the image that isn't listed above you access it using dot-notation. (ex: {{model.filter}} would get the filter used)
