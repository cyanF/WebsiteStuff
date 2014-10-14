"use strict";

var PLAYGROUND_WIDTH = 500;
var PLAYGROUND_HEIGHT = 500;
var PLAYER_WIDTH = 70;
var PLAYER_HEIGHT = 70;

var LARGE_SPEED = 6;
var MEDIAN_SPEED = 3;
var SMALL_SPEED = 1;

var enemies = [];
var gameOver = false;
var score = 0;
var highscore = 0;

function restartgame(){
	//window.location.reload();
	$("#highscore").html("Highscore: " + highscore);
	score = 0;
	$(".enemy").each(function(){
		$(this).remove();
	});
	gameOver = false;
	$("#gameover, #again").fadeTo(500, 0, function(){$(this).remove();});
	$("#background, #player, #enemies").fadeTo(1000, 1);
	$("#cute1").x(100);
	$("#cute1").y(PLAYGROUND_HEIGHT / 2 - PLAYER_HEIGHT / 2);
	$("#cute2").x(350);
	$("#cute2").y(PLAYGROUND_HEIGHT / 2 - PLAYER_HEIGHT / 2);
}

function Enemy(node){
	this.speedx = -2;
	this.speedy = 0;
	this.node = $(node);

	this.update = function(){
		this.updateX();
		this.updateY();
	};	
	this.updateX = function(){
		this.node.x(this.speedx, true);
	};
	this.updateY= function(){
		this.node.y(this.speedy, true);
	};
}

function Fire(node){
	this.node = $(node);
}
Fire.prototype = new Enemy();

function Food(node){
	this.node = $(node);
}
Food.prototype = new Enemy();



$(document).ready(function(){
	// background and player anime
	var background1 = new $.gQ.Animation({imageURL:"background1.png"});
	var background2 = new $.gQ.Animation({imageURL:"background2.png"});
	var background3 = new $.gQ.Animation({imageURL:"background3.png"});
	var background4 = new $.gQ.Animation({imageURL:"background4.png"});
	var background5 = new $.gQ.Animation({imageURL:"background5.png"});
	var background6 = new $.gQ.Animation({imageURL:"background6.png"});
	var cute = new $.gQ.Animation({imageURL:"cute2.png"});

	// enemies anime
	enemies[0] = [];
	enemies[0]["normal"] = new $.gQ.Animation({imageURL: "fire.png", numberOfFrame: 2, delta: 50, rate:400, type: $.gQ.ANIMATION_HORIZONTAL});
	enemies[0]["freeze"] = new $.gQ.Animation({imageURL:"fire_freeze.png"});

	$("#playground").playground({height: PLAYGROUND_HEIGHT, width: PLAYGROUND_WIDTH, keyTracker:true});
	$.playground().addGroup("background", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("background1", {animation: background1, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("background2", {animation: background2, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH})
						.addSprite("background3", {animation: background3, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("background4", {animation: background4, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH})
						.addSprite("background5", {animation: background5, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("background6", {animation: background6, width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, posx: PLAYGROUND_WIDTH})
						.end()
					.addGroup("player", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT})
						.addSprite("cute1", {animation: cute, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, posx: 100, posy: PLAYGROUND_HEIGHT / 2 - PLAYER_HEIGHT / 2})
						.addSprite("cute2", {animation: cute, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, posx: 350, posy: PLAYGROUND_HEIGHT / 2 - PLAYER_HEIGHT / 2}).
						end()
					.addGroup("enemies", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT}).end()
					.addGroup("overlay", {width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT});

	$.playground().startGame();

	$.playground().registerCallback(function(){
		if(!gameOver){
			var newpos = ($("#background1").x() - SMALL_SPEED - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			$("#background1").x(newpos);

			newpos = ($("#background2").x() - SMALL_SPEED - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			$("#background2").x(newpos);

			var newpos = ($("#background3").x() - MEDIAN_SPEED - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			$("#background3").x(newpos);

			newpos = ($("#background4").x() - MEDIAN_SPEED - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			$("#background4").x(newpos);

			var newpos = ($("#background5").x() - LARGE_SPEED - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			$("#background5").x(newpos);

			newpos = ($("#background6").x() - LARGE_SPEED - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			$("#background6").x(newpos);
		}
	}, 50);


	// create enemies
	$.playground().registerCallback(function(){
		if(!gameOver){
			score++;
			$("#score").html("Score: " + score);
			if(Math.random() < 0.8){
				var name = "enemy1_" + Math.floor(Math.random() * 1000);
				$("#enemies").addSprite(name, {animation: enemies[0]["normal"], posx: PLAYGROUND_WIDTH, posy: Math.random() * PLAYGROUND_HEIGHT, width: 50, height: 32});
				$("#"+name).addClass("enemy");
				$("#"+name)[0].enemy = new Fire("#"+name);
			}
		}
	}, 500);

	// update enemies
	$.playground().registerCallback(function(){
		if(!gameOver){
			$(".enemy").each(function(){
				this.enemy.update();

				// test for collision
				//var collision = $(this).collision("#cute1,."+$.gQ.groupCssClass+" #cute2,."+$.gQ.groupCssClass);
				if(testCollision($("#cute1"), $(this.enemy.node), PLAYER_WIDTH, PLAYER_HEIGHT, 50, 32, 50) || 
					testCollision($("#cute2"), $(this.enemy.node), PLAYER_WIDTH, PLAYER_HEIGHT, 50, 32, 50)){
					gameOver = true;
					highscore = Math.max(score, highscore);
					$("#overlay").append('<div id="gameover"><h1>Game Over</h1></div><div id="again">Space to Try Again!</div>');
					$(".enemy").each(function(){$(this).setAnimation(enemies[0]["freeze"])});
					document.getElementById("again").onclick = restartgame;
					$("#player, #enemies, #background").fadeTo(500,0.2);
				}
			});
		}
	}, 15);

	function testCollision(nodex, nodey, widthx, heightx, widthy, heighty, distance){
		var deltax = ($(nodex).x() + widthx / 2) - ($(nodey).x() + widthy / 2);
		var deltay = ($(nodex).y() + heightx / 2) - ($(nodey).y() + heighty / 2);
		var sep = Math.sqrt(deltax * deltax + deltay * deltay);
		return (sep < distance);

	}

	// control the doges
	$.playground().registerCallback(function(){
		if(!gameOver){
			if(jQuery.gameQuery.keyTracker[65]){ // left1 (a)
				var nextpos = $("#cute1").x() - 5;
				if(nextpos > 0){
					$("#cute1").x(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[87]){ // up1 (w)
				var nextpos = $("#cute1").y() - 5;
				if(nextpos > 0){
					$("#cute1").y(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[68]){ // right1 (d)
				var nextpos = $("#cute1").x() + 5;
				if(nextpos < PLAYGROUND_WIDTH - PLAYER_WIDTH){
					$("#cute1").x(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[83]){ // down1 (s)
				var nextpos = $("#cute1").y() + 5;
				if(nextpos < PLAYGROUND_HEIGHT - PLAYER_HEIGHT){
					$("#cute1").y(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[74]){ // left2 (j)
				var nextpos = $("#cute2").x() - 5;
				if(nextpos > 0){
					$("#cute2").x(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[73]){ // up2 (i)
				var nextpos = $("#cute2").y() - 5;
				if(nextpos > 0){
					$("#cute2").y(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[76]){ // right2 (l)
				var nextpos = $("#cute2").x() + 5;
				if(nextpos < PLAYGROUND_WIDTH - PLAYER_WIDTH){
					$("#cute2").x(nextpos);
				}
			}
			if(jQuery.gameQuery.keyTracker[75]){ // down2 (k)
				var nextpos = $("#cute2").y() + 5;
				if(nextpos < PLAYGROUND_HEIGHT - PLAYER_HEIGHT){
					$("#cute2").y(nextpos);
				}
			}
		}else{
			if(jQuery.gameQuery.keyTracker[32]){
				restartgame();
			}
		}
	}, 15);

	$("#overlay").append('<div id="overlay"><p id="score">Score: 0</p><p id="highscore">High score: 0</p></div>');

});
