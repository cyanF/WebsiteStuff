"use strict";

var HEIGHT_AND_WIDTH = 100;
var ROWS_AND_COLS = 4;
var emptyRow = 3;
var emptyCol = 3;


window.onload = function() {
	document.getElementById("shufflebutton").onclick = shuffle;
	var winMessage = document.createElement("div");
	winMessage.id = "winMessageDiv";
	document.querySelector("body").insertBefore(winMessage, document.getElementById("controls"));
	makeRects();
	window.onkeydown = keyDown;
};

function makeRects() {
	var num = 1;
	for(var i = 0; i < ROWS_AND_COLS; i++){
		for(var j = 0; j < ROWS_AND_COLS; j++){
			var rect = document.createElement("div");
			rect.innerHTML = num;
			num++;
			rect.className = "rectangle";
			rect.row = rect.origRow = i;
			rect.col = rect.origCol = j;
			rect.id = "square_" + i + "_" + j;
			rect.style.top = HEIGHT_AND_WIDTH * i + "px";
			rect.style.left = HEIGHT_AND_WIDTH * j + "px";
			rect.style.backgroundPosition = -HEIGHT_AND_WIDTH * j + "px "+
											 -HEIGHT_AND_WIDTH * i + "px";
			rect.onclick = rectClick;
			rect.onmouseover = hover;
			rect.onmouseout = out;
			document.getElementById("puzzlearea").appendChild(rect);
		}
	}
	var remove = document.getElementById("square_3_3");
	remove.parentNode.removeChild(remove);
}

function rectClick(){
	move(this.id);
}

function lose(){
	var remove = document.getElementById("winMessageP");
	if(remove){
		remove.parentNode.removeChild(remove);
	}
}

function win(){
	var winMessage = document.createElement("p");
	winMessage.id = "winMessageP";
	winMessage.innerHTML = "Congratuation!! You WIN!!";
	document.getElementById("winMessageDiv").appendChild(winMessage);
}

function move(id) {
	var rect = document.getElementById(id);
	if(rect && check(rect.row, rect.col)){
		rect.style.top = HEIGHT_AND_WIDTH * emptyRow + "px";
		rect.style.left = HEIGHT_AND_WIDTH * emptyCol + "px";
		var tempRow = emptyRow;
		var tempCol = emptyCol;
		emptyRow = rect.row;
		emptyCol = rect.col;
		rect.row = tempRow;
		rect.col = tempCol;
		rect.id = "square_" + rect.row + "_" + rect.col;
		if(isWin()){
			win();
		}else{
			lose();
		}
	}
}

function hover(){
	if(check(this.row, this.col)){
		this.classList.add("hover");
	}
}

function out(){
	this.classList.remove("hover");
}

function shuffle(){
	for(var i = 0; i < 1000; i++){
		var neighbours = [];
		for (var row = 0; row < 4; row++){
			for(var col = 0; col < 4; col++){
				if(check(row, col)){
					neighbours.push("square_" + row + "_" + col);
				}
			}
		}
		var randomNum = parseInt(Math.random() * neighbours.length);
		move(neighbours[randomNum]);
	}
	lose();
}

function check(row, col){
	return ((row == emptyRow && (col == emptyCol - 1 || col == emptyCol + 1)) ||
			(col == emptyCol && (row == emptyRow - 1 || row == emptyRow + 1)));
}

function isWin(){

	var rects = document.querySelectorAll(".rectangle");
	for(var i = 0; i < rects.length; i++){
		if(rects[i].row != rects[i].origRow || rects[i].col != rects[i].origCol){
			return false;
		}
	}
	return true;
}

function keyDown(event){
	var key = event.keyCode;
	if(key == 37){ //left
		var idToMove = "square_" + emptyRow + "_" + (emptyCol + 1);
		move(idToMove);
		return false;
	}else if(key == 38){ //up
		var idToMove = "square_" + (emptyRow + 1) + "_" + emptyCol;
		move(idToMove);
		return false;
	}else if(key == 39){ //right
		var idToMove = "square_" + emptyRow  + "_" + (emptyCol - 1);
		move(idToMove);
		return false;
	}else if(key == 40){ //down
		var idToMove = "square_" + (emptyRow - 1) + "_" + emptyCol;
		move(idToMove);
		return false;
	}
}