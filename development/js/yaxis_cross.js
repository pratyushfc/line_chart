// YAxisCross inherited from Axis
YAxisCross.prototype = Object.create(Axis.prototype);
YAxisCross.prototype.constructor = YAxisCross;

function YAxisCross(dimension, shrink, rangeArray){
    Axis.call(this, dimension, shrink, {min : 0, max : rangeArray.length - 1}, true);
    this.rangeArray = rangeArray;
}

// Function to estimate actual graph positions from value
YAxisCross.prototype.estimateRange = function(num){
    var ratio = (num + 0.5) / this.rangeArray.length;   // Estimating ratio
    // Getting actual positions on chart
     return this.shrink * ratio * this.height;
}   // end estimateRange

YAxisCross.prototype.__getRangeArray__ = function(divisions){       // Function to get array of range with
                                                        // optional divisions parameter for number of
                                                        // divisions on axis
    if(this.rangeArray){
        return this.rangeArray;
    }
} //get __getRangeArray__


YAxisCross.prototype.placeLabel = function(canvas){
    var i = 0, len = 0,
        x = 0,
        y = 0,
        newx = 0,
        newy = 0,
        textLabel = "",
        item,
        rangeArray = this.__getRangeArray__(),
        alignment = "left-horizontal center-horizontal half-center-vertical";

    if (!this.labelArray) {
        this.labelArray = [];
    }

    for (i = 0, len = rangeArray.length; i < len; ++i) {
        item = (rangeArray[i]);
        y = this.estimateRange(i);
        textLabel = item;
        this.labelArray[i] = canvas.__placeText(x, y, textLabel, "axis-label XAxisCross-label", null, alignment);
    }
} // end placelabel

YAxisCross.prototype.removeLabel = function(canvas){
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

YAxisCross.prototype.placeDivBoxes = function(canvas){
} // end placelabel

YAxisCross.prototype.plotTicks = function(canvas){

    var rangeArray = this.__getRangeArray__(),  // getting ticks values
        i, len, item,
        x1, x2,     // Variables to store
        y1, y2;     // dimensions

    for (i = 0, len = rangeArray.length; i < len; ++i) {
        item = rangeArray[i];
        x1 = -6;
        x2 =  0;
        y1 = this.estimateRange(i);  
        y2 = y1;
        canvas.drawLine(x1, y1, x2, y2, "ticks");
    }
} // end plotTicks