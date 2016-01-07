var CA = CA || {};
CA.Utils = {};


/**
*Runs the model indefinitely, updating and painting it every updateEvery milis
*/
CA.Utils.stepEvery = function(updateEvery, model, painter) {
	painter.paintGrid(model.matrix);

	var intervalID = setInterval(function() {

		var changedCells  = model.step();
		painter.paintCells(changedCells);

	}, updateEvery);

}

/**
*Runs the model for n steps, updating and painting it every updateEvery milis
*/
CA.Utils.stepFor = function(n, updateEvery, painter, model) {
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
*Returns a new model with a matrixWidth and matrixheight that completely fills the window.
*CellLength specifies the side length of painted cells
*width and height specify the dimensions of the element where the model will be painted
*/
CA.Utils.getModelFitToDimensions = function(cellLength, width, height) {
	var xCells = Math.floor(width/cellLength);
	var yCells = Math.floor(height/cellLength);

	return new CA.Model(xCells, yCells);
}
/**
*Returns the maximum bewtween the cellLength thats fits the model to the window and 1.
*/
CA.Utils.getCellLengthToFitModel = function(model, width, height) {
	var width = Math.floor(window.innerWidth/model.matrixWidth);
	var height = Math.floor(window.innerHeight/model.matrixHeight);

	width = width > 0? width:1;
	height = height > 0? height:1;

	return Math.min(width,height);
}