var model;
var painter;

/**
*Initial method that is called from the body's onLoad.
*/
function setUp() {

	var cellLength = 3;

	var canvas = document.getElementById("canvas");

	this.windowWidth = window.innerWidth;
	this.windowHeight = window.innerHeight;
	$(canvas).attr("width", self.windowWidth);
	$(canvas).attr("height", self.windowHeight);

	//Model Set Up
	model = CA.Utils.getModelFitToDimensions(cellLength, self.windowWidth, self.windowHeight);

	var prefabs = new CA.Prefabs(model);

	prefabs.transersII()

	//Painter Set Up
	var colors = prefabs.transersII.getColors();


	painter = new CA.Painter(colors, cellLength, "canvas");

	//Steps to the next generation every 10 ms
	var control = CA.Utils.stepEvery(10, model, painter);
}