let imageInt = -1;
let stopinterval;

let imagesToHover = document.querySelectorAll('.items-box__item');

imagesToHover.forEach((el) => {
    el.addEventListener('mouseenter', function(e) {
        startAnim(el);
    });

    el.addEventListener('mouseleave', function() {
        stopanim();
    })
})

function startAnim(el) {
  imageInt = 1;
  el.children[0].children[0].children[0].classList.add('hidden');
  el.children[0].children[0].children[1].classList.remove('hidden');

  if (stopinterval === undefined) {

    stopinterval = setInterval(function(){
        imageInt += 1;
        if (imageInt === el.children[0].children[0].children.length) {
          imageInt = 0;
        }
        for (let i = 0; i < el.children[0].children[0].children.length; i++) {
          // Adds "hidden" class to ALL of the images for a product
          el.children[0].children[0].children[i].classList.add('hidden');
        }
        // Removes "hidden" class for one
        el.children[0].children[0].children[imageInt].classList.remove('hidden');
    }, 1200);
  }
}

function stopanim() {
  let imageInt = -1;
  if (stopinterval) { 
    clearInterval(stopinterval);
    stopinterval = undefined;
  }
}