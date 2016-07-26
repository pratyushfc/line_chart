function Axis(dimension, shrink, rangeOb){
	this.shrink = shrink;			// Setting the shrink ratio for axis
	this.min = rangeOb.min;			// Setting the max and min value 
	this.max = rangeOb.max;			// for the range of axis
	this.height = dimension.height;
	this.width = dimension.width;
}

// Function to estimate actual graph positions from value
Axis.prototype.estimateRange = function(num){
	var ratio = (num - this.min) / (this.max - this.min);	// Estimating ratio
	return this.shrink * ratio * this.size;					// Getting actual positions on chart
}


Axis.prototype.plotAxis = function(canvas, isVertical, className){			// Public function to plot axis line
	var x1 = 0,
		x2 = this.width * this.shrink,
		y1 = 0,
		y2 = 0;

	if(isVertical){
		x1 = 0;
		x2 = 0;
		y1 = 0;
		y2 = this.shrink * this.height;
	}

	className = className || "axis";
	canvas.drawLine(x1, y1, x2, y2, "test"); 
}

Axis.prototype.__getRangeArray__ = function(divisions){		// Function to get array of range with 
	  													// optional divisions parameter for number of
	  													// divisions on axis
	var rangeArray = [],		// Array to store all steps min to max
		min = this.min,			// Getting min
		max = this.max,			// and max
		steps = (max - min) / divisions;	// Calculating steps value

	divisions = divisions || 5;		// Determining number of elements; default 5+1

	while (min <= max) {
		rangeArray.push(Math.round(min));
		min += steps;
	}

	return rangeArray;
}
