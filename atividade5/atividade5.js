let showItem = function (event) {
    let p = event.target.nextElementSibling;
    let others = document.getElementsByClassName('button');
    if (p.className === 'show-content') {
        p.removeAttribute('class');
    }
    else {
        p.setAttribute('class', 'show-content');
    }
    for (let o of others) {
        let p1 = o.nextElementSibling;
        if (p1 !== p && p1.className === 'show-content') {
            p1.removeAttribute('class');
        }
    }
}

let showMenu = function (event) {
    let menu = document.getElementById('menuid');
    if(menu.className === 'show-menu') {
        menu.setAttribute('class', 'menu');
    }
    else {
        menu.setAttribute('class', 'show-menu');
    }
}

window.addEventListener('load', function (event) {
    let items = document.getElementsByClassName('button');
    for (let item of items) {
        item.addEventListener('click', showItem);
    }
    let button = document.getElementById('sand-button');
    button.addEventListener('click', showMenu);
});