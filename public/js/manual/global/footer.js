// const form = document.querySelector('.newsletter');
// console.log(form);
import MicroModal from 'micromodal';  // es6 module

if (document.querySelector('.modal')) {
    MicroModal.init();
    MicroModal.show('modal-1');
}

// form.addEventListener('submit', function(event){ event.preventDefault()});