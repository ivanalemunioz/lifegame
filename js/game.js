(function() {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();


var stepCount = 0, playVar, lastCell, cellsForStep = [];

var gameMode = "23/3", modeA = gameMode.split('/');
var modeA = gameMode.split('/');
var lives = modeA[0].split(''), born = modeA[1].split('');


function addTogleCellState(e) {
	var board = document.getElementById("board");
	board.onmousemove = function(e) {
		if (e.buttons == 1 && lastCell != e.target.id) {
			lastCell = e.target.id;
			toggleCellLife(e.target);
		}
	};
	board.onmousedown = function(e) {
		if (e.buttons == 1){	
			lastCell = e.target.id;
			toggleCellLife(e.target);
		}
	};
}

function toggleCellLife(cell) {
	if(cell.className.indexOf("cell") == -1){return;}
	var stepIndex = cellsForStep.indexOf(cell.id);
	if (cell.className == 'cell life') {
		cell.className = 'cell';
		if (stepIndex != -1) {
			cellsForStep.splice(stepIndex,1);
		}
	}
	else
	{
		cell.className = 'cell life';
		if (stepIndex == -1) {
			cellsForStep.push(cell.id);
		}
	}
}

function createGameBoard(totalCells,totalRows){
	if (totalCells == '' || totalCells == 0 || totalRows == '' || totalRows == 0) {
		console.log('Error');
		return;
	}

	var gameBoard = document.createElement('div');
	gameBoard.className = 'game-board';
	
	for (var i = 0; i < totalRows; i++) {
		var row = document.createElement('div');
		row.className = 'row';
		for (var j = 0; j < totalCells; j++) {
			var cell = document.createElement('div');
			cell.className = 'cell';
			cell.setAttribute("id",j+":"+i);
			row.appendChild(cell);
		};
		gameBoard.appendChild(row);
	};


	document.getElementById('board').appendChild(gameBoard);
}

function initGame(){
	document.getElementById('board').innerHTML = '';
	createGameBoard(160,110);
	addTogleCellState();
}

initGame();

function setGameMode(){
	var loadMessage = document.getElementById('gamemode-message');
	loadMessage.style.display = 'none';

	try{

		var gameModeEL = document.getElementById('gamemode');
		gameMode = gameModeEL.value
		modeA = gameMode.split('/');
		lives = modeA[0].split('');
		born = modeA[1].split('');

		loadMessage.className = 'text-success';
		loadMessage.innerHTML = 'Modo de juego cambiado.';
		loadMessage.style.display = 'block';
	}
	catch(e){

		loadMessage.className = 'text-danger';
		loadMessage.innerHTML = 'Error al intentar cambiar el modo de juego.';
		loadMessage.style.display = 'block';
	}
}

function liveDearOrBorn(name,nears) {
	if (name == 'cell') {
		for (var i = 0; i < born.length; i++) {
			if (born[i] == nears) {
				return 1;
			}
		}
	}
	else
	{
		for (var i = 0; i < lives.length; i++) {
			if (lives[i] == nears) {
				return 1;
			}
		}

	}
	return 0;
}






function nextStep() {
	console.log(document.querySelector(".game-board .row"));

	var allRows 	= document.querySelectorAll('.game-board .row');
	var totalRows 	= allRows.length;
	var totalCells 	= allRows[0].childNodes.length;
	var nextState 	= [];

	var originalCellsForStep = JSON.parse(JSON.stringify(cellsForStep));
	var totalCellsStep = cellsForStep.length;

	for (var n = 0; n < totalCellsStep; n++) {
		var sep = cellsForStep[n].indexOf(":");
		var j 	= parseInt(cellsForStep[n].substring(0, sep));
		var i 	= parseInt(cellsForStep[n].substring(sep+1));

		//Vecinos 1,2 y 3
		if (i > 0) {
			if (j > 0) {
				if (cellsForStep.indexOf((j-1)+":"+(i-1)) == -1){
					cellsForStep.push((j-1)+":"+(i-1));
				}
			}
			if (cellsForStep.indexOf((j)+":"+(i-1)) == -1){
				cellsForStep.push((j)+":"+(i-1));
			}
			if (j < totalCells - 1) {
				if (cellsForStep.indexOf((j+1)+":"+(i-1)) == -1){
					cellsForStep.push((j+1)+":"+(i-1));
				}
			}
		}

		//Vecino 4
		if (j < totalCells - 1) {
			if (cellsForStep.indexOf((j+1)+":"+(i)) == -1){
				cellsForStep.push((j+1)+":"+(i));
			}
		}

		//Vecinos 5, 6 y 7
		if (i < totalRows - 1) {
			if (j < totalCells - 1) {
				if (cellsForStep.indexOf((j+1)+":"+(i+1)) == -1){
					cellsForStep.push((j+1)+":"+(i+1));
				}
			}
			if (cellsForStep.indexOf((j)+":"+(i+1)) == -1){
				cellsForStep.push((j)+":"+(i+1));
			}

			if (j > 0) {
				if (cellsForStep.indexOf((j-1)+":"+(i+1)) == -1){
					cellsForStep.push((j-1)+":"+(i+1));
				}
			}
		}

		//Vecino 8
		if (j > 0) {
			if (cellsForStep.indexOf((j-1)+":"+(i)) == -1){
				cellsForStep.push((j-1)+":"+(i));
			}
		}
	}
	var sep,i,j;

	for (var n = 0; n < cellsForStep.length; n++) {
		sep = cellsForStep[n].indexOf(":");
		j 	= parseInt(cellsForStep[n].substring(0, sep));
		i 	= parseInt(cellsForStep[n].substring(sep+1));


		var cell = {};

		cell.nears = [];
		cell.totalNears = 0;

		//Vecinos 1,2 y 3
		if (i > 0) {
			//Vecino 1
			if (j > 0) {
				if (allRows[i-1].childNodes[j-1].className == 'cell life') {
					cell.nears[0] = 1;
				}
				else
				{
					cell.nears[0] = 0;
				}
			}
			else
			{
				cell.nears[0] = 0;
			}
			//Vecino 2
			if (allRows[i-1].childNodes[j].className == 'cell life') {
				cell.nears[1] = 1;
			}
			else
			{
				cell.nears[1] = 0;
			}

			//Vecino 3
			if (j < totalCells - 1) {
				if (allRows[i-1].childNodes[j+1].className == 'cell life') {
					cell.nears[2] = 1;
				}
				else
				{
					cell.nears[2] = 0;
				}
			}
			else
			{
				cell.nears[2] = 0;
			}
		}
		else
		{
			cell.nears[0] = 0;
			cell.nears[1] = 0;
			cell.nears[2] = 0;
		}

		//Vecino 4
		if (j < totalCells - 1) {
			if (allRows[i].childNodes[j+1].className == 'cell life') {
				cell.nears[3] = 1;
			}
			else
			{
				cell.nears[3] = 0;
			}
		}
		else
		{
			cell.nears[3] = 0;
		}

		//Vecinos 5, 6 y 7
		if (i < totalRows - 1) {
			//Vecino 5
			if (j < totalCells - 1) {
				if (allRows[i+1].childNodes[j+1].className == 'cell life') {
					cell.nears[4] = 1
				}
				else
				{
					cell.nears[4] = 0;
				}
			}
			else
			{
				cell.nears[4] = 0;
			}

			//Vecino 6
			if (allRows[i+1].childNodes[j].className == 'cell life') {
				cell.nears[5] = 1;
			}
			else
			{
				cell.nears[5] = 0;
			}

			if (j > 0) {
				if (allRows[i+1].childNodes[j-1].className == 'cell life') {
					cell.nears[6] = 1;
				}
				else
				{
					cell.nears[6] = 0;
				}
			}
			else
			{
				cell.nears[6] = 0;
			}
		}
		else
		{
			cell.nears[4] = 0;
			cell.nears[5] = 0;
			cell.nears[6] = 0;
		}

		//Vecino 8
		if (j > 0) {
			if (allRows[i].childNodes[j-1].className == 'cell life') {
				cell.nears[7] = 1;
			}
			else
			{
				cell.nears[7] = 0;
			}
		}
		else
		{
			cell.nears[7] = 0;
		}

		for (var l = 0; l < cell.nears.length; l++) {
			if (cell.nears[l] == 1) {
				cell.totalNears++;
			}
		}

		var actualState = allRows[i].childNodes[j].className 
		var newState 	= liveDearOrBorn(actualState,cell.totalNears);
		if( (newState == 0 && actualState != "cell") || (newState == 1 && actualState != "cell life") ){
			nextState.push(j+":"+i+"_"+newState);
		} 
	}

	var nextCellsForStep = [];
	for (var i = 0; i < originalCellsForStep.length; i++) {

		var lindex = nextState.indexOf(originalCellsForStep[i]+"_1"); 
		var dindex = nextState.indexOf(originalCellsForStep[i]+"_0"); 
		if(lindex != -1 || dindex == -1){
			nextCellsForStep.push(originalCellsForStep[i]);
		}
	}
	cellsForStep = nextCellsForStep;
	var x,y;
	for (var i = 0; i < nextState.length; i++) {
		x = nextState[i].substring(0, nextState[i].indexOf(":"));
		y = nextState[i].substring(nextState[i].indexOf(":")+1, nextState[i].indexOf("_"));
		if(nextState[i].substring(nextState[i].indexOf("_")+1) == 0){
			allRows[y].childNodes[x].className = 'cell';
		}
		else
		{
			allRows[y].childNodes[x].className = 'cell life';
			if (cellsForStep.indexOf(x+":"+y) == -1) {
				cellsForStep.push(x+":"+y);
			}
		}
	}

	stepCount++;
	document.getElementById('steps').innerHTML = stepCount;
}

function play() {
	var element = document.getElementById('play');
	if (playVar == null || playVar == '') {
		playVar = setInterval(function() {
			requestAnimationFrame(nextStep);
		}, 0);
		element.innerHTML = 'Parar';
	}
	else
	{
		clearInterval(playVar);
		playVar = '';
		element.innerHTML = 'Comenzar';
	}
}

function clearBoard() {
	var allcells = document.querySelectorAll('.game-board .cell');
	for (var i = 0; i < allcells.length; i++) {
		allcells[i].className = 'cell';
	}
	stepCount = 0;
	document.getElementById('steps-list').innerHTML = '';
	document.getElementById('steps').innerHTML = stepCount;
}

function stringToBoard() {
	var loadMessage = document.getElementById('load-message');
	loadMessage.style.display = 'none';
	try{
		var jsonString = document.getElementById('jsonString');
		jsonString = jsonString.value;
		var step = JSON.parse(jsonString);
		clearBoard();
		var allRows = document.querySelectorAll('.game-board .row');
		for (var i = 0; i < step.length; i++) {
			for (var j = 0; j < step[i].length; j++) {
				if (step[i][j] == 0) {
					allRows[i].childNodes[j].className = 'cell';
				}
				else
				{
					allRows[i].childNodes[j].className = 'cell life';
				}
			}
		}

		loadMessage.className = 'text-success';
		loadMessage.innerHTML = 'Juego cargado.';
		loadMessage.style.display = 'block';

	}
	catch(e){
		loadMessage.className = 'text-danger';
		loadMessage.innerHTML = 'Error al intentar cargar el juego.';
		loadMessage.style.display = 'block';

		return;
	}
}