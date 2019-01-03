const GAME_SPEED = 100;
const CANVAS_BORDER_COLOR = "white";
const CANVAS_BACKGROUND_COLOR = "black";
const SNAKE_COLOR = 'lightgreen';
const SNAKE_BORDER_COLOR = 'darkgreen';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';

let snake = [
	{x: 150, y:150},
	{x: 140, y:150},
	{x: 130, y:150},
	{x: 120, y:150},
	{x: 110, y:150},
];
let score = 0;
let changing_direction = false;
let food_x;
let food_y;
let x_velocity = 10;
let y_velocity = 0;

var game_canvas = document.getElementById("game_canvas");
var ctx = game_canvas.getContext("2d");

ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
ctx.strokeStyle = CANVAS_BORDER_COLOR;

ctx.fillRect(0,0, game_canvas.width, game_canvas.height);
ctx.strokeRect(0,0, game_canvas.width, game_canvas.height);

main();
create_food();
document.addEventListener("keydown", change_direction);

function main() {
	if (did_game_end()) return;
	setTimeout(function on_tick(){
		changing_direction = false;
		clear_canvas();
		draw_food();
		advance_snake();
		draw_snake();

		main();
	}, GAME_SPEED)
}

function clear_canvas() {
	ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
	ctx.strokeStyle = CANVAS_BORDER_COLOR;

	ctx.fillRect(0,0, game_canvas.width, game_canvas.height);
	ctx.strokeRect(0,0, game_canvas.width, game_canvas.height);
}

function did_game_end() {
    for (let i = 4; i < snake.length; i++) {
        const did_collide = snake[i].x === snake[0].x && snake[i].y === snake[0].y
        if (did_collide) return true
    }
    const hit_left_wall = snake[0].x < 0;
    const hit_right_wall = snake[0].x > game_canvas.width - 10;
    const hit_top_wall = snake[0].y < 0;
    const hit_bottom_wall = snake[0].y > game_canvas.height - 10;
    return hit_left_wall || hit_right_wall || hit_top_wall || hit_bottom_wall
}

function draw_food() {
 ctx.fillStyle = FOOD_COLOUR;
 ctx.strokestyle = FOOD_BORDER_COLOUR;
 ctx.fillRect(food_x, food_y, 10, 10);
 ctx.strokeRect(food_x, food_y, 10, 10);
}

function advance_snake() {
	const head = {x: snake[0].x + x_velocity, y: snake[0].y + y_velocity};
	snake.unshift(head);

	const did_eat_food = snake[0].x === food_x && snake[0].y === food_y;
	if(did_eat_food) {
		score += 10;
		document.getElementById('score').innerHTML = score;
		create_food();
	} else {
		snake.pop();
	}
}

function random_ten(min, max) {
	return Math.round((Math.random() * (max-min) + min) /10) * 10;
}
function create_food() {
	food_x = random_ten(0, game_canvas.width - 10);
	food_y = random_ten(0, game_canvas.height - 10);

	snake.forEach(function is_food_on_snake(part) {
		if(part.x == food_x && part.y == food_y) create_food();
	});
}

function draw_snake() {
	snake.forEach(draw_snake_parts)
}

function draw_snake_parts(snake_part) {
	ctx.fillStyle = SNAKE_COLOR;
	ctx.strokeStyle = SNAKE_BORDER_COLOR;

	ctx.fillRect(snake_part.x, snake_part.y, 10,10);
	ctx.strokeRect(snake_part.x, snake_part.y, 10, 10);
}

function change_direction(event) {
	if(changing_direction) return;
	changing_direction = true;
	const left_key = 37;
	const right_key = 39;
	const up_key = 38;
	const down_key = 40;

	const key_pressed = event.keyCode;
	
	const going_up = y_velocity === -10;
	const going_down = y_velocity === 10;
	const going_right = x_velocity === 10;
	const going_left = x_velocity === -10;

	if(key_pressed === left_key && !going_right) {
		x_velocity = -10;
		y_velocity = 0;
	}
	if(key_pressed === up_key && !going_down) {
		x_velocity = 0;
		y_velocity = -10;
	}
	if(key_pressed === right_key && !going_left) {
		x_velocity = 10;
		y_velocity = 0;
	}
	if(key_pressed === down_key && !going_up) {
		x_velocity = 0;
		y_velocity = 10;
	}

}