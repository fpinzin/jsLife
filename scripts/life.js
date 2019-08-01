window.onload = function () {
	buildEarth();
}

setupShortcuts();


	// Global variables and constants
	var maxLength = 50
	
	var maxRows = maxLength;
	var maxColumns = maxLength;	
	var minLifeRequired = 2;
	var maxLifeAllowed = 3;
	var gridArray = get2DArray(maxLength);
	var cssAlive = "alive";
	var cssDead = "dead";
	var autorun = false;
	var iterationCount = 0;

	function clearCells(){
		iterationCount = 0;
		document.getElementById('iterationCount').innerHTML = iterationCount+' iterations';
		resetGrid();
	}

	
	function buildEarth(){
		buildGrid(maxRows,maxColumns);
		randomize();
	}
	
	function tick() {
		cycle();
	}

	function randomize(){
		iterationCount = 0;
		document.getElementById('iterationCount').innerHTML = iterationCount+' iterations';
		creation();
	}
	
	function run() {
        
		if (!autorun) {
			document.getElementById("btnRun").innerHTML="(S)top";
			autorun = true;
			running();
		} else {
			document.getElementById("btnRun").innerHTML="(R)un Continuous";
			autorun = false;
		}
    }
	
	
	function running() {
		if (autorun) {
			cycle();
			setTimeout('running()',100);
		}
	}
	
	// Creates an empty initial grid dynamically using <div> elements
	function buildGrid(x,y) {
		
		maxr = x;
		maxc = y;
		
		for (r=0; r<maxr; r++){
			var ni = document.getElementById('earth');
			var newdiv = document.createElement('div');
			newdiv.setAttribute('id','row_'+r);
			newdiv.setAttribute('class',"row");
			newdiv.innerHTML = '';
			ni.appendChild(newdiv);
		
			var ni = document.getElementById('row_'+r);
			for (c=0; c<maxc; c++){
				var newdiv = document.createElement('div');
				newdiv.setAttribute('id',r+'_'+c);
				newdiv.setAttribute('class',"cell");
				newdiv.innerHTML = ''; 	
				// Allows for capturing clicks on individual 'cells'
				newdiv.onclick = (function(opt) {
					return function() {
					   cellClick(opt);
					};
				})(r+'_'+c);
				ni.appendChild(newdiv);

			}
		}
	}

	// Removes 'life' from each cell resulting in a blank slate.
	function resetGrid() {
		
		maxr = maxRows;
		maxc = maxColumns;

		for (r=0; r<maxr; r++){
			for (c=0; c<maxc; c++){
				document.getElementById(r+'_'+c).classList.add(cssDead);
				document.getElementById(r+'_'+c).classList.remove(cssAlive);
			}
		}
	}
	
	function cellClick(cell){
	
		if (true) {
//			console.log(cell);
			var cellarray = cell.split('_');
			var tr = cellarray[0]; //cell.substring(0,1);
			var tc = cellarray[1]; //cell.substring(cell.length-1, cell.length);
//			console.log('split: '+tr+' '+tc);

			if (document.getElementById(tr+'_'+tc).classList.contains(cssAlive)) {
				document.getElementById(tr+'_'+tc).classList.add(cssDead);
				document.getElementById(tr+'_'+tc).classList.remove(cssAlive);
			} else {
				document.getElementById(tr+'_'+tc).classList.add(cssAlive);
				document.getElementById(tr+'_'+tc).classList.remove(cssDead);
			}
		}
	}

	// Randomization function for populating the grid with the initial life cells
	function creation() {
		var maxRows = maxLength;
		var maxColumns = maxLength;	

		var zz = 3;
		
		for (r = 0; r < maxRows; r++){
			for (c = 0; c < maxColumns; c++) {
				if (Math.floor(Math.random()*zz+1) % (zz) === 0) {
//				if (Math.floor(Math.random()*zz) === 1) {
					document.getElementById(r+'_'+c).classList.add(cssAlive);
					document.getElementById(r+'_'+c).classList.remove(cssDead);
				} else {
					document.getElementById(r+'_'+c).classList.add(cssDead);
					document.getElementById(r+'_'+c).classList.remove(cssAlive);
				}
			}
		}
	
	}
	
	function noLife() {
		alert("None of the cells are alive.  Start over.");
		autorun = false;
//		break;
	}
	
	// Executes a full cycle evaluating the game of life rules
	function cycle() {

		var cycleAliveCount = 0
		var friends = 0;
		var tr = ""; var tc = "";
		iterationCount++;
	
		// Put current state into local array for assessment
		for (r = 0; r < maxRows; r++){
			for (c = 0; c < maxColumns; c++) {
				if (document.getElementById(r+'_'+c).classList.contains(cssAlive)){
					gridArray[r][c] = cssAlive; //document.getElementById(r+'_'+c).innerHTML;
					cycleAliveCount++
				} else {
					gridArray[r][c] = cssDead;
				}
			}
		}
		
		if (cycleAliveCount === 0) {
			noLife();
		}
		
		// Run thru the saved grid (array) and apply 'life' logic
		for (r = 0; r < maxRows; r++){

			for (c = 0; c < maxColumns; c++) {

				friends = checkAround(r,c);

				if (gridArray[r][c] === cssAlive && friends >= minLifeRequired && friends <= maxLifeAllowed){
					document.getElementById(r+'_'+c).classList.remove(cssDead);
					document.getElementById(r+'_'+c).classList.add(cssAlive);
				} else if (gridArray[r][c] === cssDead && friends === maxLifeAllowed) {
					document.getElementById(r+'_'+c).classList.remove(cssDead);
					document.getElementById(r+'_'+c).classList.add(cssAlive);
				}else {
					document.getElementById(r+'_'+c).classList.add(cssDead);
					document.getElementById(r+'_'+c).classList.remove(cssAlive);
				}
			}
		}
		
		document.getElementById('iterationCount').innerHTML = iterationCount+' iterations';
	}

	function checkAround(r,c) {
		var tr = 0;
		var tc = 0;
		var friendsCount = 0
		
		var debug = false;		// controls display of debugging info to console.log
		
		// Row above
		tr = r-1; tc = c-1;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		tr = r-1; tc = c;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		tr = r-1; tc = c+1;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		// Same row
		tr = r; tc = c-1;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		tr = r; tc = c+1;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		// Row below
		tr = r+1; tc = c-1;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		tr = r+1; tc = c;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		tr = r+1; tc = c+1;
		friendsCount += isCellValid(tr,tc);
		if(debug)console.log('('+r+'_'+c+') (' +tr+':'+tc+') '+ friendsCount + '</br>');

		return friendsCount;
	}
	
	// Evaluates 1) whether a neighboring cell is legitimate for consideration and 2) whether it contains any life
	function isCellValid(r,c){

		var debug = false;

		if(debug) console.log('isCellValid: '+r+'_'+c);

		if (r >= 0 && r < maxRows && c >= 0 && c < maxColumns){
			return (gridArray[r][c] === cssAlive) ? 1 : 0;
		} else {
			return 0;
		}
	}

	// Creates or 2D array for storing the game grid (earth)
	function get2DArray(size) {
		size = size > 0 ? size : 0;
		var arr = [];

		while(size--) {
			arr.push([]);
		}
		return arr;
	}

function setupShortcuts() {

	shortcut.add("c",function() {clearCells();},{'type':'keydown','propagate':true,'target':document});
	shortcut.add("p",function() {randomize();},{'type':'keydown','propagate':true,'target':document});
	shortcut.add("1",function() {tick();},{'type':'keydown','propagate':true,'target':document});
	shortcut.add("r",function() {run();},{'type':'keydown','propagate':true,'target':document});
	shortcut.add("s",function() {run();},{'type':'keydown','propagate':true,'target':document});
	
	
}
	
	