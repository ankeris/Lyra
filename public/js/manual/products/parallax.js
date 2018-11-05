let $ = require('jquery');
import jQuery from 'jquery';

(function($) {
    let $window = $(window);
    $('*[data-type="parallax"]').each(function(){
        let $bgobj = $(this);

        $(window).scroll(function() {
            let yPos = 50-($window.scrollTop() / $bgobj.data('speed'));
            let coords = '50% '+ yPos + '%';
            $bgobj.css({ backgroundPosition: coords });
        });
    });
})(jQuery);