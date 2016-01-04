var model;
var painter;

/**
*Initial method that is called from the body's onLoad.
*/
function setUp() {

	//Model Set Up
	model = getModelFitToScreen(3);

	var prefabs = new CA.Prefabs(model);

	prefabs.transersII()

	//Painter Set Up
	var colors = prefabs.transersII.getColors();

	var canvas = document.getElementById("canvas");

	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;
	$(canvas).attr("width", self.windowWidth);
	$(canvas).attr("height", self.windowHeight);

	painter = new CA.Painter(colors, getCellLengthToFitModel(model), "canvas");

	//Steps to the next generation every 10 ms
	start(10);
}

/**
*Runs the model indefinitely, updating and painting it every updateEvery milis
*/
function start(updateEvery) {
	painter.paintGrid(model.matrix);

	var intervalID = setInterval(function() {
		
		var changedCells  = model.step();
		painter.paintCells(changedCells);

	}, updateEvery);

}

/**
*Runs the model for n steps, updating and painting it every updateEvery milis
*/
function runFor(n, updateEvery) {
	painter.paintGrid(model.matrix);

	var intervalID = setInterval(function() {
		
		var changedCells  = model.step();
		painter.paintCells(changedCells);

		if(n--<0) {
			clearInterval(intervalID);
		}

	}, updateEvery);
}

/**
*Returns a model with a matrixWidth and matrixheight that completely fills the window.
*CellLength specifies the side length of painted cells
*/
function getModelFitToScreen(cellLength) {
	var xCells = Math.floor(window.innerWidth/cellLength);
	var yCells = Math.floor(window.innerHeight/cellLength);

	return new CA.Model(xCells, yCells);
}
/**
*Returns the maximum bewtween the cellLength thats fits the model to the window and 1.
*/
function getCellLengthToFitModel(model) {
	var width = Math.floor(window.innerWidth/model.matrixWidth);
	var height = Math.floor(window.innerHeight/model.matrixHeight);

	width = width > 0? width:1;
	height = height > 0? height:1;

	return Math.min(width,height);
}