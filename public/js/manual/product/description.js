const [normalDescBtn, techDescBtn] = [document.querySelector('.normal'), document.querySelector('.technical')];
const [normalDesc, techDesc] = [document.querySelector('.description-normal'), document.querySelector('.description-technical')];

normalDescBtn.addEventListener('click', function(e){
    e.target.classList.add('active');
    techDescBtn.classList.remove('active');
    techDesc.classList.add('hidden');
    normalDesc.classList.remove('hidden');

    normalDesc.classList.add('fade-in');
    setTimeout(() => normalDesc.classList.remove("fade-in"), 500);
});

techDescBtn.addEventListener('click', function(e){
    e.target.classList.add('active');
    normalDescBtn.classList.remove('active');
    normalDesc.classList.add('hidden');
    techDesc.classList.remove('hidden');

    techDesc.classList.add('fade-in');
    setTimeout(() => techDesc.classList.remove("fade-in"), 500);
});