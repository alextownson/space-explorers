import { setUpCanvas, createStars, animationLoop } from "../modules/stars.js";

setUpCanvas();
createStars(100);
animationLoop();

let time = localStorage.getItem("score")
let score = document.querySelector("#score")

highScore();

function highScore(){
let playerName = prompt("Player Name:");
 if (playerName != null && /^[A-Za-z\s]*$/.test(playerName) && playerName.length < 10) {
    score.innerHTML = playerName + " got to Uranus in " + time + " seconds!";
    score.style.display = "block";
} else {
    score.innerHTML = "You got to Uranus in " + time + " seconds!";
    score.style.display = "block";
}
};