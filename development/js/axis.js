function Axis(ob){
	ob = ob || {};
	this.height = ob.height || 500;
	this.width = ob.width || 300;
	this.shrink = ob.shrink || 0.81;
	this.range = ob.range;
	this.readFn = ob.readFn;
	this.isVertical = ob.isVertical;
	this.isRangeBasic = ob.basicRange || false;
	this.displayFn = ob.displayFn || function (item) { return item; };
	this.alignment = ob.alignment || "";
	this.__getRangeArray__();
}

// Function to estimate actual graph positions from value
Axis.prototype.estimateRange = function(data){
	var value,	// Estimating ratio
		dataAr = this.rangeArray;

	if(!this.isNumericType){
		data += "";
		value = data.in(dataAr, this.readFn) / (dataAr.length - 1);
	} else {
		value = (data - this.min) / (this.max - this.min);
	}

	// Getting actual positions on chart
	//console.log(typeof data, data, value, this.min, this.max)
	if(this.isVertical){
		return this.shrink * value * this.height;
	} else {
		return this.shrink * value * this.width;
	}
};	// end estimateRange


Axis.prototype.plotAxis = function(canvas, className){			// Public function to plot axis line
	var x1 = 0,
		x2 = this.width * this.shrink,
		y1 = 0,
		y2 = 0;
	className = className || "axis";

	if(this.isVertical){
		x1 = 0;
		x2 = 0;
		y1 = 0;
		y2 = this.shrink * this.height;
	}

	canvas.drawLine(x1, y1, x2, y2, className);
}; // end p`lotAxis

Axis.prototype.__getRangeArray__ = function(){		// Function to get 
															// array of range with
	  													// optional divisions parameter for number of
	  													// divisions on axis
	
	if(this.rangeArray){
		return this.rangeArray;
	}



	var min = 0, 
		max = 0, 
		dataAr = this.range,
		dataArLen = dataAr.length,
		readFn = this.readFn,
		arrayType = typeOfArray(dataAr, this.readFn);

	if(arrayType === "date" || arrayType === "numeric"){
		this.isNumericType = true;
		min = Math.min.apply(null, readArray(dataAr, readFn));
		max = Math.max.apply(null, readArray(dataAr, readFn));

		this.rangeArray = createRange({
			min : min,
			max : max,
			basic : this.isRangeBasic
		});

		this.min = this.rangeArray[0];
		this.max = this.rangeArray[this.rangeArray.length - 1];
	} else {
		this.isNumericType = false;
		this.rangeArray = arrayType;
	}

	return this.rangeArray;

}; //get __getRangeArray__

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
	    canvas.drawLine(x1, y1, x2, y2, "ticks");
	}
}; // end plotTicks

Axis.prototype.placeLabel = function(canvas, isLabelTop){
    var i = 0, len = 0,
    	x = 0,
    	y = 0,
    	newx = 0,
    	newy = 0,
    	stringTime = "",
    	item,
    	rangeArray = this.__getRangeArray__(),
    	alignment = this.alignment;


    if (!this.labelArray) {
        this.labelArray = [];
    }

    if (isLabelTop){
    	y = canvas.yaxis.shrink * this.height;
    	alignment = "center-horizontal up";
    }

    for (i = 0, len = rangeArray.length; i < len; ++i) {
        item = (rangeArray[i]);
        if(typeof item === "number"){
        	item = Math.round(item);
        } else {
        	item = this.readFn(item);
        }
        if(this.isVertical){
        	y = this.estimateRange(item);
        } else {
        	x = this.estimateRange(item);
        }
        stringTime = this.displayFn(item);

        if(stringTime.indexOf("b") !== -1) console.log(item, stringTime)

        this.labelArray[i] = canvas.__placeText(x, y, stringTime, "axis-label xaxis-label", null, alignment);
    }
};

Axis.prototype.removeLabel = function(canvas){
    var i = 0, len = 0, item;

    if (!this.labelArray) {
				return;
    }

    for (i = 0, len = this.labelArray.length; i < len; ++i) {
				item = this.labelArray[i];
				if(item){
							canvas.removeElement(item);
							this.labelArray[i] = undefined;
				}
		}
} // end removeLabel
