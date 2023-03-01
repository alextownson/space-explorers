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
				}
			)
		}
	}

	function updateStars (star){
		let cosX;
		let sinY;
		let oneDegree = 2 * Math.PI / 360;
		cosX = star.degree * Math.cos(star.angle * oneDegree);
		sinY = star.degree * Math.sin(star.angle * oneDegree);
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

	function clear(){
		context.clearRect(0, 0, width, height);
	}

	function stars (star){ 
		context.beginPath();
		context.arc(star.x, star.y, star.radius, 0, 2*Math.PI);
		context.fillStyle = 'hsla('+star.colour+', 100%, 50%, '+star.alpha+')';
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
		const canvas = document.querySelector('#star-background');
		context = canvas.getContext('2d');
		canvas.style.border = 'none';
		canvas.width = width;
		canvas.height = height;
	}

	setUpCanvas()
	createStars(100)
	animationLoop()
}

export {backgroundStars}