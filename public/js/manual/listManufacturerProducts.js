let som = document.querySelectorAll('.items-box__item');

for (let i = 0; i <= som.length - 1; i++) {
    console.log(som[i].getAttribute("class").split(' ')[1]);
}

console.log(som);