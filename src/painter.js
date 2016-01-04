/**
*Object that paints the model within a canvas.
*
*Colors must be an array where the ith element specifies the color of an i-valued cell
*and is an integer array of the form [R(0-255),G(0-255),B(0-255)] .
*
*CellLength is the length of the side of each cell measured in pixels
*
*CanvasId is the id of the canvas element where the CA should be painted
*/
var CA = CA || {};

CA.Painter = function(colors, cellLength, canvasId) {
	var self = this;

	this.colors = colors;
	this.cellLength = cellLength;

	var canvas = document.getElementById(canvasId);
	this.ctx = canvas.getContext("2d");

	this.canvasWidth = canvas.offsetWidth;
	this.canvasHeight = canvas.offsetHeight;
	

	/**
	*Paints the given matix in the canvas element with an id of "canvas"
	*/
	this.paintGrid = function(matrix) {

		var xCells = Math.floor(self.canvasWidth/self.cellLength) + 1;
		var yCells = Math.floor(self.canvasHeight/self.cellLength) + 1;

		var xLimit = Math.min(xCells, matrix[0].length);
		var yLimit = Math.min(yCells, matrix.length);

		var lastValue = -1;
		for (var i = 0; i < yLimit; i++) {
			for (var j = 0; j < xLimit; j++) {
				var val = matrix[i][j];
				if(lastValue != val) {
					self.ctx.fillStyle = "rgb("+colors[val][0]+","+colors[val][1]+","+colors[val][2]+")";
					lastValue = val;
				}
				self.ctx.fillRect(j*cellLength, i*cellLength, cellLength, cellLength);
			};
		};
	}

	/**
	*Paints the cells specified in the cells array.
	*Each element should be of the form [x, y, value].
	*/
	this.paintCells = function(cells) {
		var lastColor = -1;
		for(var i = 0; i < cells.length; i++) {
			var cell = cells[i]
			var val = cell[2];
			if(lastColor != val) {
				self.ctx.fillStyle = "rgb("+colors[val][0]+","+colors[val][1]+","+colors[val][2]+")";
				lastColor = val;
			}
			self.ctx.fillRect(cell[1]*cellLength, cell[0]*cellLength, cellLength, cellLength);
		}
	}

	
}