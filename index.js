import { backgroundStars } from './modules/stars.js';

backgroundStars()

window.addEventListener('resize', () => {
    backgroundStars()
    document.querySelector('#menu').style.height = window.innerHeight + 'px';
})

window.addEventListener('load', () => {
    document.querySelector('#menu').style.height = window.innerHeight + 'px';
})