// XAxisCross inherited from Axis
XAxisCross.prototype = Object.create(Axis.prototype);
XAxisCross.prototype.constructor = XAxisCross;

function XAxisCross(dimension, shrink, rangeOb){
	Axis.call(this, dimension, shrink, rangeOb);
}

XAxisCross.prototype.__getRangeArray__ = function(){
	    var i, j, temp,
        	rangeArray = [], 			// final range array that the
        								// function will return
        	beautyLimits = this.__beautifyLimits__(),
        	calcMin = beautyLimits.min,
        	calcMax = beautyLimits.max,
        	computedMin = 0, computedMax = 0, 	// variable to store final limits of
        								// calculated range
        	difference = 0,
        	steps = 0, 						// Variable to store steps from
        								// min to max

        	twoDigitMin = 0, twoDigitMax = 0, 	// Variables to store leading
        								// two digits of max and min

        	stepsDown = 0, 				// A variable to store how
        								// many divisions were made
            twoDigitMax = calcMax;

        // Algo started

        if(this.rangeArray){
            return this.rangeArray;
        }

        if (calcMin === calcMax) {
            this.rangeArray = [calcMin * 2, calcMin, 0];
            return this.rangeArray;
        }

        while (twoDigitMax > 99 || twoDigitMax < -99) {
            twoDigitMax /= 10;
            ++stepsDown;
        }

        twoDigitMin = Math.floor((calcMin * 100) / (Math.pow(10, stepsDown))) / 100;


        while (twoDigitMin > 99 || twoDigitMin < -99) {
            twoDigitMin /= 10;
            twoDigitMax /= 10;
            ++stepsDown;
        }

        difference = twoDigitMax - twoDigitMin;

        if (difference <= 0.3) {
            steps = 0.05;
        } else if (difference <= 1) {
            steps = 0.2;
        } else if (difference <= 3) {
            steps = 0.5;
        } else if (difference <= 6) {
            steps = 1;
        } else if (difference <= 12) {
            steps = 2;
        } else if (difference <= 20) {
            steps = 4;
        } else if (difference <= 30) {
            steps = 5;
        } else if (difference <= 40) {
            steps = 7;
        } else {
            steps = 10;
        }

        computedMin = Math.floor(twoDigitMin / steps) * steps;
        computedMax = Math.ceil(twoDigitMax / steps) * steps;

        // Step up; Multiplying the value to min-max that was divided before

        steps *= Math.pow(10, stepsDown);
        computedMin *= Math.pow(10, stepsDown);
        computedMax *= Math.pow(10, stepsDown);

        temp = computedMin;

        // Setting new global min and max

        while (temp <= computedMax) {
            temp = Math.round(temp * 100) / 100;
            rangeArray.push(temp);
            temp += steps;
        }
        this.rangeArray = rangeArray;

        this.min = this.rangeArray[0];
        this.max = this.rangeArray[this.rangeArray.length - 1];
        return rangeArray;
}

XAxisCross.prototype.__beautifyLimits__ = function(){
	var minValue = this.min;
    var maxValue = this.max;

    if (minValue === maxValue) {
        return {
            min: minValue,
            max: maxValue
        }
    }

    var difference = maxValue - minValue;
    var difference2 = maxValue - minValue;
    // Algorithm to get more good looking ranges

    var numDig = numberOfDigits(difference);

    while (difference2 < 1) {
        numDig -= 1;
        difference2 *= 10;
    }

    var beautyNumber = Math.pow(10, (numDig - 2)) * 5;

    minValue = Math.floor(minValue / beautyNumber) * beautyNumber;

    if ((difference / maxValue) > 0.1) {
        var newBeautyNumber = Math.pow(10, numberOfDigits(maxValue) - 2);
        beautyNumber = beautyNumber > newBeautyNumber ? beautyNumber : newBeautyNumber;
    }

    maxValue = Math.ceil(maxValue / beautyNumber) * beautyNumber;
    return {
        min: minValue,
        max: maxValue
    };
}

XAxisCross.prototype.placeLabel = function(canvas, isLabelTop){
    var i = 0, len = 0,
        x = 0,
        y = 0,
        newx = 0,
        newy = 0,
        stringTime = "",
        item,
        rangeArray = this.__getRangeArray__(),
        alignment = "center-horizontal down";


    if (!this.labelArray) {
        this.labelArray = [];
    }

    if (isLabelTop){
        y = canvas.yaxis.shrink * this.height;
        alignment = "center-horizontal up";
    }
    for (i = 0, len = rangeArray.length; i < len; ++i) {
        item = Math.round(rangeArray[i]);
        x = this.estimateRange(item);
        stringTime = shortNumber(item);
        this.labelArray[i] = canvas.__placeText(x, y, stringTime, "axis-label YAxisCross-label", null, alignment);
    }
}
