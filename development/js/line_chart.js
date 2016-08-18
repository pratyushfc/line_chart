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

    var i = 0, 
        len = 0,
        dateItem, 
        prevDateItem, 
        valueItem, 
        prevValueItem,
        line,
        lineAr  = [];

    for (i = 1, len = dateOfVariable.length; i < len; ++i) {
        dateItem = dateOfVariable[i];
        prevDateItem = dateOfVariable[i - 1];
        valueItem = valueOfVariable[i];
        prevValueItem = valueOfVariable[i - 1];
        line = this.renderEngine.plotLine(prevDateItem, prevValueItem, dateItem, valueItem);
        lineAr.push({line : line});
    }
    for (i = 0, len = dateOfVariable.length; i < len; ++i) {
        dateItem = dateOfVariable[i];
        valueItem = valueOfVariable[i];
        var circle = this.renderEngine.plotCircle(dateItem, valueItem);
        this.plotCirclesObject.push({
            circle: circle,
            x : circle.getAttribute("cx"),
            y: circle.getAttribute("cy"),
            xvalue : dateItem,
            yvalue : valueItem
        }); // Storing the current circle with its values
        if(lineAr[i - 1] && config.animate){
            this.plotCirclesObject[i].circle.style.visibility = "hidden";
            lineAr[i - 1].circle = circle;
        }
    }

    // animateLine
    if(config.animate){
        this.animateLine(lineAr);
    }
}

LineChart.prototype.animateLine = function(lineAr) {
    var canvas = this.renderEngine,
        infoAr = [],
        i = 0,
        len = lineAr.length,
        diff = 0,
        item,
        line,
        animTime = 2000,
        steps = 100,
        lineOb,
        pixelPerMs = 1;

    function getProperty(el, prop){
        return parseFloat(el.getAttribute(prop));
    }
    // Getting info for every line
    for(i = 0; i < len; ++i){
        item = {};
        lineOb = lineAr[i];
        line = lineOb.line;
        // Getting line properties
        item.x1 = getProperty(line, "x1");
        item.x2 = getProperty(line, "x2");
        item.y1 = getProperty(line, "y1");
        item.y2 = getProperty(line, "y2");
        // setting circle
        item.circle = lineOb.circle;
        // setting end point to start points
        item.ex = item.x1;
        item.ey = item.y1;
        // saving steps
        item.xCount = parseInt((item.x2 - item.x1) * pixelPerMs);
        item.yCount = parseInt((item.y2 - item.y1) * pixelPerMs);
        // Setting absolute values
        item.xCount = Math.abs(item.xCount);
        item.yCount = Math.abs(item.yCount);
        // Calculating steps
        item.stepX = (item.x2 - item.x1) / item.xCount;
        item.stepY = (item.y2 - item.y1) / item.yCount;
        console.log(item.stepX, item.stepY, item.xCount, item.yCount)
        // saving line
        item.line = line;
        // Setting end point value to start point
        line.setAttribute("x2", item.x1);
        line.setAttribute("y2", item.y1);

        infoAr.push(item);
        
    }
    this.lineAnimAr = infoAr;
    this.__animate__(true);

}   // end animateLine

LineChart.prototype.__animate__ = function(twice){
    if(this.animatingLineIndex === undefined){
        this.animatingLineIndex = 0;
    }
    var animArr = this.lineAnimAr,
        self = this.__animate__.bind(this), 
        currentLine = animArr[this.animatingLineIndex];

    if(!currentLine){
        return;
    }
    if(!currentLine.xCount && !currentLine.yCount){
        currentLine.circle.style.visibility = "";
        this.animatingLineIndex += 1;
    } else {
        if(currentLine.xCount > 0){
            currentLine.xCount--;
            currentLine.ex += currentLine.stepX;
            currentLine.line.setAttribute("x2", currentLine.ex);
        }
        if(currentLine.yCount > 0){
            currentLine.yCount--;
            currentLine.ey += currentLine.stepY;
            currentLine.line.setAttribute("y2", currentLine.ey);
        }
    }

    setTimeout(self.bind(this, false), 1);
    if(twice){
        setTimeout(self.bind(this, false), 1);
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
