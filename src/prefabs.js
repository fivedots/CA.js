/**
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
