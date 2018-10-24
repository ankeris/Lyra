let i;

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
  if (stopinterval === undefined) { 
    stopinterval = setInterval(function(){ console.log(el.children[0].children) }, 1000);
  }
}

function stopanim() {
  if (stopinterval) { 
    clearInterval(stopinterval);
    stopinterval = undefined;
  }
}