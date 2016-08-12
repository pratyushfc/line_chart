// A constructor function to renderline chart of type line
// Inheriting properties from chart base object
LineChart.prototype = Object.create(Chart.prototype);

function LineChart(renderEngine) {
    this.renderEngine = renderEngine; // storing the renderEngine instance
    this.plotCirclesObject = [];
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
        this.plotCirclesObject.push({
            circle: circle,
            x : circle.getAttribute("cx"),
            y: circle.getAttribute("cy")
        }); // Storing the current circle with its x value
    }
}

LineChart.prototype.behave = function(pos) {
    if (pos === -1 || this.__flagMouseDown__) {
        this.destroyVerticalLine();

    } else {
        this.syncVerticalLine(pos);
    }
}

LineChart.prototype.highlight = function(x1, y1, x2, y2) {

        var keyx, item,
            radius = this.renderEngine.plotCircleRadius;

        for (keyx in this.plotCirclesObject) {
            item = this.plotCirclesObject[keyx];
            if (item.x >= x1 - radius && item.x <= x2 + radius && item.y - radius <= y2 && item.y + radius  >= y1) {
                item.hoverProtected = true;
                item.circle.setAttribute("class", "plot-circle plot-circle-hover");
            } else {
                delete item.hoverProtected;
            }
        }


} // end highlight


LineChart.prototype.syncVerticalLine = function(x) {

        var svgTop = cumulativeOffset(this.renderEngine.svg).top,
            svgLeft = cumulativeOffset(this.renderEngine.svg).left,
            verticalLine = this.verticalLine,
            canvas = this.renderEngine,
            xaxis = canvas.xaxis,
            yaxis = canvas.yaxis,
            convertFn = xaxis.convertValue.bind(xaxis),
        // Tooltip position and value
            verticalLineXPoint = canvas.getRatio(x),
            yValue = canvas.engine.getValueAtPosition({
            point : verticalLineXPoint, 
            convertFn : convertFn,
            key : this.renderEngine.key,
            readFn : xaxis.readFn.bind(xaxis)
        });

        if (x < this.renderEngine.marginX) {
            return
        }

        // Vertical line; create if already not created
        if (!verticalLine) {
            this.verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            verticalLine = this.verticalLine;
            this.renderEngine.svg.appendChild(this.verticalLine);
        }
        
        if (yValue) {
            var toolString = yaxis.convertValue(yValue.value);
            toolString += " \n " + timeInWords(verticalLineXPoint);
            var tooltipTop = this.__tooltipHeightCalulator(yValue.value, this.renderEngine.key);
            this.tooltip.show(svgTop + tooltipTop, x + (this.renderEngine.plotCircleRadius * 2) + svgLeft, toolString);
            var circle = this.findCircleAtPoint(x);
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
        verticalLine.setAttribute("x1", x - 2); // setting line
        verticalLine.setAttribute("y1", verticalLineTop); // coordinates
        verticalLine.setAttribute("x2", x); // and styles
        verticalLine.setAttribute("y2", this.renderEngine.height - this.renderEngine.marginY); // with shifting
        verticalLine.setAttribute("class", "vertical-line");
    } // end syncverticalline

LineChart.prototype.destroyVerticalLine = function() {

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

LineChart.prototype.findCircleAtPoint = function(x) {

        x = Math.floor(x);
        var i = 0,
            circleOb,
            circles = this.plotCirclesObject,
            len = circles.length,
            radius = this.plotCircleRadius;


        for (i = 0; i < len; ++i) {
            circleOb = circles[i];
            if (circleOb.x <= x + radius && circleOb.x >= x - radius) {
                return circleOb.circle;
            }
        }

    } // findCircleAtPoint

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
