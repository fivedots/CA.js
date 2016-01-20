/**
*Object that models the Cellular Automata, including the current state, methods to advance the generations 
*and helper methods to handle patterns
*The parameter specify the amount of cells that are expected in both dimentions
*/
var CA = CA || {};

CA.Model = function(matrixWidth, matrixHeight) {

	var self = this;

	this.matrixWidth = matrixWidth;
	this.matrixHeight = matrixHeight;

	/**
	*Radius of the neighborhood to be considered in the getNeighbors methods
	*A value of 1 produces a computation on the Moore neighborhood
	*/
	this.neighborhoodRadius = 1;

	/**
	*Indicates whether border cells should consider the opposite border values as neighbors
	*Used in the getNeighbors methods
	*/
	this.torusNeighborhood = true;


	this.matrix = new Array(matrixHeight);
	for (var i = 0; i < matrixHeight; i++) {
		this.matrix[i] = new Array(matrixWidth);

		for(var j = 0; j < matrixWidth; j++) {
			this.matrix[i][j] = 0;
		}
	};

	this.xCenter = Math.floor(this.matrix.length/2);
	this.yCenter = Math.floor(this.matrix[0].length/2);

	this.currentGeneration = 0;

	/**
	*Abstract method that defines the next value of the cell located at (x,y)
	*/
	this.nextState = function(x, y) {

	}

	/**
	*Abstract method that initializes the matrix.
	*/
	this.init = function() {

	}

	/**
	*Abstract method that is called before the next generation matrix is formed in the step() method.
	*/
	this.preStep = function() {

	}

	/**
	*Abstract method that is called after the next generation matrix is formed in the step() method but 
	*before it replaces the current state matrix.
	*/
	this.postStep = function(nextMatrix) {
		
	}

	/**
	*Updates the current matrix to the next generation apl¡plying the next state function to each cell.
	*Returns a list of all the cell that changed value in this generation in the form of a 3-element array [x,y,newValue].
	*/
	this.step = function () {
		self.preStep();

		var stateChanged = [];

		var nextMatrix = new Array(self.matrixHeight);

		for(var i = 0; i < self.matrixHeight; i++) {
			nextMatrix[i] = new Array(self.matrixWidth);

			for(var j = 0; j < self.matrixWidth; j++) {
				nextMatrix[i][j] = self.nextState(i, j);

				if(nextMatrix[i][j] != self.matrix[i][j])
					stateChanged.push([i,j,nextMatrix[i][j]]);
			}
		}

		self.postStep(nextMatrix);

		self.matrix = nextMatrix;
		self.currentGeneration++;

		return stateChanged;
	}

	/**
	*Returns true if the (x,y) coordinate exists within the matrix
	*/
	this.inMatrix = function(x, y) {
		return 0 <= x && x < self.matrixHeight && 0 <= y && y < self.matrixWidth;
	} 

	/**
	*Returns true if ALL the (x,y) coordinate in the array exists within the matrix
	*The input array should be of the form: [[x1,y1], [x2,y2], ...]
	*/
	this.allInMatrix = function(coordinates) {
		var allIn = true;

		for(var i = 0; i < coordinates.length; i++)
			allIn = allIn && self.inMatrix(coordinates[i][0], coordinates[i][1]);

		return allIn;
	} 

	/**
	*Returns a list of the neighbors in the circular neighborhood of neighborhoodRadius size 
	*(where a radius of 1 is equal to the Moore neighborhood) that are currently in the specified state.
	*The way that borders are handled depends on the torusNeighborhood variable.
	*/
	this.getNeighborsInState = function(x, y, state) {
		if(self.torusNeighborhood)
			return self.getTorusNeighborsInState(x,y,state);
		else
			return self.getMatrixNeighborsInState(x,y,state);
	}

	/**
	*Returns a list of the neighbors in the circular neighborhood of neighborhoodRadius size 
	*(where a radius of 1 is equal to the Moore neighborhood) that are currently in the specified state.
	*If the cell is adjacent to a border the non-existent neighbors are not counted
	*/
	this.getMatrixNeighborsInState = function(x, y, state) {
		var resp = [];

		for (var i = -self.neighborhoodRadius; i <= self.neighborhoodRadius; i++) {
			for(var j = -self.neighborhoodRadius; j <= self.neighborhoodRadius; j++) {
				if(i==0 && j == 0) continue;
				if(self.inMatrix(x-i, y-j) && self.matrix[x-i][y-j] == state) {
					resp.push([x-i, y-j]);
				}
			}
		};

		return resp;
	}

	/**
	*Returns a list of the neighbors in the circular neighborhood of neighborhoodRadius size 
	*(where a radius of 1 is equal to the Moore neighborhood) that are currently in the specified st
	*The matrix is modeled as a torus where opposite border cells are cosidered neighbors
	*/
	this.getTorusNeighborsInState = function(x, y, state) {

		var resp = [];

		for (var i = -self.neighborhoodRadius; i <= self.neighborhoodRadius; i++) {
			for(var j = -self.neighborhoodRadius; j <= self.neighborhoodRadius; j++) {
				if(i==0 && j == 0) continue;

				var wx = mod((x-i), self.matrixHeight);
				var wy = mod((y-j), self.matrixWidth);

				if(self.matrix[wx][wy] == state) {
					resp.push([wx, wy]);
				}
			}
		};

		return resp;

	}

	/**
	*Returns a list of all the neighbors in the 8-cell neighborhood (Moore neighborhood).
	*If the cell is adjacent to a border the non-existent neighbors are not counted
	*/
	this.getNeighbors = function(x, y) {
		var resp = [];

		for (var i = -self.neighborhoodRadius; i <= self.neighborhoodRadius; i++) {
			for(var j = -self.neighborhoodRadius; j <= self.neighborhoodRadius; j++) {
				if(i==0 && j == 0) continue;

				if(self.inMatrix(x-i, y-j)) 
					resp.push([x-i, y-j]);
			}
		};

		return resp;
	}


	/**
	*Returns a list of all the neighbors in the 8-cell neighborhood (Moore neighborhood).
	*The matrix is modeled as a torus where opposite border cells are cosidered neighbors
	*/
	this.getTorusNeighbors = function(x, y) {

		var resp = [];

		for (var i = -self.neighborhoodRadius; i <= self.neighborhoodRadius; i++) {
			for(var j = -self.neighborhoodRadius; j <= self.neighborhoodRadius; j++) {
				if(i==0 && j == 0) continue;

				var wx = mod((x-i), self.matrixHeight);
				var wy = mod((y-j), self.matrixWidth);

				resp.push([wx, wy]);
			}
		};

		return resp;

	}

	/**
	*Sets every cell to the specified value
	*/
	this.setMatrix = function(value) {
		for(var i = 0; i < self.matrix.length; i++) {
			for(var j = 0; j < self.matrix[0].length; j++) 
				self.matrix[i][j] = value;
		}
	}

	/**
	*Sets every cell in the rectangle to a value.
	*x and y specify the top left corner and the rectangle is filled towards the right.
	*This fucntion is sensitive to the torusNeighbors variable.
	*/
	this.setRectangle = function(x,y,width,height,value) {
		for (var i = 0; i < height; i++) {
			for(var j = 0; j < width; j++) {
				setValue(x+i, y+j, value);
			}
		};
	};

	/**
	*Sets the values specified in pattern
	*x and y specify the position on the matrix where the leftmost corner of the pattern should be placed
	*pattern may be a jagged array
	*/
	this.setPattern = function(x,y,pattern) {
		for(var i = 0; i < pattern.length; i++) {
			for(var j = 0; j < pattern[i].length; j++) {
				self.setValue(x+i,y+j,pattern[i][j]);
			}
		}
	}

	/**
	*Randomizes the value of every cell to a number between 0 and probabilities.length - 1.
	*Probabilities must be an array of doubles where the sum of every element must add to 1.0;
	*The probability of a cell taking an i value is the probability specified in probabilities[i]
	*/
	this.randomizeMatrix = function(probabilities) {

		for(var i = 1; i < probabilities.length; i++) {
			probabilities[i] += probabilities[i-1];
		}

		for (var i = 0; i < self.matrixHeight; i++) {
			for(var j = 0; j < self.matrixWidth; j++) {
				var rand = Math.random();
				if(rand < probabilities[0]) {
					
					self.matrix[i][j] = 0;

				} else {

					for(var k = 1; k < probabilities.length; k++) {
						if(probabilities[k-1] <= rand && rand < probabilities[k]) {
							self.matrix[i][j] = k;
							break;
						}
					}

				}
			} 
		}
	}

	/**
	*Randomizes the value of every cell to a number between 0 and states (non inclusive).
	*/
	this.uniformlyRandomizeMatrix = function(states) {
		var probabilities = [];
		probabilities[0] = 1/states;

		for(var i = 1; i < states; i++) {
			probabilities.push(probabilities[0]*(i+1));
		}

		for (var i = 0; i < self.matrix.length; i++) {
			for(var j = 0; j < self.matrix[0].length; j++) {
				var rand = Math.random();
				if(rand < probabilities[0]) {
					
					self.matrix[i][j] = 0;

				} else {

					for(var k = 1; k < states; k++) {
						if(probabilities[k-1] <= rand && rand < probabilities[k]) {
							self.matrix[i][j] = k;
							break;
						}
					}

				}
			} 
		}
	}

	this.getTorusFirstCoordinate = function(coord) {
		return mod(coord, self.matrixHeight);
	}

	this.getTorusSecondCoordinate = function(coord) {
		return mod(coord, self.matrixWidth);
	}

	/**
	*Sets the value in the specified position, minding the torusNeighborhood attribute
	*/
	this.setValue = function(x,y,value) {
		if(self.getTorusNeighbors) {
			var wx = self.getTorusFirstCoordinate(x);
			var wy = self.getTorusSecondCoordinate(y);

			self.matrix[wx][wy] = value;

		} else if(self.inMatrix(x,y)) {
			
			self.matrix[x][y] = value;
		}
	}

	/**
	*Modulus operation that behaves as expected on negative values
	*/
	var mod = function(a,b) {
		return ((a%b)+b)%b;
	}

}
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

	
}/**
*Library of intesting models and model builders.
*Each method takes the model and gives an implementation for nestState() and init() and initializes the model.
*/
var CA = CA || {};

CA.Prefabs = function (model) {
	var self = this;

	this.model = model;

	/**
	*The automata that started it all.
	*This version requires 3 states, 0:dead, 1:died that generation, 2:alive.
	*It initializes each cell with a 0.8 probability of 0 and a 0.2 probability of 2.
	*B3/S23
	*/
	this.gameOfLife = function() {
		var gol = self.gameOfLife;

		self.model.nextState = function(x,y) {
			var neighbors = model.getNeighborsInState(x,y,2).length;

			if(model.matrix[x][y] == 0 || model.matrix[x][y] == 1) {

				if(neighbors == 3) {
					return 2;
				}else{ 			
					return 0;
				}

			} else {
				if(2 <= neighbors & neighbors <= 3){
					return 2;
				} else {
					return 1;
				}
			}
		};

		self.model.init = function() {
			model.randomizeMatrix([0.8,0,0.2]);
		}

		gol.getColors = function() {
			var colors = [];

			colors.push([255,255,255]);
			colors.push([192,192,192]);
			colors.push([0,0,0]);

			return colors;
		}

		self.model.init();
	}

	this.coral = function() {

		self.model.nextState = function(x,y) {
			var neighbors = model.getNeighborsInState(x,y,2).length;

			if(model.matrix[x][y] == 0 || model.matrix[x][y] == 1) {

				if(neighbors == 3) {
					return 2;
				}else{ 			
					return 0;
				}

			} else {
				if(4 <= neighbors & neighbors <= 8){
					return 2;
				} else {
					return 1;
				}
			}
		};

		self.model.init = function() {
			model.randomizeMatrix([0.8,0,0.2]);
		}

		self.model.init();
	}

	this.gnarl = function() {

		var gnarl = self.gnarl;

		self.model.nextState = function(x,y) {
			var neighbors = model.getNeighborsInState(x,y,2).length;

			if(model.matrix[x][y] == 0 || model.matrix[x][y] == 1) {

				if(neighbors == 1) {
					return 2;
				}else{ 			
					return 0;
				}

			} else {
				if(neighbors == 1){
					return 2;
				} else {
					return 1;
				}
			}
		};

		self.model.init = function() {
			model.setMatrix(0);
			center_x = Math.floor(model.matrix.length/2);
			center_y = Math.floor(model.matrix[0].length/2);
			model.matrix[center_x][center_y] = 2;
		}

		gnarl.getColors = function() {
			var colors = [];

			colors.push([255,255,255]);
			colors.push([192,192,192]);
			colors.push([0,0,0]);

			return colors;
		}

		self.model.init();
	}

	this.rug = function() {

		var rug = self.rug;

		self.model.nextState = function(x,y) {
			var neighbors = model.getNeighbors(x,y);

			var avg = 0;
			for(var i = 0; i < neighbors.length; i++) {
				avg += model.matrix[neighbors[i][0]][neighbors[i][1]];
			}
			avg /= 8;
			avg = Math.floor(avg);
			avg++;
			return avg%256;
		};

		self.model.init = function() {
			model.setMatrix(0);
			center_x = Math.floor(model.matrix.length/2);
			center_y = Math.floor(model.matrix[0].length/2);

			model.setRectangle(center_x,center_y,50,50,255);

			/*model.matrix[center_x][center_y] = 255;
			model.matrix[center_x+1][center_y] = 255;
			model.matrix[center_x+1][center_y+1] = 255;
			model.matrix[center_x][center_y+1] = 255;

			model.matrix[center_x][center_y] = 255;
			model.matrix[center_x-1][center_y] = 255;
			model.matrix[center_x-1][center_y-1] = 255;
			model.matrix[center_x][center_y-1] = 255;*/
		}

		rug.getColors = function() {
			var colors = [];

			for(var i = 255; i>=0 ; i--) {
				colors.push([(3*i)%256,(5*i)%256,(7*i)%256]);
			}

			return colors;
		}

		rug.getGrayscale = function() {
			var colors = [];

			for(var i = 255; i>=0 ; i--) {
				colors.push([(8*i)%256,(8*i)%256,(8*i)%256]);
			}

			return colors;
		}

		self.model.init();
	}

	this.landRush = function() {
		self.lifeRule([3,5],[2,3,4,5,7,8]);
	}

	/**
	*Populates the model with the specified one dimensional elemntary automata.
	*The vertical axis represents the passage of each generation.
	*ruleNumber is the number of the automata as specified by Wolfram.
	*/
	this.wolfram1DRule = function(ruleNumber) {
		var neighborsStates = [[1,1,1],[1,1,0],[1,0,1],[1,0,0],[0,1,1][0,1,0],[0,0,1],[0,0,0]];
		var nextState = [];

		for(var i = 0; i < 8; i++) {
			var sensor = 1 << i;

			if((ruleNumber & sensor) > 0)
				nextState.push(1);
			else
				nextState.push(0);
		}

		model.nextState = function(x,y) {
			var state = model.matrix[x][y];
			if(model.currentGeneration == x) {
				if(state == 0) {
					if(model.allInMatrix([[x-1,y],[x-1,y-1],[x-1,y+1]])) {

						var neighborLabel = 0;

						for(var i = -1; i <= 1; i++) {
							neighborLabel = neighborLabel | model.matrix[x-1][y+i];
							neighborLabel = neighborLabel << 1;
						}
						neighborLabel = neighborLabel >> 1;

						return nextState[neighborLabel];

					}

					return 0;
				}

				return 1;
			}
			return state;
		}

		model.init = function() {
			model.matrix[0][model.yCenter] = 1;
		}

		model.init();
	}

	/**
	*Populates the model with the specified life rule.
	*born and survive are int arrays.
	*if a dead cell has an element of born live neighbors it becomes alive the next generation.
	*if a live cell has an element of survive live neighbors it stays alive in the next generation.
	*/
	this.lifeRule = function(born,survive) {
		var lifeRule = self.lifeRule;

		self.model.nextState = function(x,y) {
			var neighbors = model.getNeighborsInState(x,y,2).length;

			if(model.matrix[x][y] == 0 || model.matrix[x][y] == 1) {

				for(var i = 0; i < born.length; i++) {
					if(born[i] == neighbors)
						return 2;
				}
				return 0;
			} else {

				for(var i = 0; i < survive.length; i++) {
					if(survive[i] == neighbors)
						return 2;
				}


				return 1;
			}
		};

		self.model.init = function() {
			model.randomizeMatrix([0.9,0,0.1]);
		}

		self.model.init();

		lifeRule.getColors = function() {
			var colors = [];

			colors.push([255,255,255]);
			colors.push([192,192,192]);
			colors.push([0,0,0]);

			return colors;
		}
	}

	/**
	*Populates the model with a geenerations automata.
	*A generations automata behaves like a life CA except cells don't die right away,
	*thay get older until reaching a certain generation. Aging cells dont influence the born and survive rules
	*/
	this.generationsRule = function(born,survive,maxGeneration) {
		var gens = self.generationsRule;

		self.model.nextState = function(x,y) {
			var neighbors = model.getNeighborsInState(x,y,1).length;

			if(model.matrix[x][y] == 0) {

				for(var i = 0; i < born.length; i++) {
					if(born[i] == neighbors)
						return 1;
				}
				return 0;

			} else if(model.matrix[x][y] == 1){

				for(var i = 0; i < survive.length; i++) {
					if(survive[i] == neighbors)
						return 1;
				}

				return 2;

			} else {
				var state = model.matrix[x][y];

				if(state < maxGeneration-1)
					return state + 1;

				return 0;
			}
		};

		self.model.init = function() {
			model.randomizeMatrix([0.8,0.2]);
		}

		self.model.init();

		gens.getColors = function() {
			var colors = new Array(maxGeneration);
			
			colors[0] = [0,0,0];
			self.putColorRange(colors, 1, maxGeneration-1, [255,0,0], [255,255,0]);

			return colors;
		}
	}

	this.transers = function() {
		var tran2 = self.transersII;

		prefabs.generationsRule([2,6],[3,4,5],5);

		tran2.getColors = function() {
			return self.generationsRule.getColors();
		}
	}

	this.transersII = function() {
		var tran2 = self.transersII;

		self.generationsRule([2,6],[0,3,4,5],6);

		tran2.getColors = function() {
			return self.generationsRule.getColors();
		}
	}

	/**
	*Returns an array with the linear interpolation of colors between from and to.
	*from and to should be an array of three ints, with a max value of 255.
	*The elements of the returned array are three-int arrays as well and has the specified size
	*/
	this.getColorRange  = function(from, to, size) {
		var step = [];

		for (var i = 0; i < 3; i++) {
			step[i] = (to[i]-from[i])/size;

			step[i] = Math.floor(step[i]);
		};

		var colors = [from];

		for(var i = 1; i < size; i++){
			colors[i] = [];
			for(var j = 0; j < 3; j++) {
				var next = colors[i-1][j]+step[j];
				
				colors[i].push(mod(next, 256));
			}
		}

		return colors;
	}

	/**
	*Overwrites a section of the given array with a linear interpolation of the specified colors.
	*/
	this.putColorRange = function(arr, startIndex, endIndex, initialColor, targetColor) {
		var colors = self.getColorRange(initialColor, targetColor, (endIndex - startIndex) + 1);

		for(var i = 0; i < colors.length; i++) {
			arr[startIndex+i] = colors[i];
		}

		return arr; 
	}

	/**
	*Modulus operation that behaves as expected on negative values
	*/
	var mod = function(a,b) {
		return ((a%b)+b)%b;
	}
}
/**
*Helper object that handles the transalation of patterns from various file patterns to actual values in a matrix
*/
function Format() {
	var self = this;

	this.aliveValue = 2;
	this.deadValue = 0;

	this.plaintextAlive = "O";
	this.plaintextDead = ".";
	this.plaintextComment = "!"
	
	this.plaintext = function(pattern) {
		var matrix = [];

		var patternLines = pattern.split("\n");

		for(var i = 0; i < patternLines.legth; i++) {
			line = patternLines[i]
			var tempArr = [];
			for(var j = 0; j < line.length; j++) {
				if(line[j] == self.plaintextComment)
					break;

				tempArr.push(line[j] == self.plaintextAlive? self.aliveValue : self.deadValue);
			}
			
			matrix.push(tempArr);
		}

		return matrix;
	} 
}
var CA = CA || {};
CA.Utils = {};

CA.Utils.stepController = function() {
	this.doStep = true;
}
CA.Utils.stepController.prototype.run = function() {
	this.doStep = true;
}
CA.Utils.stepController.prototype.stop = function() {
	this.doStep = false;
}
CA.Utils.stepController.prototype.toggle = function() {
	this.doStep = !this.doStep;
}

/**
*Runs the model indefinitely, updating and painting it every updateEvery milis
*/
CA.Utils.stepEvery = function(updateEvery, model, painter) {
	painter.paintGrid(model.matrix);

	var control =  new CA.Utils.stepController();

	var intervalID = setInterval(function() {
		if(control.doStep) {
			var changedCells  = model.step();
			painter.paintCells(changedCells);
		}
	}, updateEvery);

	return control;
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