function ColumnChart(renderEngine, columnWidth) {
    this.renderEngine = renderEngine; // storing the renderEngine instance
    // A tooltip for every chart
    this.tooltip = new Tooltip();
    this.columnWidth = columnWidth;

    this.columnsObject = []; // object to store all columns
}

// Inheriting properties from chart base object
ColumnChart.prototype = Object.create(Chart.prototype);
ColumnChart.prototype.constructor = ColumnChart;

// Public apis availaible for use
ColumnChart.prototype.renderData = function(xValueArr, yValueArr) { // Function to render points

    var i, len, xyValueItem, yValueItem,
        x,
        y,
        rect,
        canvas = this.renderEngine,
        xaxis = canvas.xaxis,
        yaxis = canvas.yaxis,
        rectAr = [],
        svg = this.renderEngine.svg;

    for (i = 0, len = xValueArr.length; i < len; ++i) {
        xyValueItem = xValueArr[i];
        yValueItem = yValueArr[i];
        x = xaxis.estimateRange(xyValueItem) - (this.columnWidth / 2);
        y = yaxis.estimateRange(yValueItem);
        rect = canvas.drawRect(x, y, this.columnWidth, y, "data-column");
        // Saving all drawn rectangles for animation
        rectAr.push(rect);
        // Saving rectangle with x and y attributes
        // for higlight purpose
        this.columnsObject.push({
            x1: Math.floor(rect.getAttribute("x")),
            x2: Math.floor(Number(rect.getAttribute("x")) + this.columnWidth),
            y: Math.floor(rect.getAttribute("y")),
            value: yValueItem,
            element: rect
        });

        // Setting up the listeners
        var event;
        var _this = this;
        rect.addEventListener("mousemove", function(e) {
            event = new CustomEvent(
                "columnover", {
                    detail: {
                        positionx: e.clientX - cumulativeOffset(svg).left,
                        positiony: e.pageY - cumulativeOffset(svg).top
                    }
                }
            );
            // Throwing event to document for every column
            // to listen
            document.dispatchEvent(event);
        });

        rect.addEventListener("mouseout", function(e) {
            event = new CustomEvent(
                "columnover", {
                    detail: {
                        positionx: -1,
                        positiony: -1
                    }
                }
            );
            document.dispatchEvent(event);
        });

        document.addEventListener("columnover", function(e) {
            _this.behaveColumnOver(e.detail.positionx, e.detail.positiony);
        });

    }
    if (config.animate) {
        this.__animate__(rectAr);
    }
}

// Function to animate column
ColumnChart.prototype.__animate__ = function(rectAr) {
        var i = 0,
            len = rectAr.length,
            infoAr = [],
            item = {},
            speed = 5;
        // Get property of element in float
        function getProperty(el, prop) {
            return parseFloat(el.getAttribute(prop));
        }
        // Get all rect info and save in infoAr 
        for (i = 0; i < len; ++i) {
            item = {};
            item.rect = rectAr[i];
            item.height = getProperty(item.rect, "height");
            item.y = getProperty(item.rect, "y");
            item.currentHeight = 0;
            item.currentY = item.y + item.height;
            item.count = parseInt(item.height / speed);
            item.steps = (item.height / item.count);
            item.rect.setAttribute("height", "0");
            infoAr.push(item);
        }
        this.__transition__(infoAr, true);
    } // end __animate__
    // Function to show the transition
ColumnChart.prototype.__transition__ = function(infoAr, repeat) {
        var i = infoAr.length,
            item = {},
            loop = false,
            self = this.__transition__.bind(this, infoAr),
            // selfR will call iteself again multiple time;
            // making animation speed accelerate heavily
            selfR = this.__transition__.bind(this, infoAr, true),
            time = 30;
        while (i--) {
            item = infoAr[i];
            // console.log(i, item)
            if (item.count) {
                item.count--;
                item.currentHeight += item.steps;
                item.currentY -= item.steps;
                //if(this.renderEngine.key === "population") console.log(i, item.currentHeight, item.steps, item.count)
                item.rect.setAttribute("height", item.currentHeight);
                item.rect.setAttribute("y", item.currentY);
                if (item.count) {
                    loop = true;
                }
            }
        }
        // If not ended and repeat is set to true
        // accelerate speed of animation
        if (loop && repeat) {
            setTimeout(self, time);
            setTimeout(self, time);
            setTimeout(selfR, time);
            setTimeout(selfR, time);
        }
    } //end transition

// Function to highlight data in dragbox based on point coordinates
ColumnChart.prototype.highlight = function(x1, y1, x2, y2) {
        var i, len, item,
            isLeftInRange, isRightInRange, isTopInRange;
        // Iterating over all columns
        for (i = this.columnsObject.length; i--;) {
            item = this.columnsObject[i];
            // Checking if current column is in range
            isLeftInRange = item.x1 >= x1 && item.x1 <= x2;
            isRightInRange = item.x2 >= x1 && item.x2 <= x2;
            isTopInRange = item.y <= y2;
            if (isTopInRange && (isLeftInRange || isRightInRange)) {
                item.element.setAttribute("class", "data-column data-column-hover");
                // Protect from normal hover and hover out
                item.hoverProtected = true;
            } else {
                delete item.hoverProtected;
                item.element.setAttribute("class", "data-column");
            }
        }
    } // end highlight

// Event listener function, decide how to behave based on position
ColumnChart.prototype.behaveColumnOver = function(x, y) {
        if (x === -1) {
            this.__loseFocus__();
        } else {
            this.__focus__(x, y);
        }
    } // end behaveColumnOver

// Function to focus column that lie in the mouse pointer range
ColumnChart.prototype.__focus__ = function(x, y) {
    // Calculating svg coordinates
    var svgTop = cumulativeOffset(this.renderEngine.svg).top,
        svgLeft = cumulativeOffset(this.renderEngine.svg).left,
        i = 0, // For iterations
        len = 0,
        toolString = "",
        tooltipTop = 0,
        keyx = "",
        isHovered;

    // Boundary check
    if (x < this.renderEngine.marginX) {
        return
    }

    // Find rectanges at x point
    var rectAr = this.findRectAtPoint(x);
    if (rectAr.length) {
        // Iterate over found rectangles
        for (i = 0, len = rectAr.length; i < len; ++i) {
            rect = rectAr[i];
            // Setting hover class for all columns
            rect.element.setAttribute("class", "data-column data-column-hover");
            toolString = (rect.value);
            tooltipTop = y;
            if (rect.element.getAttribute("y") > tooltipTop + 5) {
                tooltipTop = Number(rect.element.getAttribute("y")) - 5;
            }
            // Showing tooltip little below mouse pointer
            this.tooltip.show(tooltipTop + svgTop + 8, x + svgLeft, toolString);
        }
    }
    for (keyx in this.columnsObject) {
        isHovered = false;
        for (i = 0, len = rectAr.length; i < len; ++i) {
            rect = rectAr[i];
            if (this.columnsObject[keyx] === rect) {
                isHovered = true;
            }
        }
        // All columns that are not hovered; set class to data-column;
        // Helps in removing previously hovered column
        if (!isHovered && !this.columnsObject[keyx].hoverProtected) {
            this.columnsObject[keyx].element.setAttribute("class", "data-column");
        }
    }

} // end syncverticalline

ColumnChart.prototype.__loseFocus__ = function() {
        // Remove hover from all columns
        this.tooltip.hide();
        for (var keyx in this.columnsObject) {
            if (!this.columnsObject[keyx].hoverProtected) {
                this.columnsObject[keyx].element.setAttribute("class", "data-column");
            }

        }
    } // end crosshair

// Find rectangle at point x
ColumnChart.prototype.findRectAtPoint = function(x) {
        var i, arr = [];
        x = Math.floor(x);
        for (i in this.columnsObject) {
            var item = this.columnsObject[i];
            if (x >= item.x1 && x <= item.x2) {
                arr.push(item);
            }
        }
        return arr;
    } // __findCircleAtPoint

ColumnChart.prototype.tooltipHeightCalulator = function(value, key) {
    var estimatedHeight = this.renderEngine.yRangeEstimator(value),
        fl = Math.floor.bind(Math),
        top = this.renderEngine.height - estimatedHeight;

    top -= this.renderEngine.height * 0.05;
    if (top / this.renderEngine.height > 0.75) {
        top -= this.renderEngine.height * 0.25;
    }
    return top;
} // end __tooltipHeightCalculator