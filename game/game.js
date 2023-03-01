let permissionGranted = false;

window.addEventListener('load', () => {

	if(window.innerWidth < 1050) {
		makeGame(window.innerWidth, window.innerHeight, 10, 16, 40, 140)
	} else if (window.innerWidth > 1050){
		makeGame(1000, 500, 20, 10, 30, 200)
	}

	if(typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function'){		
		DeviceOrientationEvent.requestPermission()
			.catch(() => {
				// show permission dialogue only on first visit
				let button = document.createElement('button');
				button.style.height = innerHeight + 100 + 'px';
				button.classList.add('button');
				button.innerText = 'ALLOW ACCESS TO SENSORS'
				button.addEventListener('click', requestAccess);
				document.body.appendChild(button);
				throw error;
			})
			.then(() => {
				// subsequent visits
				permissionGranted = true;
			})
	}

	function requestAccess(){
		DeviceOrientationEvent.requestPermission()
		.then(response => {
			if(response == 'granted') {
				permissionGranted = true;
			} else {
				permissionGranted = false;
			}
		})
		.catch(console.error);
	
		this.remove();
	}
})

window.addEventListener('resize', () => {
	if(window.innerWidth < 1050) {
		makeGame(window.innerWidth, window.innerHeight, 10, 16, 40, 150)
	} else if (window.innerWidth > 1050){
		makeGame(1000, 500, 20, 10, 30, 200)
	}
})

function makeGame(width, height, wormholeX, wormholeY, wormholeW, wormholeSpirals) {
	// VARIABLES 

	let canvas;
	let context;
	const allStars = [];
	const uranus = {
		x: width / 10,
		y: height - 60,
		radius: 25,
		colour: 180,
		pulse: 0.01,
		alpha: 0.7,
	};
	let playerSize = 30;
	let playerMove = 5;
	let playerTurn = 360;
	let friction = 0.7;
	const player = {
		x: width / 2,
		y: height / 2,
		radius: playerSize / 2,
		angle: 90/180 * Math.PI,
		rotation: 0, 
		moving: false, 
		move: {
			x: 0, 
			y: 0
		}
	};
	let lives = 3;
	const restartButton = document.querySelector('#restart-button')
	let startTime = (new Date).getTime();

	// RANDOM NUMBER GENERATOR FUNCTIONS

	function randn (n) {
		let r = Math.random() * n - (n / 2);
		return r 
	}

	function randi (min, max) {
		let r = Math.random() * (max - min) + min;
		return r
	}

	// DRAW CANVAS

	function setUpCanvas () {
		canvas = document.querySelector('#myCanvas');
		context = canvas.getContext('2d');
		canvas.style.border = '1px solid gold';
		canvas.width = width;
		canvas.height = height;
	}

	// CREATE STARS ARRAY

	function createStars (n) {
		for(let i = 0; i < n; i++){
			allStars.push({
				x: randi(0, width),
				y: randi(0, height),
				radius: 1,
				colour: 60,
				pulse: 0.01,
				alpha: randi(0.1, 1),
				angle: randi(0, 360),
				changeAngle: 0.5, 
				randomAngle: function() {return randn(20)},
				degree: 0.2
			})
		}
	}

	// DRAW STARS AND PLANET

	function drawCelestialObjects (celestialObjects) { 
		context.beginPath();
		context.arc(celestialObjects.x, celestialObjects.y, celestialObjects.radius, 0, 2 * Math.PI);
		context.fillStyle = 'hsla('+celestialObjects.colour+', 100%, 50%, '+celestialObjects.alpha+')';
		context.fill();
	}

	// DRAW WORMHOLE

	// Drawing a spiral: 
	// https://stackoverflow.com/questions/6824391/drawing-a-spiral-on-an-html-canvas-using-javascript

	function drawWormhole () {
		context.moveTo(width / 2, height / 2);
		context.beginPath();
		for (i = 0; i < wormholeSpirals; i++) {
			angle = 0.1 * i;
			x = width / 2 + (wormholeW + wormholeX * angle) * Math.cos(angle);
			y = height / 2 + (wormholeW + wormholeY * angle) * Math.sin(angle);
			context.lineTo(x, y);
			wormholeCollision(this);
		}
		context.strokeStyle = 'white';
		context.stroke();
	};

	// DRAW PLAYER

	// Math for drawing and rotation movement of player:
	// https://www.youtube.com/watch?v=e1vKcPZT8Lc&t=1348s

	function drawPlayer () {
		context.strokeStyle = 'pink';
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
		context.font = '1.25em helvetica';
		context.fillText('Lives: ' + lives, width - 75, 20);
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

	// WORMHOLE COLLISION

	function wormholeCollision () {
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
			localStorage.setItem('score', score)
			window.location.href='../score/score.html';
		}
	};

	// KEY EVENTS

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

	// TOUCH EVENTS 

	function touchStart (event){
		event.preventDefault();
		player.moving = true;
	};

	function touchEnd (event){
		event.preventDefault();
		player.moving = false;
	};

	// MOTION EVENTS 

	function mobileTurn () {
		let x = Math.trunc(event.accelerationIncludingGravity.x);
		player.rotation = -x/150;
	 };

	// CLEAR CANVAS

	function clear () {
		context.clearRect(0, 0, width, height);
	};

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
		canvas.style.display = 'none'
		restartButton.style.display = 'block';
	};

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
		drawWormhole();
		drawPlayer();
		life();
		requestAnimationFrame(animationLoop);
	};

	// FUNCTION CALLS

	setUpCanvas();
	createStars(100);
	document.addEventListener('keydown', keyDown);
	document.addEventListener('keyup', keyUp);
	canvas.addEventListener('touchstart', touchStart);
	canvas.addEventListener('touchend', touchEnd);
	window.addEventListener('devicemotion', mobileTurn)
	animationLoop();
}

// REPLAY GAME

// Reloading a page: 
// https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript

function restart () {
	window.location.reload();
}
