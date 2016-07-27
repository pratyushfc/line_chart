function Axis(dimension, shrink, rangeOb, isVertical){
	this.shrink = shrink;			// Setting the shrink ratio for axis
	this.min = rangeOb.min;			// Setting the max and min value 
	this.max = rangeOb.max;			// for the range of axis
	this.height = dimension.height;
	this.width = dimension.width;
	this.isVertical = isVertical;
}

// Function to estimate actual graph positions from value
Axis.prototype.estimateRange = function(num){
	var ratio = (num - this.min) / (this.max - this.min);	// Estimating ratio
	// Getting actual positions on chart
	if(this.isVertical){
		return this.shrink * ratio * this.height;	
	} else {
		return this.shrink * ratio * this.width;	
	}
}	// end estimateRange


Axis.prototype.plotAxis = function(canvas, className){			// Public function to plot axis line
	var x1 = 0,
		x2 = this.width * this.shrink,
		y1 = 0,
		y2 = 0;

	if(this.isVertical){
		x1 = 0;
		x2 = 0;
		y1 = 0;
		y2 = this.shrink * this.height;
	}

	className = className || "axis";
	canvas.drawLine(x1, y1, x2, y2, "test"); 
} // end plotAxis

Axis.prototype.__getRangeArray__ = function(divisions){		// Function to get array of range with 
	  													// optional divisions parameter for number of
	  													// divisions on axis
	if(this.rangeArray){
		return this.rangeArray;
	}

	divisions = divisions || 5;	 // Determining number of elements; default 5

	var min = this.min,			// Getting min
		max = this.max,			// and max
		steps = (max - min) / divisions;	// Calculating steps value

	this.rangeArray = [];
			

	while (min <= max) {
		this.rangeArray.push(min);
		min += steps;
	}
	this.rangeArray.push(min);
	
	this.min = this.rangeArray[0];
	this.max = this.rangeArray[this.rangeArray.length - 1];

	return this.rangeArray;
} //get __getRangeArray__

Axis.prototype.plotTicks = function(canvas){

	var rangeArray = this.__getRangeArray__(),	// getting ticks values
		i, len, item,
		x1, x2,		// Variables to store 
		y1, y2;		// dimensions

    for (i = 0, len = rangeArray.length; i < len; ++i) {
	    item = rangeArray[i];

	    if(this.isVertical){
		    x1 = -6;
		    x2 =  0;
		    y1 = this.estimateRange(item);
		    y2 = y1;
	    } else {
		    x1 = this.estimateRange(item);
		    x2 =  x1;
		    y1 = -6;
		    y2 = 0;	    	
	    }

	    canvas.drawLine(x1, y1, x2, y2, "ticks test");
	} 
} // end plotTicks

Axis.prototype.placeLabel = function(){

}