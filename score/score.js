import { setUpCanvas, createStars, animationLoop } from "../modules/stars.js";

setUpCanvas();
createStars(100);
animationLoop();

let time = localStorage.getItem("score")

highScore();

function highScore(){
let playerName = prompt("Player Name");
 if (playerName != null) {
    document.querySelector("#score").innerHTML = "1. " +
    playerName + " got to Uranus in " + time + " seconds!" ;}
};