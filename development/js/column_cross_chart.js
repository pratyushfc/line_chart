function ColumnCrossChart(renderEngine, columnWidth) {
    this.renderEngine = renderEngine; // storing the renderEngine instance
    // A tooltip for every chart
    this.columnWidth = columnWidth;

    this.columnsObject = []; // object to store all columns
}

// Inheriting properties from chart base object
ColumnCrossChart.prototype = Object.create(Chart.prototype);


// Public apis availaible for use
ColumnCrossChart.prototype.renderData = function(arr, colorFunction) { // Function to render points

    var i, len, dateItem, valueItem, color;

    if(!arr){
        return;
    }

    for (i = 0, len = arr.length; i < len; ++i) {
        dateItem = arr[i].sale;
        valueItem = arr[i].name;
        var profit = arr[i].profit || 0;
        color = colorFunction(profit);
        var x0 = 0;
        var x = this.renderEngine.xaxis.estimateRange(dateItem);
        var y = this.renderEngine.yaxis.estimateRange(valueItem) + (this.columnWidth / 2);
        var rect = this.renderEngine.drawRect(x0, y, x, this.columnWidth, "data-column-cross", color);

        this.columnsObject.push({
            x1: Math.floor(rect.getAttribute("x")),
            x2: Math.floor(Number(rect.getAttribute("x")) + this.columnWidth),
            y: Math.floor(rect.getAttribute("y")),
            value: valueItem,
            element: rect
        });
    }
}
