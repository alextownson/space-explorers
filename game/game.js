// GLOBAL VARIABLES 

let canvas;
let context;
let width = 1000;
let height = 500;
const allStars = [];
const uranus = {
	"x": width / 10,
	"y": height - height / 6,
	"radius": 25,
	"colour": 180,
	"pulse": 0.01,
	"alpha": 0.7,
};
let playerSize = 30;
let playerMove = 5;
let playerTurn = 360;
let friction = 0.7;
const player = {
	"x" : width / 2,
	"y" : height / 2,
	"radius" : playerSize / 2,
	"angle" : 90/180 * Math.PI,
	"rotation": 0, 
	"moving": false, 
	"move": {
	 	"x": 0, 
	 	"y": 0
	}
};
let lives = 3;
const gameOverButton = document.querySelector("#gameOver-button")
let startTime = (new Date).getTime();

// RANDOM NUMBER GENERATOR FUNCTIONS

function randn (n) {
	let r = Math.random() * n - (n / 2);
	return r 
}

function rand (n) {
	let r = Math.random() * n;
	return r
}

function randi (min, max) {
	let r = Math.random() * (max - min) + min;
	return r
}

// DRAW CANVAS

function setUpCanvas () {
	canvas = document.querySelector("#myCanvas");
	context = canvas.getContext("2d");
	canvas.style.border = "1px solid gold";
	canvas.width = width;
	canvas.height = height;
}

// CREATE STARS ARRAY

function createStars (n) {
	for(let i = 0; i < n; i++){
		allStars.push({
			"x": randi(0,1000),
			"y": randi(0,600),
			"radius": 1,
			"colour": 60,
			"pulse": 0.01,
			"alpha": randi(0.1, 1),
			"angle": randi(0, 360),
			"changeAngle": 0.5, 
			"randomAngle": function() {return randn(20)},
			"degree": 0.2
		})
	}
}

// DRAW STARS AND PLANET

function drawCelestialObjects (celestialObjects) { 
	context.beginPath();
	context.arc(celestialObjects.x, celestialObjects.y, celestialObjects.radius, 0, 2 * Math.PI);
	context.fillStyle = "hsla("+celestialObjects.colour+", 100%, 50%, "+celestialObjects.alpha+")";
	context.fill();
}

// DRAW MAZE

// Drawing a spiral: 
// https://stackoverflow.com/questions/6824391/drawing-a-spiral-on-an-html-canvas-using-javascript

function drawMaze () {
	context.moveTo(width / 2, height / 2);
    context.beginPath();
    for (i = 0; i < 200; i++) {
        angle = 0.1 * i;
        x = width / 2 + (20 + 20 * angle) * Math.cos(angle);
        y = height / 2 + (10 + 10 * angle) * Math.sin(angle);
        context.lineTo(x, y);
		mazeCollision(this);
    }
    context.strokeStyle = "white";
    context.stroke();
};

// DRAW PLAYER

// Math for drawing and rotation movement of player:
// https://www.youtube.com/watch?v=e1vKcPZT8Lc&t=1348s

function drawPlayer () {
	context.strokeStyle = "pink";
	context.lineWidth = playerSize/20;
	context.beginPath();
	// NOSE
	context.moveTo(
		player.x + player.radius * Math.cos(player.angle),
		player.y - player.radius * Math.sin(player.angle)
	);
	// LEFT
	context.lineTo ( 
		player.x - player.radius * (Math.cos(player.angle) + Math.sin(player.angle)),
		player.y + player.radius * (Math.sin(player.angle) - Math.cos(player.angle))
	);
	// RIGHT
	context.lineTo ( 
		player.x - player.radius * (Math.cos(player.angle) - Math.sin(player.angle)),
		player.y + player.radius * (Math.sin(player.angle) + Math.cos(player.angle))
	);
	context.closePath();
	context.stroke();
	// CHECK FOR MOVEMENT
	if (player.moving) {
		player.move.x += playerMove * Math.cos (player.angle) / 30;
		player.move.y -= playerMove * Math.sin (player.angle) / 30;
	} else {
	player.move.x -= friction * player.move.x / 30;
	player.move.y -= friction * player.move.y / 30;
	}
	// ROTATION
	player.angle += player.rotation;
	// MOVE
	player.x += player.move.x;
	player.y += player.move.y;
	// SCREEN EDGES
 	if (player.x < 0 - player.radius) {
		player.x = width + player.radius;
	} else if (player.x > width + player.radius) {
		player.x = 0 - player.radius;
	}
	if (player.y < 0 - player.radius) {
		player.y = height + player.radius;
	} else if (player.y > height + player.radius) {
		player.y = 0 - player.radius;
	}
};

// DRAW LIVES

// Text on canvas:
// https://www.w3schools.com/graphics/canvas_text.asp

function life () {
	context.font = "18px helvetica";
	context.fillText("Lives: " + lives, width - 75, 20);
};

// UPDATE PLANET

function updatePlanet () {
	uranus.a += uranus.ax;
	if (uranus.a > 1) {
		uranus.ax = -0.01
	}
	if (uranus.a < 0.7) {
		uranus.ax = 0.01
	}
}

// UPDATE STARS

function updateStars (star) {
	let oneDegree = 2 * Math.PI / 360;
	let cosX = star.degree * Math.cos(star.angle * oneDegree);
	let sinY = star.degree * Math.sin(star.angle * oneDegree);
	star.x += cosX;
	star.y += sinY;
	star.angle += star.changeAngle;
	star.alpha += star.pulse;
	if (star.alpha > 1) {
		star.pulse = -0.01
	}
	if (star.alpha < 0) {
		star.pulse = 0.01
	}
}

// MAZE COLLISION

function mazeCollision () {
	if (
		x < player.x + player.radius &&
		x > player.x - player.radius &&
		y < player.y + player.radius &&
		y > player.y - player.radius
		) {
		player.x = width / 2;
		player.y = height / 2;
		player.move.x = 0;
		player.move.y = 0;
		player.rotation = 0;
		player.angle = 90/180 * Math.PI;
		lives--;
	}
	if (lives === 0) {
		gameOver();
	}
};

// PLANET COLLISION

function planetCollision () {
	if ( 
		uranus.x - uranus.radius < player.x + player.radius && 
		uranus.x + uranus.radius > player.x - player.radius && 
		uranus.y - uranus.radius < player.y + player.radius && 
		uranus.y + uranus.radius > player.y - player.radius
	) {
		let score = time();
		// Accessing a variable in a different js file: 
		// https://stackoverflow.com/questions/27355397/how-to-get-variable-value-from-another-js-file
		localStorage.setItem("score", score)
        window.location.href="../score/score.html";
	}
};

// KEYUP

function keyUp (event) {
	if(event.keyCode == 38){
	player.moving = false;
	};
	if(event.keyCode == 37){
		player.rotation = 0;
	};
	if(event.keyCode == 39){
		player.rotation = 0;
	};
};

// KEYDOWN

function keyDown (event) {
	if(event.keyCode == 38){
	player.moving = true;
	};
	if(event.keyCode == 37){
		player.rotation = playerTurn / 180 * Math.PI / 45;
	};
	if(event.keyCode == 39){
		player.rotation = -playerTurn / 180 * Math.PI / 45;
	};
};

// CLEAR CANVAS

function clear () {
	context.clearRect(0, 0, width, height);
}

// TIME

// Timer:
// https://websanova.com/blog/javascript/how-to-write-an-accurate-game-timer-in-javascript

function time () {
	let endTime = (new Date).getTime();
	let finalTime = (endTime - startTime) / 1000;
	return Math.trunc(finalTime);
};

// GAME OVER

function gameOver () {
	canvas.style.display = "none"
	gameOverButton.style.display = "block";
}

// REPLAY GAME

// Reloading a page: 
// https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript

function restart () {
	window.location.reload();
}

// ANIMATE CANVAS

function animationLoop () {
	clear()
	for (let i = 0; i < allStars.length; i++) {
		drawCelestialObjects(allStars[i]);
		updateStars(allStars[i]);
	};
	drawCelestialObjects(uranus);
	updatePlanet();
	planetCollision();
	drawMaze();
	drawPlayer();
	life();
	requestAnimationFrame(animationLoop);
}

// FUNCTION CALLS

setUpCanvas();
createStars(100);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
animationLoop();