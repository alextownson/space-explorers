function backgroundStars () {
	let context;
	const width = window.innerWidth;
	const height = window.innerHeight;
	const allStars = [];

	function animationLoop(){
		clear()
		for(let i = 0; i < allStars.length; i++){
			stars(allStars[i]);
			updateStars(allStars[i]);
		};
		requestAnimationFrame(animationLoop);
	}

	function createStars(numberOfStars){
		for(let i = 0; i < numberOfStars; i++){
			allStars.push(
				{
					"x": randi(0, width),
					"y": randi(0, height),
					"r": 1,
					"c": 60,
					"ax": 0.01,
					"a": randi(0.1, 1),
					"angle": randi(0, 360),
					"changle": 0.5, 
					"randangle": function() {return randn(20)},
					"d": 0.2
				}
			)
		}
	}

	function updateStars (o){
		let cx;
		let sy;
		let onedegree = 2 * Math.PI / 360;
		cx = o.d * Math.cos(o.angle * onedegree);
		sy = o.d * Math.sin(o.angle * onedegree);
		o.x += cx;
		o.y += sy;
		o.angle += o.changle;
		o.a += o.ax;
		if(o.a > 1){o.ax = -0.01}
		if(o.a < 0){o.ax = 0.01}
	}

	function clear(){
		context.clearRect(0, 0, width, height);
	}

	function stars (o){ 
		context.beginPath();
		context.arc(o.x, o.y, o.r, 0, 2*Math.PI);
		context.fillStyle = "hsla("+o.c+", 100%, 50%, "+o.a+")";
		context.fill();
	}

	function randn(n){
		let r = Math.random() * n - (n/2);
		return r 
	}

	function randi(min, max){
		let r = Math.random() * (max - min) + min;
		return r
	}

	function setUpCanvas() {
		const canvas = document.querySelector("#star-background");
		context = canvas.getContext("2d");
		canvas.style.border = "none";
		canvas.width = width;
		canvas.height = height;
	}

	setUpCanvas()
	createStars(100)
	animationLoop()
}

export {backgroundStars}