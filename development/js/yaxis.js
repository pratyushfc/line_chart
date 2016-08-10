// YAxis inherited from Axis
YAxis.prototype = Object.create(Axis.prototype);
YAxis.prototype.constructor = YAxis;

function YAxis(ob){
    ob.isVertical = true;
	Axis.call(this, ob);
}


YAxis.prototype.placeDivBoxes = function(canvas){
    var i = 0, len = 0,
        x = 0,
        y = 5,
        readFn = this.readFn,
        rangeArray = this.rangeArray,
        width = (canvas.xaxis.max),
        estimateRange = this.estimateRange.bind(this),
        height = 0,
        item;

    height = estimateRange(rangeArray[1])- estimateRange(rangeArray[0]);    

    for (i = 1, len = rangeArray.length; i < len; ++i) {
        item = rangeArray[i];
        y = this.estimateRange(item);
        canvas.drawRect(x, y, width, height, "div-lines")
    }

} // end placelabel