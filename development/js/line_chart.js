// A constructor function to renderline chart of type line
// Inheriting properties from chart base object
LineChart.prototype = Object.create(Chart.prototype);

function LineChart(renderEngine) {
    var self = this,
        event = {},
        svg = renderEngine.svg;
    // Setting up instance variables
    this.renderEngine = renderEngine; // storing the renderEngine instance
    this.plotCirclesArr = []; // A tooltip for every chart
    this.tooltip = new Tooltip();
    // Storing chart Radius
    this.plotCircleRadius = this.renderEngine.plotCircleRadius;
    // Adding events for
    this.listenerSetup(svg);
    // To be used by animations to detect current
    // line that is animating
    this.animatingLineIndex = 0;
}


// Function to setup listeners
LineChart.prototype.listenerSetup = function(svg) {
    var self = this,
        event;
    // Adding events for verticalLine
    svg.addEventListener("mousemove", function(e) {
        event = new CustomEvent(
            "mousexmovement", {
                detail: {
                    positionx: e.clientX - cumulativeOffset(svg).left
                }
            }
        );
        document.dispatchEvent(event);
    });
    // Set position x to -1 of vertical line
    // if mouseout event occurs
    svg.addEventListener("mouseout", function(e) {
        event = new CustomEvent(
            "mousexmovement", {
                detail: {
                    positionx: -1
                }
            }
        );
        document.dispatchEvent(event);
    });
    // mousexmovement will be listened by every svg 
    // as it is on the document
    document.addEventListener("mousexmovement", function(e) {
        self.behave(e.detail.positionx);
    });
} // end listenerSetup


// Public apis availaible for use
LineChart.prototype.renderData = function(xArr, yArr) { // Function to render points

    var i = 0,
        len = 0,
        xValue,
        prevXValue,
        yValue,
        prevYValue,
        line,
        lineAr = [],
        canvas = this.renderEngine,
        plotLine = canvas.plotLine.bind(canvas);

    // Number of lines will be One less that data array length
    // ;start value thus 1
    for (i = 1, len = xArr.length; i < len; ++i) {
        // Storing both current and previous value
        // for line plot 
        xValue = xArr[i];
        prevXValue = xArr[i - 1];
        yValue = yArr[i];
        prevYValue = yArr[i - 1];
        // plotting the line
        line = plotLine(prevXValue, prevYValue, xValue, yValue);
        // Saving current line to lineArray
        lineAr.push({
            line: line
        });
    }

    // Plotting circles to mark end of a line
    for (i = 0, len = xArr.length; i < len; ++i) {
        xValue = xArr[i];
        yValue = yArr[i];
        var circle = this.renderEngine.plotCircle(xValue, yValue);
        // Storing current circle with its x and y values
        // to be detected by vertical line' hover
        this.plotCirclesArr.push({
            circle: circle,
            x: circle.getAttribute("cx"),
            y: circle.getAttribute("cy"),
            xvalue: xValue,
            yvalue: yValue
        });
        // Make circle initially hidden if animation is on
        // and save it tolineArray's object
        if (lineAr[i - 1] && config.animate) {
            this.plotCirclesArr[i].circle.style.visibility = "hidden";
            lineAr[i - 1].circle = circle;
        }
    }

    // animateLine if animation enabled
    if (config.animate) {
        this.animateLine(lineAr);
    }
}

// Function to animate line if enabled by user
LineChart.prototype.animateLine = function(lineAr) {
        var canvas = this.renderEngine,
            infoAr = [],
            i = 0,
            len = lineAr.length,
            diff = 0,
            item,
            line,
            lineOb,
            pixelPerMs = 1.1; // higher is slower

        // Function to convert property to Number
        // which is string by default 
        function getProperty(el, prop) {
            return parseFloat(el.getAttribute(prop));
        }
        // Getting info for every line
        // and store it into infoAr
        for (i = 0; i < len; ++i) {
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
            item.yCount = item.xCount || parseInt((item.y2 - item.y1) * pixelPerMs);
            // Setting absolute values
            item.xCount = Math.abs(item.xCount);
            item.yCount = Math.abs(item.yCount);
            // Calculating steps
            item.stepX = (item.x2 - item.x1) / item.xCount;
            item.stepY = (item.y2 - item.y1) / (item.xCount || item.yCount);
            // saving line
            item.line = line;
            // Setting end point value to start point
            line.setAttribute("x2", item.x1);
            line.setAttribute("y2", item.y1);

            infoAr.push(item);

        }
        this.lineAnimAr = infoAr;
        // __animate__(true) marks that the function 
        // will call itself again twice
        this.__animate__(true);

    } // end animateLine

LineChart.prototype.__animate__ = function(twice) {
    var animArr = this.lineAnimAr,
        self = this.__animate__.bind(this),
        currentLine = animArr[this.animatingLineIndex],
        delay = 4;
    // If all lines' animation completed return
    if (!currentLine) {
        return;
    }
    // if current line animation comleted; goto next line
    // and remove circle's 'hidden' property
    if (!currentLine.xCount && !currentLine.yCount) {
        currentLine.circle.style.visibility = "";
        this.animatingLineIndex += 1;
    } else {
        // increase line's x point if not achieved full width
        if (currentLine.xCount > 0) {
            currentLine.xCount--;
            currentLine.ex += currentLine.stepX;
            currentLine.line.setAttribute("x2", currentLine.ex);
        }
        // increase line's y point if not achieved full height
        if (currentLine.yCount > 0) {
            currentLine.yCount--;
            currentLine.ey += currentLine.stepY;
            currentLine.line.setAttribute("y2", currentLine.ey);
        }
    }
    // Call the function again
    setTimeout(self.bind(this, false), delay);
    if (twice) {
        setTimeout(self.bind(this, false), delay);
    }
}

LineChart.prototype.behave = function(pos) {
    // Behaviour of vertical line
    // If -1 position then destroy line
    if (pos === -1 || this.__flagMouseDown__) {
        this.destroyVerticalLine();
    } else {
        this.syncVerticalLine(pos);
    }
}

// Function to highlight points that fall in drag box
LineChart.prototype.highlight = function(x1, y1, x2, y2) {

        var keyx, item,
            radius = this.renderEngine.plotCircleRadius; // getting defined radius

        for (keyx in this.plotCirclesArr) {
            item = this.plotCirclesArr[keyx];
            // Logic to find if the circle is in bos area
            if (item.x >= x1 - radius && item.x <= x2 + radius && item.y - radius <= y2 && item.y + radius >= y1) {
                // If hovered by dragbox protect state from vertical line hover
                item.hoverProtected = true;
                item.circle.setAttribute("class", "plot-circle plot-circle-hover");
            } else {
                // delete hover protection if not in drag box range
                delete item.hoverProtected;
            }
        }
    } // end highlight


LineChart.prototype.syncVerticalLine = function(x) {

    var svgTop = cumulativeOffset(this.renderEngine.svg).top, // Svg coordinates
        svgLeft = cumulativeOffset(this.renderEngine.svg).left,
        verticalLine = this.verticalLine, // Current vertical line
        canvas = this.renderEngine,
        xaxis = canvas.xaxis, // Current Axis
        yaxis = canvas.yaxis,
        convertFn = xaxis.convertValue.bind(xaxis), // Get convert function according 
        // to axis data type
        i = 0,
        circleArr = this.plotCirclesArr
        len = circleArr.length,
        item = {},
        radius = this.plotCircleRadius,
        plotData = {},
        circle = {},
        tooltipTop = 0,
        toolString = "",
        verticalLineTop = canvas.height * (1 - canvas.shiftRatioY) - canvas.marginY;

    // Dont draw margin 
    if (x < canvas.marginX) {
        return
    }

    for (i = 0; i < len; ++i) {
        item = circleArr[i];
        if (item.x <= x + radius && item.x >= x - radius) {
            plotData = item;
            verticalLineXPoint = item.xvalue;
            plotData.found = true;
            break;
        } else {
            plotData.found = false;
        }
    }

    // Vertical line; create if already not created
    if (!verticalLine) {
        this.verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        verticalLine = this.verticalLine;
        canvas.svg.appendChild(this.verticalLine);
        verticalLine.setAttribute("y1", verticalLineTop); // coordinates
        verticalLine.setAttribute("y2", canvas.height - canvas.marginY); // with shifting
        verticalLine.setAttribute("class", "vertical-line");
    }
    // If Circle found at the point higlight the circle by adding hover effect
    if (plotData.found) {
        toolString = plotData.yvalue;
        tooltipTop = this.__tooltipHeightCalulator(plotData.y, canvas.key);
        this.tooltip.show(svgTop + tooltipTop, x + (canvas.plotCircleRadius * 2) + svgLeft, toolString);
        circle = this.findCircleAtPoint(x);
        if (circle) {
            circle.setAttribute("class", "plot-circle plot-circle-hover");
        }
        for (var keyx in this.plotCirclesArr) {
            if (this.plotCirclesArr[keyx].circle !== circle && !this.plotCirclesArr[keyx].hoverProtected) {
                this.plotCirclesArr[keyx].circle.setAttribute("class", "plot-circle");
            }
        }
    } else {
        this.tooltip.hide();
    }
    verticalLine.setAttribute("x1", x - 2); // setting line
    verticalLine.setAttribute("x2", x - 2); // and styles
} // end syncverticalline

// Function to remove vertical line from svg
LineChart.prototype.destroyVerticalLine = function() {
    var keyx; 
    // destroy line only if it exists
    if (this.verticalLine) {
        this.renderEngine.svg.removeChild(this.verticalLine);
        this.verticalLine = undefined;
        this.tooltip.hide();
    }
    // If not hover protected remove hover class
    for (keyx in this.plotCirclesArr) {
        if (!this.plotCirclesArr[keyx].hoverProtected) {
            this.plotCirclesArr[keyx].circle.setAttribute("class", "plot-circle");
        }
    }
} // end crosshair

// Function to find circle that lie on the given x point
LineChart.prototype.findCircleAtPoint = function(x) {
    x = Math.floor(x);
    var i = 0,
        circleOb,
        circles = this.plotCirclesArr,
        len = circles.length,
        radius = this.plotCircleRadius;

    // Iterate over circles array; and return if circle found
    for (i = 0; i < len; ++i) {
        circleOb = circles[i];
        if (circleOb.x <= x + radius && circleOb.x >= x - radius) {
            return circleOb.circle;
        }
    }

} // findCircleAtPoint

// Tool tip height is dynamic based on position of mouse
// Normally tooltip is above mouse position 
// but in case mouse pointer is towards top of svg
// tooltip will be shown below
LineChart.prototype.__tooltipHeightCalulator = function(value) {

    var estimatedHeight = value;
    var fl = Math.floor.bind(Math);
    var top = this.renderEngine.height - estimatedHeight;

    top -= this.renderEngine.height * 0.05;
    if (top / this.renderEngine.height > 0.75) {
        top -= this.renderEngine.height * 0.25;
    }

    return top;
} // end __tooltipHeightCalculator