// A constructor function to render chart of type line
// Inheriting properties from chart base object
LineChart.prototype = Object.create(Chart.prototype);

function LineChart(renderEngine) {
    this.renderEngine = renderEngine; // storing the renderEngine instance
    this.plotCirclesObject = {};
    // A tooltip for every chart
    this.tooltip = new Tooltip();
    // Storing chart Radius
    this.plotCircleRadius = this.renderEngine.plotCircleRadius;

    // Setting up the listenser
    var _this = this;
    var event;

    this.renderEngine.svg.addEventListener("mousemove", function(e) {
        event = new CustomEvent(
            "mousexmovement", {
                detail: {
                    positionx: e.clientX - cumulativeOffset(_this.renderEngine.svg).left
                }
            }
        );
        document.dispatchEvent(event);
    });

    this.renderEngine.svg.addEventListener("mouseout", function(e) {
        event = new CustomEvent(
            "mousexmovement", {
                detail: {
                    positionx: -1
                }
            }
        );
        document.dispatchEvent(event);
    });

    var _this = this;
    document.addEventListener("mousexmovement", function(e) {
        _this.behave(e.detail.positionx);
    });

}
// Public apis availaible for use
LineChart.prototype.renderData = function(dateOfVariable, valueOfVariable) { // Function to render points

    var i, len, dateItem, prevDateItem, valueItem, prevValueItem;

    for (i = 1, len = dateOfVariable.length; i < len; ++i) {
        dateItem = dateOfVariable[i];
        prevDateItem = dateOfVariable[i - 1];
        valueItem = valueOfVariable[i];
        prevValueItem = valueOfVariable[i - 1];
        this.renderEngine.plotLine(prevDateItem, prevValueItem, dateItem, valueItem);
    }
    for (i = 0, len = dateOfVariable.length; i < len; ++i) {
        dateItem = dateOfVariable[i];
        valueItem = valueOfVariable[i];
        var circle = this.renderEngine.plotCircle(dateItem, valueItem);
        this.plotCirclesObject[Math.floor(circle.getAttribute("cx"))] = {
            circle: circle,
            y: circle.getAttribute("cy")
        }; // Storing the current circle with its x value
    }
}

LineChart.prototype.behave = function(pos) {
    if (pos === -1 || this.__flagMouseDown__) {
        this.__destroyVerticalLine();

    } else {
        this.__syncVerticalLine__(pos);
    }
}

LineChart.prototype.highlight = function(x1, y1, x2, y2) {

        var keyx, item;


        for (keyx in this.plotCirclesObject) {
            item = this.plotCirclesObject[keyx];
            if (keyx >= x1 - this.renderEngine.plotCircleRadius && keyx <= x2 + this.renderEngine.plotCircleRadius && item.y - this.renderEngine.plotCircleRadius <= y2 && item.y + this.renderEngine.plotCircleRadius  >= y1) {
                item.hoverProtected = true;
                item.circle.setAttribute("class", "plot-circle plot-circle-hover");
            } else {
                delete item.hoverProtected;
            }
        }


} // end highlight


LineChart.prototype.__syncVerticalLine__ = function(x) {

        var svgTop = cumulativeOffset(this.renderEngine.svg).top;
        var svgLeft = cumulativeOffset(this.renderEngine.svg).left;

        if (x < this.renderEngine.marginX) {
            return
        }

        // Vertical line; create if already not created
        if (!this.verticalLine) {
            this.verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            this.renderEngine.svg.appendChild(this.verticalLine);
        }
        // Tooltip position and value
        var verticalLineXPoint = this.renderEngine.getRatio(x);
        var yValue = this.renderEngine.engine.__getValueAtPosition(verticalLineXPoint, this.renderEngine.key);
        if (yValue) {
            var toolString = shortNumberExpanded(yValue.value);
            toolString += " \n " + timeInWords(verticalLineXPoint);
            var tooltipTop = this.__tooltipHeightCalulator(yValue.value, this.renderEngine.key);
            this.tooltip.show(svgTop + tooltipTop, x + (this.renderEngine.plotCircleRadius * 2) + svgLeft, toolString);
            var circle = this.__findCircleAtPoint(x);
            if (circle) {
                circle.setAttribute("class", "plot-circle plot-circle-hover");
            } else {}
            for (var keyx in this.plotCirclesObject) {
                if (this.plotCirclesObject[keyx].circle !== circle && !this.plotCirclesObject[keyx].hoverProtected) {
                    this.plotCirclesObject[keyx].circle.setAttribute("class", "plot-circle");
                }
            }
        }
        var verticalLineTop = this.renderEngine.height * (1 - this.renderEngine.shiftRatioY) - this.renderEngine.marginY;
        this.verticalLine.setAttribute("x1", x - 2); // setting line
        this.verticalLine.setAttribute("y1", verticalLineTop); // coordinates
        this.verticalLine.setAttribute("x2", x); // and styles
        this.verticalLine.setAttribute("y2", this.renderEngine.height - this.renderEngine.marginY); // with shifting
        this.verticalLine.setAttribute("class", "vertical-line");
    } // end syncverticalline

LineChart.prototype.__destroyVerticalLine = function() {

        if (this.verticalLine) {
            this.renderEngine.svg.removeChild(this.verticalLine);
            this.verticalLine = undefined;
            this.tooltip.hide();
        }
        for (var keyx in this.plotCirclesObject) {
            if (!this.plotCirclesObject[keyx].hoverProtected) {
                this.plotCirclesObject[keyx].circle.setAttribute("class", "plot-circle");
            }
        }
    } // end crosshair

LineChart.prototype.__findCircleAtPoint = function(x) {

        x = Math.floor(x);
        var i;


        for (i = x - this.plotCircleRadius; i <= x + this.plotCircleRadius; ++i) {
            if (this.plotCirclesObject[i]) {
                return this.plotCirclesObject[i].circle;
            }
        }

    } // __findCircleAtPoint

LineChart.prototype.__tooltipHeightCalulator = function(value, key) {

        var estimatedHeight = this.renderEngine.yaxis.estimateRange(value);
        var fl = Math.floor.bind(Math);
        var top = this.renderEngine.height - estimatedHeight;

        top -= this.renderEngine.height * 0.05;
        if (top / this.renderEngine.height > 0.75) {
            top -= this.renderEngine.height * 0.25;
        }

        return top;
    } // end __tooltipHeightCalculator
