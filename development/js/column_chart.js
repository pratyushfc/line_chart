function ColumnChart(renderEngine, columnWidth) {
    this.renderEngine = renderEngine; // storing the renderEngine instance
    // A tooltip for every chart
    this.tooltip = new Tooltip();
    this.columnWidth = columnWidth;

    this.columnsObject = []; // object to store all columns
}

// Inheriting properties from chart base object
ColumnChart.prototype = Object.create(Chart.prototype);


// Public apis availaible for use
ColumnChart.prototype.renderData = function(dateOfVariable, valueOfVariable) { // Function to render points

    var i, len, dateItem, valueItem;

    for (i = 0, len = dateOfVariable.length; i < len; ++i) {
        dateItem = dateOfVariable[i];
        valueItem = valueOfVariable[i];
        var x = this.renderEngine.xaxis.estimateRange(dateItem) - (this.columnWidth / 2);
        var y = this.renderEngine.yaxis.estimateRange(valueItem);
        var rect = this.renderEngine.drawRect(x, y, this.columnWidth, y, "data-column");

        this.columnsObject.push({
            x1: Math.floor(rect.getAttribute("x")),
            x2: Math.floor(Number(rect.getAttribute("x")) + this.columnWidth),
            y: Math.floor(rect.getAttribute("y")),
            value: valueItem,
            element: rect
        });

        // Setting up the listeners
        var event;
        var _this = this;
        rect.addEventListener("mousemove", function(e) {
            event = new CustomEvent(
                "columnover", {
                    detail: {
                        positionx: e.clientX - cumulativeOffset(_this.renderEngine.svg).left,
                        positiony: e.pageY - cumulativeOffset(_this.renderEngine.svg).top
                    }
                }
            );
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
}

ColumnChart.prototype.highlight = function(x1, y1, x2, y2) {



        var i, len, item;

        var isLeftInRange, isRightInRange, isTopInRange;

        for (i = this.columnsObject.length; i--;) {
            item = this.columnsObject[i];

            isLeftInRange = item.x1 >= x1 && item.x1 <= x2;
            isRightInRange = item.x2 >= x1 && item.x2 <= x2;
            isTopInRange = item.y <= y2;
            if (isTopInRange && (isLeftInRange || isRightInRange)) {
                item.element.setAttribute("class", "data-column data-column-hover");
                item.hoverProtected = true;
            } else {
                delete item.hoverProtected;
                item.element.setAttribute("class", "data-column");
            }

        }


    } // end highlight

ColumnChart.prototype.behaveColumnOver = function(pos, y) {
        if (pos === -1) {
            this.__loseFocus__();

        } else {
            this.__focus__(pos, y);
        }
    } // end behaveColumnOver

// private functions for inner usage
ColumnChart.prototype.__focus__ = function(x, y) {

        var svgTop = cumulativeOffset(this.renderEngine.svg).top;
        var svgLeft = cumulativeOffset(this.renderEngine.svg).left;

        if (x < this.renderEngine.marginX) {
            return
        }


        var rect = this.__findRectAtPoint(x);
        if (rect) {
            rect.element.setAttribute("class", "data-column data-column-hover");

            var toolString = shortNumberExpanded(rect.value);

            var tooltipTop = y;
            if (rect.element.getAttribute("y") > tooltipTop + 5) {
                tooltipTop = Number(rect.element.getAttribute("y")) - 5;
            }
            // toolString += " \n " + timeInWords(verticalLineXPoint);
            this.tooltip.show(tooltipTop + svgTop + 8, x + svgLeft, toolString);


        } else {}
        for (var keyx in this.columnsObject) {
            if (this.columnsObject[keyx] !== rect && !this.columnsObject[keyx].hoverProtected) {
                this.columnsObject[keyx].element.setAttribute("class", "data-column");
            }
        }

    } // end syncverticalline

ColumnChart.prototype.__loseFocus__ = function() {


        this.tooltip.hide();
        for (var keyx in this.columnsObject) {
            if (!this.columnsObject[keyx].hoverProtected) {
                this.columnsObject[keyx].element.setAttribute("class", "data-column");
            }

        }
    } // end crosshair
ColumnChart.prototype.__findRectAtPoint = function(x) {

        x = Math.floor(x);
        var i;


        for (i in this.columnsObject) {
            var item = this.columnsObject[i];
            if (x >= item.x1 && x <= item.x2) {
                return item
            }
        }

    } // __findCircleAtPoint

ColumnChart.prototype.__tooltipHeightCalulator = function(value, key) {

        var estimatedHeight = this.renderEngine.yRangeEstimator(value);
        var fl = Math.floor.bind(Math);
        var top = this.renderEngine.height - estimatedHeight;

        top -= this.renderEngine.height * 0.05;
        if (top / this.renderEngine.height > 0.75) {
            top -= this.renderEngine.height * 0.25;
        }

        return top;
    } // end __tooltipHeightCalculator