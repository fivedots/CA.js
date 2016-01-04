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
	this.getMatrixNeighborsInState = function() {
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
