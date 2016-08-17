function Axis(ob){
	ob = ob || {};
	this.height = ob.height || 500;
	this.width = ob.width || 300;
	this.shrink = ob.shrink || 0.81;
	this.range = ob.range || [];
	this.readFn = ob.readFn || function (item) { return item; };
	this.isVertical = ob.isVertical || false;
	this.smartCategory = ob.smartCategory || false;
	this.isRangeBasic = ob.basicRange || false;
	this.displayFn = ob.displayFn || function (item) { return item; };
	this.alignment = ob.alignment || "";
	this.__getRangeArray__();
	this.trimSize = ob.trimSize || Infinity;
}

// Function to estimate actual graph positions from value
Axis.prototype.estimateRange = function(data){
	var value,	// Estimating ratio
		dataAr = this.rangeArray,
		readFn;

	if(this.isDateType && typeof data === "string"){
		data = new Date(data);
		data = joinDate(data.getYear(), data.getMonth());
	}

	if(this.isNumericType){
		value = (data - this.min) / (this.max - this.min);
	} else {
		data += "";
		value = (data.in(dataAr) + 0.5) / dataAr.length;
	}

	// Getting actual positions on chart
	//console.log(typeof data, data, value, this.min, this.max)
	if(this.isVertical){
		return this.shrink * value * this.height;
	} else {
		return this.shrink * value * this.width;
		console.log(this.rangeArray)
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
		newReadFn = function(item){
			var date = new Date(readFn(item));
			return joinDate(date.getYear(), date.getMonth());
		},
		arrayType = typeOfArray({
			array : dataAr,
			read :  this.readFn,
			smart : this.smartCategory
		});

	if(arrayType === "numeric"){
		this.isNumericType = true;
		min = Math.min.apply(null, readArray(dataAr, readFn));
		max = Math.max.apply(null, readArray(dataAr, readFn));

		this.rangeArray = createRange({
			min : min,
			max : max
		});

		this.min = this.rangeArray[0];
		this.max = this.rangeArray[this.rangeArray.length - 1];
	} else if(arrayType === "date") {
		this.isNumericType = true;
		this.isDateType = true;
		this.readFn = newReadFn;
		min = Math.min.apply(null, readArray(dataAr, newReadFn));
		max = Math.max.apply(null, readArray(dataAr, newReadFn));

		this.rangeArray = createRange({
			min : min - 1,
			max : max + 1,
			basic : true
		});

		this.min = this.rangeArray[0];
		this.max = this.rangeArray[this.rangeArray.length - 1];

	} else {
		this.isNumericType = false;
		this.rangeArray = arrayType;
		this.min = arrayType[0];
		this.max = arrayType[arrayType.length - 1];
	}

	return this.rangeArray;

}; //get __getRangeArray__

Axis.prototype.plotTicks = function(canvas){

	var rangeArray = this.__getRangeArray__(),	// getting ticks values
		i, len, item,
		isYear = rangeArray.length === 12,
		x1, x2,		// Variables to store
		y1, y2;		// dimensions
		

    for (isYear ? i = 2 : i = 0, len = rangeArray.length; i < len; isYear ? i += 3 : ++i ) {
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
		isYear = rangeArray.length === 12,
    	alignment = this.alignment;


    if (!this.labelArray) {
        this.labelArray = [];
    }

    if (isLabelTop){
    	y = canvas.yaxis.shrink * this.height;
    	alignment = "center-horizontal up";
    }

    for (isYear ? i = 2 : i = 0, len = rangeArray.length; i < len; isYear ? i += 3 : ++i) {
        item = (rangeArray[i]);
        if(typeof item === "number"){
        	item = Math.round(item);
        }
        
        if(this.isVertical){
        	y = this.estimateRange(item);
        } else {
        	x = this.estimateRange(item);
        }

        stringTime = this.convertValue(item);

        this.labelArray[i] = canvas.__placeText(x, y, stringTime, "axis-label xaxis-label", null, alignment, this.trimSize);
    }
};

Axis.prototype.convertValue = function(item){
	var result;
    if(this.isDateType){
    	if(typeof item === "string"){
    		item = new Date(item);
    		item = joinDate(item.getYear(), item.getMonth());
    	}
    	result = timeInWords(item);
    } else if(typeof item === "number"){
    	result = shortNumber(item);
    } else {
    	result = item;
    }
    return result;
}

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


Axis.prototype.placeDivBoxes = function(canvas){
    var i = 0, len = 0,
        x = 0,
        y = 5,
        readFn = this.readFn,
        rangeArray = this.rangeArray,
        xRangeAr = canvas.xaxis.rangeArray,
        lastElX = xRangeAr[xRangeAr.length - 1],
        width = canvas.xaxis.max,
        estimateRange = this.estimateRange.bind(this),
        height = 0,
        isYear = rangeArray.length === 12,
        item;

    height = estimateRange(rangeArray[1])- estimateRange(rangeArray[0]);    


    if(!width || typeof width !== 'number'){
        width = canvas.xaxis.estimateRange(lastElX);
    }

    width *= 1.2;

    if(!isYear){
        for (i = 1, len = rangeArray.length; i < len; ++i) {
            item = rangeArray[i];
            y = this.estimateRange(item);
            canvas.drawRect(x, y, width, height, "div-lines")
        }
    } else {


        height *= 2;
        for (i = 2, len = rangeArray.length; i < len; i += 3) {
            item = rangeArray[i];
            y = this.estimateRange(item);
            canvas.drawRect(x, y, width, i !== 2 ? height * 1.5 : height, "div-lines")
        }
    }
} // end placelabel