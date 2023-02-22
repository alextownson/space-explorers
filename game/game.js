// SOURCES: 
// Math for drawing and rotation movement of player:
// https://www.youtube.com/watch?v=e1vKcPZT8Lc&t=1348s
// Drawing a spiral: 
// https://stackoverflow.com/questions/6824391/drawing-a-spiral-on-an-html-canvas-using-javascript
// Reloading a page: 
// https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
// Text on canvas:
// https://www.w3schools.com/graphics/canvas_text.asp
// Timer:
// https://websanova.com/blog/javascript/how-to-write-an-accurate-game-timer-in-javascript
// Accessing a variable in a different js file: 
// https://stackoverflow.com/questions/27355397/how-to-get-variable-value-from-another-js-file

console.log("Game");

var canvas;
var ctx;
var w = 1000;
var h = 500;
var allStars = [];
var uranus = [];
var playerSize = 30;
var playerMove = 5;
var playerTurn = 360;
var friction = 0.7;
var player = {
	 "x" : w/2,
	 "y" : h/2,
	 "r" : playerSize/2,
	 "pangle" : 90/180 * Math.PI,
	 "rot": 0, 
	 "moving": false, 
	 "move": {
	 	"x": 0, 
	 	"y": 0
		}
	};
var lives = 3;
var gameOverjpg = document.querySelector("#gameOver-button")

var st = (new Date).getTime();

setUpCanvas();
createStars(100);
createUranus(1);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
animationLoop();








function animationLoop(){

	clear()
	for(var i=0; i<allStars.length; i++){
		stars(allStars[i]);
		updateStars(allStars[i]);
	};
for(var j=0; j<uranus.length; j++){
		stars(uranus[j]);
		updateUranus(uranus[j]);
		uranusCollision(player, uranus[0]);

	};


drawMaze();
drawPlayer();
livesFun();

requestAnimationFrame(animationLoop);
}



function restart(){
	window.location.reload();
}

function uranusCollision(p, u){
	if(u.x - u.r < p.x + p.r && u.x + u.r > p.x - p.r 
		&& u.y - u.r < p.y + p.r && u.y + u.r > p.y - p.r){
		var score = endTime();
		localStorage.setItem("score", score)
        window.location.href="../score/score.html";
}
};

function endTime () {
	var et = (new Date).getTime();
	time = (et-st)/1000;
	return Math.trunc(time);
};

function createUranus(n){
	for(var i=0; i <n; i++){
		uranus.push({
		"x": w/10,
		"y": h-h/6,
		"r": 25,
		"c": 180,
		"ax": 0.01,
		"a": 0.7,
		})
	}
}

function createStars(n){
	for(var i=0; i <n; i++){
		allStars.push({"x": randi(0,1000),
			"y": randi(0,600),
			"r": 1,
			"c": 60,
			"ax":0.01,
			"a": randi(0.1, 1),
			"angle": randi(0,360),
			"changle": 0.5, 
			"randangle": function() {return randn(20)},
			"d": 0.2
		})
	}
}

function updateUranus (o){
	o.a += o.ax;
	if(o.a > 1){o.ax = -0.01}
	if(o.a < 0.7){o.ax = 0.01}
}

function updateStars (o){
	
	var cx;
	var sy;
	var onedegree = 2*Math.PI/360;
	cx = o.d*Math.cos(o.angle*onedegree);
	sy = o.d*Math.sin(o.angle*onedegree);
	o.x += cx;
	o.y += sy;

	o.angle+=o.changle;
	
	o.a += o.ax;
	if(o.a > 1){o.ax = -0.01}
	if(o.a < 0){o.ax = 0.01}

}


function clear(){
	ctx.clearRect(0,0,w,h);

}

function keyUp(event){
	if(event.keyCode == 38){
	player.moving = false;
	};
	if(event.keyCode == 37){
		player.rot = 0;
	};
	if(event.keyCode == 39){
		player.rot = 0;
	};
};

function keyDown(event){
	if(event.keyCode == 38){
	player.moving = true;
	};
	if(event.keyCode == 37){
		player.rot = playerTurn / 180 * Math.PI/45;
	};
	if(event.keyCode == 39){
		player.rot = -playerTurn / 180 * Math.PI/45;
	};
};




function drawMaze(){
	ctx.moveTo(w/2, h/2);
    ctx.beginPath();
    for (i = 0; i < 200; i++) {
        sangle = 0.1 * i;
        x = w/2 + (20 + 20 * sangle) * Math.cos(sangle);
        y = h/2 + (10 + 10 * sangle) * Math.sin(sangle);
        ctx.lineTo(x, y);
	mazeCollision(this, player);
    }
    ctx.strokeStyle = "white";
    ctx.stroke();
};

function mazeCollision(m, p){
	if(x < p.x + p.r && x > p.x -p.r 
		&& y < p.y + p.r && y > p.y - p.r){
		player.x = w/2;
		player.y = h/2;
		player.move.x = 0;
		player.move.y = 0;
		player.rot = 0;
		player.pangle = 90/180 * Math.PI;
		lives--;
	}
			if(lives === 0){
				gameOver();
			}

};

function gameOver(){
canvas.style.display="none"
gameOverjpg.style.display = "block";
}

function livesFun(){
	ctx.font = "18px helvetica";
	ctx.fillText("Lives: " + lives, w - 75, 20);
};

function drawPlayer(){
ctx.strokeStyle = "pink";
ctx.lineWidth = playerSize/20;
ctx.beginPath();
ctx.moveTo( //nose of the triangle
	player.x + player.r * Math.cos(player.pangle),
	player.y - player.r * Math.sin(player.pangle)
	);
ctx.lineTo ( //rear left
	player.x - player.r * (Math.cos(player.pangle) + Math.sin(player.pangle)),
	player.y + player.r * (Math.sin(player.pangle) - Math.cos(player.pangle))
	);
ctx.lineTo ( //rear right
	player.x - player.r * (Math.cos(player.pangle) - Math.sin(player.pangle)),
	player.y + player.r * (Math.sin(player.pangle) + Math.cos(player.pangle))
	);
ctx.closePath();
ctx.stroke();


if(player.moving){
	player.move.x += playerMove * Math.cos (player.pangle) / 30;
	player.move.y -= playerMove * Math.sin (player.pangle) / 30;
} else {
	player.move.x -= friction * player.move.x / 30;
	player.move.y -= friction * player.move.y / 30;

}

	//rotation
player.pangle += player.rot;
	//move
player.x += player.move.x;
player.y += player.move.y;

//screen edges
 if (player.x < 0 - player.r) {
		player.x = w + player.r;
} else if (player.x > w + player.r) {
	player.x = 0 - player.r;
}
if (player.y < 0 - player.r) {
		player.y = h + player.r;
} else if (player.y > h + player.r) {
	player.y = 0 - player.r;
}

};

function stars (o){ 
	ctx.beginPath();
	ctx.arc(o.x, o.y, o.r, 0, 2*Math.PI);
	ctx.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
	ctx.fill();
}

function randn(n){
	var r = Math.random()*n-(n/2);
	return r 

}

function rand (n){
	var r = Math.random()*n;
	return r
}

function randi (min, max){
	var r = Math.random() * (max - min) + min;
	return r
}


function setUpCanvas(){
	canvas = document.querySelector("#myCanvas");
	ctx = canvas.getContext("2d");
	canvas.style.border = "1px solid gold";
	canvas.width = w;
	canvas.height = h;
}
