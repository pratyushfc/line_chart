// YAxis inherited from Axis
YAxis.prototype = Object.create(Axis.prototype);
YAxis.prototype.constructor = YAxis;

function YAxis(ob){
    ob.isVertical = true;
	Axis.call(this, ob);
}


YAxis.prototype.placeDivBoxes = function(canvas){
    var i = 0, len = 0,
        x = canvas.xaxis.estimateRange(0),
        y = 5,
        width = (canvas.xaxis.max),
        height = this.estimateRange(this.rangeArray[1]) - this.estimateRange(this.rangeArray[0]),
        item,
        rangeArray = this.__getRangeArray__();

    if(this.isVertical){
        for (i = 1, len = rangeArray.length; i < len; ++i) {
            item = Math.round(rangeArray[i]);
            y = this.estimateRange(item);

            canvas.drawRect(x, y, width, height, "div-lines")
        }
    }
} // end placelabel