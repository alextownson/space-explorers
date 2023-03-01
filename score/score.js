import { backgroundStars } from '../modules/stars.js';

document.querySelector('main').style.height = window.innerHeight + 'px';
backgroundStars()

window.addEventListener('resize', () => {
    backgroundStars()
    document.querySelector('main').style.height = window.innerHeight + 'px';
})

let time = localStorage.getItem('score')
let score = document.querySelector('#score')




highScore();

function highScore(){
let playerName = prompt('Player name:');
 if (playerName !== null && /^[A-Za-z\s]*$/.test(playerName) && playerName.length < 10 && time !== null) {
    score.innerHTML = playerName + ' got to Uranus in ' + time + ' seconds!';
    score.style.display = 'block';
} else if (time === null) {
    score.innerHTML = 'Wow! You\'ve mastered the art of teleportation.';
    score.style.display = 'block';
} else {
    score.innerHTML = 'You got to Uranus in ' + time + ' seconds!';
    score.style.display = 'block';
}
};