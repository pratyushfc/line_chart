// YAxis inherited from Axis
YAxis.prototype = Object.create(Axis.prototype);
YAxis.prototype.constructor = YAxis;
// Yaxis simply uses all functions of Axis and jus sets the isVertical 
// property to true
function YAxis(ob) {
    ob.isVertical = true;
    Axis.call(this, ob);
}


// Place div boxes
YAxis.prototype.placeDivBoxes = function(canvas) {
    var i = 0,
        len = 0,
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

    height = estimateRange(rangeArray[1]) - estimateRange(rangeArray[0]);


    if (!width || typeof width !== 'number') {
        width = canvas.xaxis.estimateRange(lastElX);
    }
    // expand to full svg width
    width *= 1.2;

    if (!isYear) {
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