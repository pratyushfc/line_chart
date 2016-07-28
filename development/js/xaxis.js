// XAxis inherited from Axis
XAxis.prototype = Object.create(Axis.prototype);
XAxis.prototype.constructor = XAxis;

function XAxis(dimension, shrink, rangeOb){
	Axis.call(this, dimension, shrink, rangeOb);
}


XAxis.prototype.placeLabel = function(canvas, isLabelTop){
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
        stringTime = timeInWords(item);

        this.labelArray[i] = canvas.__placeText(x, y, stringTime, "axis-label xaxis-label", null, alignment);
    }
}

XAxis.prototype.removeLabel = function(canvas){
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
