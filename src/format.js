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
