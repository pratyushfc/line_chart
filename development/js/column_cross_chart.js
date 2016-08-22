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

    var i, 
        len, 
        dateItem, 
        valueItem, 
        color, 
        canvas = this.renderEngine,
        rectAr = [];

    if(!arr){
        return;
    }

    for (i = 0, len = arr.length; i < len; ++i) {
        dateItem = arr[i].sale;
        valueItem = arr[i].name;
        var profit = arr[i].profit || 0;
        color = colorFunction(profit);
        var x0 = 0;
        var x = canvas.xaxis.estimateRange(dateItem);
        var y = canvas.yaxis.estimateRange(valueItem) + (this.columnWidth / 2);
        var h = x;
        if(h < 1){
            h = 1;
        }
        var rect = canvas.drawRect(x0, y, h, this.columnWidth, "data-column-cross", color);
        rectAr.push(rect);
        this.columnsObject.push({
            x1: Math.floor(rect.getAttribute("x")),
            x2: Math.floor(Number(rect.getAttribute("x")) + this.columnWidth),
            y: Math.floor(rect.getAttribute("y")),
            value: valueItem,
            element: rect
        });
    }
    if(config.animate){
        this.__animate__(rectAr);
    }
}
ColumnCrossChart.prototype.__animate__ = function(rectAr) {
    var i = 0,
        len = rectAr.length,
        infoAr = [],
        item = {},
        speed = 5;

    function getProperty(el, prop){
        return parseFloat(el.getAttribute(prop));
    }

    for(i = 0; i < len; ++i){
        item = {};
        item.rect = rectAr[i];
        item.width = getProperty(item.rect, "width");
        item.x = getProperty(item.rect, "x");
        item.currentwidth = 0;
        item.currentX = item.x;
        item.count = parseInt(item.width / speed);
        item.steps = (item.width / item.count);
        item.rect.setAttribute("width", "0");
        infoAr.push(item);
    }
    this.__transition__(infoAr, true);
}   // end __animate__

ColumnCrossChart.prototype.__transition__ = function(infoAr, repeat) {
    var i = infoAr.length,
        item = {},
        loop = false,
        self = this.__transition__.bind(this, infoAr),
        selfR = this.__transition__.bind(this, infoAr, true),
        time = 30;
    while(i--){
        item = infoAr[i];
        // console.log(i, item)
        if(item.count){
            item.count--;
            item.currentwidth += item.steps;
            item.rect.setAttribute("width", item.currentwidth);
            if(item.count){
                loop = true;
            }
        }
    }

    if(loop && repeat){
        setTimeout(self, time);
        setTimeout(self, time);
        setTimeout(selfR, time);
        setTimeout(selfR, time);
    }
} //end transition