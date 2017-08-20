# CA.js

CA.js is a javascript library that makes it easy to display and explore the endless space of cellular automata.  It comes with many pre-coded rules and helper methods that makes it easy to play with any CA.

## Motivation

This library was developed with two (somewhat personal) needs in mind: 1. to be able to easily, and 2. to quickly explore the many types of cellular automata that are found in the literature in order to provide a tool that allows the use of CA as an element of web applications, as a central feature or just as a design asset. 

## Components
CA.js uses five components to get its job done:

* Model
* Painter
* Prefabs
* Format
* Utils

### Model

Handles the state and transformations of the CA. The model is configured by changing its attributes and implementing some mandatory and optional abstract methods. 

The most important method to implement is the *nextStep()* function. *NextStep* is called for every cell of the automata, for each generation. It should return the integer value so that the cell will hold when the model steps. When you want to try a new rule set or add a special condition, this is the entry point you are looking for.

**Model** also comes populated with many helper methods, from handling torus/matricial coordinates to producing a random value give a discrete distribution. These functions are documented in the source code.

### Painter

The **Painter** module comes with all you need to paint your CA in an HTML5 canvas. It uses an array of RGB colors to represent each value of the matrix and a unique ID to identify the canvas element.

The **Painter** has two important methods: *paintGrid()* and *paintCells()*. The first one takes a matrix and paints each cell on the screen while the second one repaints a set of specific cells in a displayed matrix. 

### Prefabs

A library of sorts, with many ineresting and ready-to-run automata. Notable examples include the classic Game of Life - the elementary cellular automata as described by Wolfram and some Generations rules. All **Prefabs** populate the *nextStep()* and the *init()* functions; some include a color palette to be used with the painter. 

Apart from an implemented automaton, **Prefabs** also includes a few methods that help generate any CA in a given family. For example, the *lifeRule()* method populates the model with any specified rule set of the Life Like family. 

### Format

An interpreter to be used with the most common pattern and rule file formats. It allows the user to quickly see the referenced patterns and gliders of many automata databases. For now, it is String based but helper methods to handle file uploads are to be implemented. 

### Utils

**Utils** is a collection of miscellaneous functions that solve some repetitive problems. Probably the most important method is *stepEvery()* which updates and paints the given model every specified period of time.
	
## How to use

After importing the concatenated or minified version of the library (found in the bin directory) you need to create and populate a **Model** object:

```javascript
	model = CA.Utils.getModelFitToDimensions(cellLength, self.windowWidth, self.windowHeight);
```

To populate the CA automata you should either implement the *nextState()* function or use a **Prefab**. Let's try the latter:

```javascript
	var prefabs = new CA.Prefabs(model);
	prefabs.transersII()
```

Now *nextState()* and *init()* have been populated with the transers II rule set. During this process the prefab call *init()* was also executed, so the **Model's** matrix already holds some initial values. After the **Model** is ready we are going to create a painter object that will handle the visual representation of the automaton:

```javascript
	var colors = prefabs.transersII.getColors();
	painter = new CA.Painter(colors, cellLength, "canvas");
```

Since this rule set comes with a suggested color palette we just have to pass that to the object. Finally we use the **Utils** method *stepEvery()* to show the running model:

```javascript
	CA.Utils.stepEvery(10, model, painter);
```
This method steps the model every 10ms and then repaints it on the screen. That's it! To check out more examples, see the Examples section.

To see a live example please check [fivedots.github.io/CA.js](http://fivedots.github.io/CA.js/) and its sources: the index.html and controller.js files at the top level of the project directory. 

## Examples

These examples explore the different ways that the library could be used and should serve as a guide to make and use any cellular automaton. We will be focusing on the **model**, particularly *nextStep()* and *init()*.

### Game of Life

Let's start with a classic, Conway's Game of Life. A 3-state version of this CA is implemented in prefabs but let's use this opportunity to show how to implement an automaton with any desired rule. The rules are specified in the *nextStep()* method:

```javascript
	//0 = dead, 1 = alive
    //returns the value the [x, y] cell should hold the next generation
	model.nextStep = function(x, y) {
    	//Neighbors in state returns an array with the coordinates of all the
        //cells in the neighborhood radio whose value equals the specified one
    	var neighbors = model.getNeighborsInState(x,y,1).length;

		if(model.matrix[x][y] == 0) {
			//The cell is dead and has exactly 3 live neighbors	
            if(neighbors == 3) {
            	//Becomes alive
				return 1;
            }else{ 			
            	//Stays dead
				return 0;
			}    
		} else {
        	//The cell is alive and is not lonely or over populated
			if(2 <= neighbors & neighbors <= 3){
                return 1;
			} else {
				return 0;
			}
		}
    }
```

Now we want our automaton to hace an random initial value matrix every time its run. To do that we implement the *init()* function and call it whenever we want to randomize the matrix:

```javascript
	model.init = function() {
		model.randomizeMatrix([0.8,0.2]);
	}
    
    init();
```

Easy! Now every time the *init()* method is called every cell in the matrix has an 80% chance of being dead and a 20% chace of being alive. *RandomizeMatrix* takes a discreet probability distribution and sets each value of the automaton according to that distribution. 

To choose whether borders of the matrix should be considered neighbors or not, you should specify the value of *model.torusNeighborhood* . If you want to experiment with biggers neighborhoods you just have to change the value of *model.neighborhoodRadius*.

Game of Life usually runs on a black and white lattice, so let's tell that to our painter:

```javascript
	var colors = [];
	colors.push([255,255,255]);
	colors.push([0,0,0]);
    
	painter = new CA.Painter(colors, cellLength, "canvas");    
```

The colors array holds the RGB value that represent each state of a cell.

### 1-D elementary automaton

This example shows how to use family generating **Prefabs**. **Prefabs** comes loaded with a few methods that are capable of producing any CA within a rule family. One of these families is the Elementary automata family, which live in a one-dimensional universe and only consider its adjacent neighbors when deciding the next value of a cell. Each rule can be described with a number between 0 and 255 in Wolfram's notation. To populate the model we simply have to call the *wolfram1DRule()* method with the rule number we want to explore:

```javascript
	var prefabs = new CA.Prefabs(model);
    prefabs.wolfram1DRule(110);
```

Now after setting up the painter and starting the CA, a run of the 110th elementary automaton will be shown on the screen, using the y-axis as the time dimension.


## To do list

In no particular order:

* Optimization and Parallelization of the stepping mechanism
* Develop user interaction component that enables painting values on the grid and selecting a section to extract its data
* Allow easy manipulation of patterns and initial values
* Using icons (not only colors) to represent states on the grid
* Standardize the rule sets in the **Prefabs** component

## Acknowledgements

Most of the automata that are implemented in this project came from one of the many databases that are lying around on the Internet. I'm very thankful to the people who have set out to document, the awesome patterns and rules that they have found. Here's a list of the databases that were used for this project. Most include the contact information to their authors:

* [MCell's home page](http://www.mirekw.com/ca/index.html)
* [Fano database from UC Irvine](http://fano.ics.uci.edu/ca/)
* [Life lexicon](http://www.argentum.freeserve.co.uk/lex_home.htm)
* [D. Eppstein's website](http://www.ics.uci.edu/~eppstein/ca/)
