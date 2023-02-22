console.log("Game");

var canvas; 
var ctx;
var w = window.innerWidth;
var h = window.innerHeight;
var allStars = [];
var time = localStorage.getItem("score")


highScore();
setUpCanvas();
createStars(100);
animationLoop();

function highScore(){
var playerName = prompt("Player Name");
 if (playerName != null) {
    document.querySelector("#score").innerHTML = "1. " +
    playerName + " got to Uranus in " + time + " seconds!" ;}
};

function animationLoop(){
	clear()
	for(var i=0; i<allStars.length; i++){
		stars(allStars[i]);
		updateStars(allStars[i]);
	};

requestAnimationFrame(animationLoop);
}


function createStars(n){
	for(var i=0; i <n; i++){
		allStars.push({"x": randi(0,w),
			"y": randi(0,h),
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


function setUpCanvas () {

canvas = document.querySelector("#starBackground");
ctx = canvas.getContext("2d");
canvas.style.border = "none";
canvas.width = w;
canvas.height = h;
}