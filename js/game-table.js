
function addTogleCellState(e) {
	var allRows = document.querySelectorAll('.game-board tr');
	for (var i = 0; i < allRows.length; i++) {
		for (var j = 0; j < allRows[i].cells.length; j++) {

			allRows[i].cells[j].onmousedown = function(e) {
				var cell = e.target;
				if (cell.className == 'life') {
					cell.className = '';
				}
				else
				{
					cell.className = 'life';
				}
			}
			allRows[i].cells[j].onmouseover = function(e) {
				var cell = e.target;
				if (e.buttons == 1) {
					if (cell.className == 'life') {
						cell.className = '';
					}
					else
					{
						cell.className = 'life';
					}
				}
			}
		};
	}
}

function createGameBoard(totalCells,totalRows){
	if (totalCells == '' || totalCells == 0 || totalRows == '' || totalRows == 0) {
		console.log('Error');
		return;
	}

	var gameBoard = document.createElement('table');
	gameBoard.className = 'game-board';
	gameBoard.setAttribute('cellpadding', 0);
	gameBoard.setAttribute('cellspacing', 0);
	for (var i = 0; i < totalRows; i++) {
		var row = document.createElement('tr');
		for (var j = 0; j < totalCells; j++) {
			var cell = document.createElement('td');
			row.appendChild(cell);
		};
		gameBoard.appendChild(row);
	};

	document.getElementById('board').appendChild(gameBoard);
}

function initGame(){
	document.getElementById('board').innerHTML = '';
	createGameBoard(125,60);
	addTogleCellState();
}

initGame();

var stepCount = 0;
function nextStep() {
	var allRows = document.querySelectorAll('.game-board tr');
	var totalRows = allRows.length, totalCells = allRows[0].cells.length;
	var nextState = new Array(totalRows);
	for (var i = 0; i < nextState.length; i++) {
		nextState[i] = new Array(totalCells);
	};

	for (var i = 0; i < allRows.length; i++) {
		for (var j = 0; j < allRows[i].cells.length; j++) {

			var cell = allRows[i].cells[j];

			cell.nears = [];
			cell.totalNears = 0;

			//Vecinos 1,2 y 3
			if (i > 0) {
				//Vecino 1
				if (j > 0) {
					if (allRows[i-1].cells[j-1].className == 'life') {
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
				if (allRows[i-1].cells[j].className == 'life') {
					cell.nears[1] = 1;
				}
				else
				{
					cell.nears[1] = 0;
				}

				//Vecino 3
				if (j < totalCells - 1) {
					if (allRows[i-1].cells[j+1].className == 'life') {
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
				if (allRows[i].cells[j+1].className == 'life') {
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
					if (allRows[i+1].cells[j+1].className == 'life') {
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
				if (allRows[i+1].cells[j].className == 'life') {
					cell.nears[5] = 1;
				}
				else
				{
					cell.nears[5] = 0;
				}

				if (j > 0) {
					if (allRows[i+1].cells[j-1].className == 'life') {
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
				if (allRows[i].cells[j-1].className == 'life') {
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

			for (var n = 0; n < cell.nears.length; n++) {
				if (cell.nears[n] == 1) {
					cell.totalNears++;
				}
			}

			if (cell.className == 'life') {
				if (cell.totalNears <= 1 || cell.totalNears >= 4) {
					nextState[i][j] = 0;
				}
				else
				{
					nextState[i][j] = 1;
				}
			}
			else{
				if (cell.totalNears == 3) {
					nextState[i][j] = 1;
				}
				else
				{
					nextState[i][j] = 0;
				}
			}

		}
	}
	for (var i = 0; i < nextState.length; i++) {
		for (var j = 0; j < nextState[i].length; j++) {
			if (nextState[i][j] == 0) {
				allRows[i].cells[j].className = '';
			}
			else
			{
				allRows[i].cells[j].className = 'life';
			}
		}
	}

	stepCount++;
	document.getElementById('steps').innerHTML = stepCount;
}

var playVar;
function play(element) {
	if (playVar == null || playVar == '') {
		playVar = setInterval(nextStep, 1);
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
	var allcells = document.querySelectorAll('.game-board td');
	for (var i = 0; i < allcells.length; i++) {
		allcells[i].className = '';
	}
	stepCount = 0;
	document.getElementById('steps').innerHTML = stepCount;
}