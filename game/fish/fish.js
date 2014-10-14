"use strict";

var AREA_HEIGHT = 400;
var AREA_WIDTH = 700;
var FISH_HEIGHT = 50;
var FISH_WIDTH = 70;
var COST_F = [5, 100];
var money = 1;
var cost = [1, 500];
var fishNum = [0, 0];
var level = [30, 100, 200];
var fishChosen = 0;

window.onload = function(){
	createFishes();
	// var background = new Audio("music/background.wav");
	// background.play();
	document.getElementById("area").onclick = addfish;
	var time = setInterval(swim, 50);
	var change = setInterval(changeState, 1000);
	var upDate = setInterval(update, 1000);
	//var music = setInterval(playMusic, 127000);
	setOnclick();
};

function setOnclick(){
	var buys = document.querySelectorAll(".buy");
	for(var i = 0; i < buys.length; i++){
		buys[i].onclick = choose;
	}
}

function choose(){
	var buys = document.querySelectorAll(".buy");
	for(var i = 0; i < buys.length; i++){
		if(buys[i].classList.contains("chosen")){
			buys[i].classList.remove("chosen");
		}
		if(buys[i] == this){
			this.classList.add("chosen");
			fishChosen = i;
		}
	}
}

//function playMusic(){
	//var background = new Audio("music/background.wav");
	//background.play();
//}

function updateMoney(){
	document.getElementById("money").innerHTML = "Money: " + money;
}

function updateCosts(){
	for(var i = 0; i < cost.length; i++){
		document.getElementById("cost"+i).innerHTML = " $ " + cost[i];
	}
}

function update(){
	money += 5 * fishNum[0] + 10 * fishNum[1];
	updateMoney();
	var fishes = document.querySelectorAll(".fish");
	var growup = new Audio("music/growup.wav");
	for(var i = 0; i < fishes.length; i++){
		fishes[i].age++;
		if(fishes[i].age > level[2] && !fishes[i].classList.contains("level4")){
			fishes[i].classList.add("level4");
			growup.play();
		}else if(fishes[i].age > level[1] && !fishes[i].classList.contains("level3")){
			fishes[i].classList.add("level3");
			growup.play();
		}else if(fishes[i].age > level[0] && !fishes[i].classList.contains("level2")){
			fishes[i].classList.add("level2");
			growup.play();
		}
	}
}

function changeState(){
	var fishes = document.querySelectorAll(".fish"); 
	var num = Math.floor(Math.random() * 3);
	for(var i = num; i < fishes.length; i += 4){
		setVandD(fishes[i]);
		modifyClass(fishes[i]);
	}
}

function createFishes(){
	for(var i = 0; i < 1; i++){
		var fish = document.createElement("div");
		creatfish(fish);
		fish.style.top = Math.floor(Math.random() * (AREA_HEIGHT - FISH_HEIGHT)) + "px";
		fish.style.left = Math.floor(Math.random() * (AREA_WIDTH - FISH_WIDTH)) + "px";
	}
}

function creatfish(fish){
	fish.className = "fish level1";
	fish.classList.add("type" + fishChosen);
	setVandD(fish);
	modifyClass(fish);
	fish.age = 0;
	document.getElementById("area").appendChild(fish);
	fishNum[fishChosen]++;
}

function setVandD(fish) {
	fish.velocityX = Math.random() * 3 + 1;
	fish.velocityY = Math.random() * 2 + 1;
	fish.towardLeft = Math.random() >= 0.5;
	fish.towardUp = Math.random() >= 0.5;
}

function addfish(){
	if(money >= cost[fishChosen]){
		var snd = new Audio("music/buyfish.wav");
		snd.play();
		var fish = document.createElement("div");
		creatfish(fish);
		fish.style.top = event.offsetY + "px";
		fish.style.left = event.offsetX + "px";
		money -= COST_F[fishChosen];
		cost[fishChosen] = Math.pow((fishNum[fishChosen] + 1), 3) * COST_F[fishChosen];
		updateMoney();
		updateCosts();
	}else{
		document.getElementById("money").classList.add("hightlight");
		setTimeout(function(){document.getElementById("money").classList.remove("hightlight");}, 200);
	}
}

function swim(){
	var fishes = document.querySelectorAll(".fish"); 
	for(var i = 0; i < fishes.length; i++){
		var oldY = parseInt(window.getComputedStyle(fishes[i]).top);
		var oldX = parseInt(window.getComputedStyle(fishes[i]).left);
		var top = parseInt(window.getComputedStyle(fishes[i]).top);
		var left = parseInt(window.getComputedStyle(fishes[i]).left);
		if(top <= 0){
			fishes[i].towardUp = false;
		}else if (top >= AREA_HEIGHT - FISH_HEIGHT){
			fishes[i].towardUp = true;
		}

		if(left <= 0){
			fishes[i].towardLeft = false;
		}else if (left >= AREA_WIDTH - FISH_WIDTH){
			fishes[i].towardLeft = true;
		}
		modifyClass(fishes[i]);

		if(fishes[i].towardLeft){
			fishes[i].style.left = oldX - fishes[i].velocityX + "px";
		}else{
			fishes[i].style.left = oldX + fishes[i].velocityX + "px";
		}

		if(fishes[i].towardUp){
			fishes[i].style.top = oldY - fishes[i].velocityY + "px";
		}else{
			fishes[i].style.top = oldY + fishes[i].velocityY + "px";
		}
	}
}

function modifyClass(fish){
	if(fish.classList.contains("left")){
		fish.classList.remove("left");
	}else if(fish.classList.contains("right")){
		fish.classList.remove("right");
	}
	if(fish.towardLeft){
		fish.classList.add("left");
	}else{
		fish.classList.add("right");
	}
}
