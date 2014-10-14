"use strict";

var SQUARE_LENGTH = 100;
var ROWS_AND_COLS = 4;

window.onload = function(){
	document.getElementById("main").style.width = SQUARE_LENGTH * ROWS_AND_COLS  +"px";
	document.getElementById("main").style.height = SQUARE_LENGTH * ROWS_AND_COLS  + "px";
	start();
	var squares = document.querySelectorAll(".square");
	var request = new XMLHttpRequest();
	request.onload = fillSquares;
	request.open("GET", "info.txt", false);
	request.send();
};

function start(){
	var num = 0;
	for(var i = 0; i < ROWS_AND_COLS; i++){
		for(var j = 0; j < ROWS_AND_COLS; j++){
			var square = document.createElement("div");
			square.id = "num" + num;
			square.n = num;
			square.innerHTML = num;
			num++;
			square.style.top = SQUARE_LENGTH * i + "px";
			square.style.left = SQUARE_LENGTH * j + "px";
			square.className = "square";
			document.getElementById("main").appendChild(square);
		}
	}
}

function fillSquares(){
	var line = this.responseText.split("\n"); // line --> index, pic, url
	var infos = [];
	for(var i = 0; i < line.length; i++){
		infos[i] = line[i].split(",");
	}
	for(var i = 0; i < infos.length; i++){
		var grid = document.getElementById("num" + i);
		grid.style.backgroundImage = "url('" + infos[i][1] + "')";
		grid.onclick = function(){
			window.location = infos[this.n][2];
		};
		grid.classList.add("filled");
	}
}

