const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const PLAYER_KEY_MAPPINGS = {
	left: ["d", "Right", "ArrowRight"],
	right: ["a", "Left", "ArrowLeft"],
	up: ["w", "Up", "ArrowUp"],
	down: ["s", "Down", "ArrowDown"],
	attack: [" "]
}

let player = {
	color: "#0095DD",
	x: canvas.width / 2,
	y: canvas.height - 40,
	size: 40,
	velocity: 40
}

let Bomb = {
	color: "#FF0000",
	x: 0,
	y: 0,
	size: 20,
	delay: 10,
	animationDuration: 2,
	timer: 0
}

let bombs = [];

const GAME_TIMER = Date.now();

function keyDownHandler(event) {
	console.log(event.key);
	const key = event.key;

	if (PLAYER_KEY_MAPPINGS.right.includes(key)) {
		player.x -= player.velocity;
	} else if (PLAYER_KEY_MAPPINGS.left.includes(key)) {
		player.x += player.velocity;
	} else if (PLAYER_KEY_MAPPINGS.up.includes(key)) {
		player.y -= player.velocity;
	} else if (PLAYER_KEY_MAPPINGS.down.includes(key)) {
		player.y += player.velocity;
	} else if (PLAYER_KEY_MAPPINGS.attack.includes(key)) {
		console.log("Player dropped a bomb");
		let bomb = { ...Bomb };
		bomb.x = Math.floor(player.x + bomb.size);
		bomb.y = Math.floor(player.y + bomb.size);
		bomb.timer = GAME_TIMER;
		bombs.push(bomb);
	}
};
function keyUpHandler(event) { };

function drawPlayer(player) {
	ctx.beginPath();
	ctx.rect(player.x, player.y, player.size, player.size);
	ctx.fillStyle = player.color;
	ctx.fill();
	ctx.closePath();
}

function updateBombTimers() {
	bombs.forEach(bomb => {
		bomb.timer -= 1000;
	});
}

function updateBombs() {
	bombs.forEach((bomb, idx) => {
		if (bomb.readyRemove) {
			console.log('remove', idx);
			bombs.splice(idx, 1);
		}
	});


	bombs.forEach(bomb => {
		const bombDelta = Math.floor((Date.now() - bomb.timer) / 10000);
		console.log(bombDelta);
		if (bombDelta >= bomb.delay) {
			bomb.triggerExplosion = true;
		}

		if (bomb.triggerExplosion) {
			console.log("Bomb goes boom!!!");
			bomb.color = "#00FF00";
			bomb.readyRemove = true;
		}

	});

	updateBombTimers()
}

function drawBombs() {
	console.log("drawing bombs", bombs);
	bombs.forEach(bomb => {
		ctx.beginPath();
		ctx.arc(bomb.x, bomb.y, bomb.size, 0, Math.PI * 2);
		ctx.fillStyle = bomb.color;
		ctx.fill();
		ctx.closePath();
	});
}


function draw() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	updateBombs();
	drawBombs();
	drawPlayer(player);

}

const intervale = setInterval(draw, 1000 / 30);