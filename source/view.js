function RenderEngine(engine, selector, width, height, name, isTop) {

    this.isLabelTop = isTop;
    this.engine = engine;
    this.key = name;
    width = width ? width : 600;
    height = height ? height : 500;

    this.rootElement = document.getElementById(selector); // getting parent element

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // creating canvas				// getting the canvas that was created
    this.svg.setAttribute("height", height);
    this.svg.setAttribute("width", width);
    this.svg.setAttribute("class", "chart");

    this.rootElement.appendChild(this.svg); // adding our canvas to parent element

    this.width = width; // Storing height and width
    this.height = height; // for future uses
    this.marginX = 0.1 * this.width; // Margin will be used for labels
    // and ticks
    if (!this.isLabelTop) {
        this.marginY = 0.1 * this.height;
    } else {
        this.marginY = 0.2 * this.height;
    }
    this.shiftRatioX = 0.83; // Shifting values for better
    this.shiftRatioY = 0.7; // screen accomodation	

    this.plotCircleRadius = 5;

    // Saving X coordinate to retrieve position value later by Vertical line
    this.xCoords = {};
    this.__dragListener__();
}


RenderEngine.prototype.__dragListener__ = function() {
        var _this = this,
            start = {},
            end = {},
            svgLeft = cumulativeOffset(this.svg).left,
            svgTop = cumulativeOffset(this.svg).top,
            svgBottom;
        /*
        	A variable to store dragging status
        	0 -- drag not started
        	1 -- drag started on svg
        	1 -- drag happening on the svg
        	2 -- drag ended on the svg
        */
        var dragStatus = 0;

        function refreshSvgCoordinate () {
            svgLeft = cumulativeOffset(_this.svg).left;
            svgTop = cumulativeOffset(_this.svg).top;
        }

        this.svg.addEventListener("mousedown", function(e) {
        	refreshSvgCoordinate();
            var event = new CustomEvent(
                "selectionmousedown", {
                    detail: {
                    	x: e.clientX - svgLeft,
                    	y: e.pageY - svgTop
                    }
            });
            document.dispatchEvent(event);
        });

        this.svg.addEventListener("mouseup", function(e) {
        	refreshSvgCoordinate();
            var event = new CustomEvent(
                "selectionmouseup", {
                    detail: {
                    	x: e.clientX - svgLeft,
                    	y: e.pageY - svgTop
                    }
                });
            document.dispatchEvent(event);
        });

        this.svg.addEventListener("mousemove", function(e) {
        	refreshSvgCoordinate();
            var event = new CustomEvent(
                "selectionmousemove", {
                    detail: {
                    	x: e.clientX - svgLeft,
                    	y: e.pageY - svgTop
                    }
            });
            document.dispatchEvent(event);
        });


        document.addEventListener("selectionmousedown", function(e) {
            svgBottom = cumulativeOffset(_this.svg).top + _this.height - _this.marginY;
            svgTop = _this.height - _this.marginY - _this.height * _this.shiftRatioY;
            _this.__sigMouseDown__();
            if ((dragStatus === 0 || dragStatus === 2) && e.detail.x >= _this.marginX && e.detail.y >= svgTop && e.detail.y <= svgBottom) {
                _this.__boxDestroy__();
                start.x = e.detail.x;
                start.y = e.detail.y;
                dragStatus = 1;
            }
            if (dragStatus === 2) {
                dragStatus = 0;
                _this.__boxDestroy__()
            }

        });


        document.addEventListener("selectionmouseup", function(e) {
            svgTop = _this.height - _this.marginY - _this.height * _this.shiftRatioY;
            _this.__sigMouseUp__();
            if (dragStatus === 1) {
                dragStatus = 2;
                _this.__boxRemoveFocus__();
            }
        });

        document.addEventListener("selectionmousemove", function(e) {
            svgTop = _this.height - _this.marginY - _this.height * _this.shiftRatioY;
            if (dragStatus === 1 && e.detail.x >= _this.marginX && e.detail.y >= svgTop && e.detail.y <= svgBottom ) {
                end.x = e.detail.x;
                end.y = e.detail.y;
                _this.__drawBox__(start, end);
            }

        });

    } // end srag listener

RenderEngine.prototype.__sigMouseDown__ = function() {
        var _this = this;
        _this.attachedChart.__flagMouseDown__ = true;
    } // end __sigMouseDown__


RenderEngine.prototype.__sigMouseUp__ = function() {
        var _this = this;
        _this.attachedChart.__flagMouseDown__ = false;
    } // end __sigMouseUp__

RenderEngine.prototype.__boxDestroy__ = function() {
        var _this = this;

        if (_this.selectionBox) {
            _this.svg.removeChild(_this.selectionBox);
            delete _this.selectionBox;
        }
        _this.attachedChart.highlight(-1, -1, -1, -1);

    } // end __boxRemoveFocus

RenderEngine.prototype.__boxRemoveFocus__ = function() {
        var _this = this;

        if (_this.selectionBox) {
            _this.selectionBox.setAttribute("style", "opacity: 0");
        }

    } // end __boxRemoveFocus
RenderEngine.prototype.__drawBox__ = function(start, end) {
    var _this = this;
    if (!_this.selectionBox) {
        _this.selectionBox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        _this.svg.appendChild(_this.selectionBox);
    }

    var svgLeft = cumulativeOffset(this.svg).left;
    var svgTop = cumulativeOffset(this.svg).top;

    var x = start.x;
    var y = start.y;
    var w = end.x - start.x;
    var h = end.y - start.y;

    if(w < 0 && h < 0){
    	y = end.y;
    	h *= -1;
    	x = end.x;
    	w *= -1;
    }

    if(w < 0 && h >= 0){
    	x = end.x;
    	w *= -1;
    }

    if(w >= 0 && h < 0){
    	y = end.y;
    	h *= -1;
    }

    _this.selectionBox.setAttribute("x", x);
    _this.selectionBox.setAttribute("y", y);
    _this.selectionBox.setAttribute("width", w);
    _this.selectionBox.setAttribute("height", h);
    _this.selectionBox.setAttribute("style", "opacity: 0.2");
    _this.selectionBox.setAttribute("class", "selection-box");

    // highlighting charts in the area
    _this.attachedChart.highlight(x, y, x + w, y + h);
}

RenderEngine.prototype.attachChart = function(chart) { // Function to attach desired chart type
    this.attachedChart = chart;
}

RenderEngine.prototype.renderChart = function(xArr, yArr) {
    this.attachedChart.renderData(xArr, yArr);
}

RenderEngine.prototype.convert = function(x, y) {
        return {
            x: x + this.marginX,
            y: this.height - (y + this.marginY)
        };
    } // end convert


RenderEngine.prototype.__shiftX = function(coor) {
        return coor * this.shiftRatioX //+ this.shiftOriginX;
    } // End __shiftX

RenderEngine.prototype.__shiftY = function(coor) {
        return coor * this.shiftRatioY //+ this.shiftOriginY;
    } // End __shiftY


RenderEngine.prototype.drawLine = function(x1, y1, x2, y2, className) { // Private function to
    // draw lines
    var coord1 = this.convert(x1, y1); // Getting converted axis
    var coord2 = this.convert(x2, y2); // according to canvas
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line"); // creating our
    // element line.

    line.setAttribute("x1", coord1.x); // setting line
    line.setAttribute("y1", coord1.y); // coordinates
    line.setAttribute("x2", coord2.x); // and styles
    line.setAttribute("y2", coord2.y); // with shifting

    if (className) {
        line.setAttribute("class", className);
    }
    this.svg.appendChild(line); // Drawing line to our canvas
    return line;
} // end drawLine function

RenderEngine.prototype.drawRect = function(x1, y1, w, h, className) { // Private function to
        // draw lines
        var coord1 = this.convert(x1, y1); // Getting converted axis
        // according to canvas
        if (coord1.x < this.marginX) {
            coord1.x = this.marginX;
        }


        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect"); // creating our
        // element line.

        rect.setAttribute("x", coord1.x); // setting line
        rect.setAttribute("y", coord1.y); // coordinates
        rect.setAttribute("width", w); // and styles
        rect.setAttribute("height", h); // with shifting

        if (className) {
            rect.setAttribute("class", className);
        }
        this.svg.appendChild(rect); // Drawing line to our canvas
        return rect;
    } // end drawRect function


RenderEngine.prototype.__drawCircle = function(x, y, r, className) { // Private function to
        // draw circle


        var coord = this.convert(x, y); // according to canvas
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"); // creating our
        // element line.

        circle.setAttribute("cx", coord.x); // setting circle
        circle.setAttribute("cy", coord.y); // coordinates
        circle.setAttribute("r", r); // and styles
        circle.setAttribute("class", className);
        this.svg.appendChild(circle);

        return circle;
        // Drawing line to our canvas
    } // end constructor function


RenderEngine.prototype.__xRangeEstimateGenerator = function(min, max) {
        var _this = this;
        return function(num) {
            return this.__shiftX(((num - min) / (max - min)) * _this.width);
        }
    } // End yRangeEstimator

RenderEngine.prototype.__yRangeEstimateGenerator = function(min, max) {
        var _this = this;
        return function(num) {
            return this.__shiftY(((num - min) / (max - min)) * _this.height);
        }
    } // End yRangeEstimator


RenderEngine.prototype.drawXAxisLabels = function(rangeArray, isTop) {

    var i, len, x1, x2, y1, y2, stringTime, item;


    if (!this.xAxisLabelsArray) {
        this.xAxisLabelsArray = [];
    }

    for (i = 0, len = rangeArray.length; i < len; ++i) {
        item = rangeArray[i];
        x1 = this.xRangeEstimator(item);
        x2 = this.xRangeEstimator(item);
        y1 = -6;
        y2 = 0;
        stringTime = timeInWords(item);
        stringTime = stringTime.split(" ")
        stringTime = stringTime[0] + "\n" + stringTime[1];
        if (isTop) {
            this.xAxisLabelsArray[i] = this.__placeText(x1 - (timeInWords(item).length * 1.3), this.height * (this.shiftRatioY + 0.035), stringTime, "axis-label xaxis-label");
        } else {
            this.xAxisLabelsArray[i] = this.__placeText(x1 - (timeInWords(item).length * 1.3), 0 - 7 - (this.marginY * 0.7) + (this.height * 0.016), stringTime, "axis-label xaxis-label");
        }

    }
}

RenderEngine.prototype.removeXAxisLabels = function(rangeArray) {

    if (!this.xAxisLabelsArray) {
        return;
    }

    var i;
    for (i = rangeArray.length; i--;) {
        if (this.xAxisLabelsArray[i]) {
            this.svg.removeChild(this.xAxisLabelsArray[i]);
            delete this.xAxisLabelsArray[i];
        }
    }
}

RenderEngine.prototype.drawXAxis = function(rangeArray) {
        var i, len, item; // Loop iteration variables
        // Drawing X axis
        var x1 = 0;
        var x2 = this.width;
        var y1 = 0;
        var y2 = 0;
        //this.drawLine(x1, y1, x2, y2, "axis xaxis");

        var dim = {
            height : this.height,
            width : this.width
        }
        var rng = {
            min : rangeArray[0],
            max : rangeArray[rangeArray.length - 1]
        }
        var xax = new Axis(dim, this.shiftRatioX, rng);
        xax.plotAxis(this)

        // Drawing the ticks
        var firstItem = rangeArray[0];
        var lastItem = rangeArray[rangeArray.length - 1];

        this.xRangeEstimator = this.__xRangeEstimateGenerator(firstItem, lastItem);

        for (i = 0, len = rangeArray.length; i < len; ++i) {
            item = rangeArray[i];
            x1 = this.xRangeEstimator(item);
            x2 = this.xRangeEstimator(item);
            y1 = -6;
            y2 = 0;
            //this.drawLine(x1, y1, x2, y2, "ticks");

            // Saving first and last coordinate and value 

            if (i === 0) {
                this.xCoords.start = {};
                this.xCoords.start.value = item;
                this.xCoords.start.position = x1 + this.marginX;
            }
            if (i === len - 1) {
                this.xCoords.end = {};
                this.xCoords.end.value = item;
                this.xCoords.end.position = x1 + this.marginX;
            }
        }
    } // end draw x axis

RenderEngine.prototype.drawYAxis = function(rangeArray, key) {
        var i, len, item;
        var x1 = 0;
        var x2 = 0;
        var y1 = 0;
        var y2 = this.height * this.shiftRatioY;

        var divBoxHeight;
        this.drawLine(x1, y1, x2, y2, "axis yaxis");
        // Drawing the ticks
        var firstItem = rangeArray[0];
        var lastItem = rangeArray[rangeArray.length - 1];

        this.yRangeEstimator = this.__yRangeEstimateGenerator(firstItem, lastItem);

        for (i = 0, len = rangeArray.length; i < len; ++i) {
            item = rangeArray[i];
            y1 = this.yRangeEstimator(item);
            y2 = this.yRangeEstimator(item);
            x1 = -6;
            x2 = 0;
            var text = "" + shortNumber(rangeArray[i]);
            text = text.trim();
            // Adjustments to X position
            var tx1 = x1 - 0.025 * this.width;
            tx1 -= (text.length / 4) * 10;
            var textEl = this.__placeText(tx1, y1 - 3, text, "axis-label yaxis-label");

            var textLeft = Number(textEl.getAttribute("x"));
            var textWidth = Number(textEl.clientWidth);
            textEl.setAttribute("x", textLeft - (textWidth / 4))

            this.drawLine(x1, y1, x2, y2, "ticks", true);

            if (i !== 0 && !divBoxHeight) {
                divBoxHeight = y1 - this.yRangeEstimator(rangeArray[0]);
            }

        }
        for (i = 0, len = rangeArray.length; i < len; ++i) {
            item = rangeArray[i];
            y1 = this.yRangeEstimator(item);
            y2 = this.yRangeEstimator(item);
            x1 = 0;
            x2 = this.width;
            if (i) {
                this.drawRect(x1, y1, this.width, divBoxHeight, "div-lines", true);
            }
        }

        // Placing the yaxis name
        key = key[0].toUpperCase() + key.substr(1);
        var chartYLabelX = 0 - (this.marginX * 2 / 3);
        var chartYLabelY = (this.height - this.marginY) / 2 - key.length * 2;
    } // end drawYAxis

RenderEngine.prototype.chartLabel = function() {
    var key = this.key;
    var textEl;
    var rectTop, rectLeft, rectHeight, rectWidth;

    if (!this.isLabelTop) {
        rectTop = this.height - this.marginY - 1;
        rectLeft = 0;
        rectWidth = this.width * this.shiftRatioX + this.marginX - 1;
        rectHeight = this.height * 0.1;
    } else {
        rectTop = -1 * this.marginY / 3;
        rectLeft = 0;
        rectWidth = this.width * this.shiftRatioX + this.marginX - 1;
        rectHeight = this.height * 0.1;
    }

    this.drawRect(rectLeft, rectTop, rectWidth, rectHeight, "chart-label-back");
    textEl = this.__placeText(rectWidth / 2, rectTop, key.toUpperCase(), "chart-label");

    var textTop = Number(textEl.getAttribute("y"));
    var textLeft = Number(textEl.getAttribute("x"));
    var textHeight = Number(textEl.clientHeight);
    var textWidth = Number(textEl.clientWidth);
    textEl.setAttribute("y", textTop + textHeight)
    textEl.setAttribute("x", textLeft - (textWidth / 2))

}

RenderEngine.prototype.getRatio = function(x) {

        var difference = this.xCoords.end.position - this.xCoords.start.position;
        var position = x - this.xCoords.start.position;
        var ratio = position / difference;
        var valueDifference = this.xCoords.end.value - this.xCoords.start.value;

        var value;

        if (ratio >= 0 && ratio <= 1) {
            value = (ratio * valueDifference) + this.xCoords.start.value;
        }

        return Math.round(value);

    } // end getRatio


RenderEngine.prototype.__placeText = function(x, y, text, className, rotate) {
        var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");

        x = this.convert(x, y).x;
        y = this.convert(x, y).y;
        textElement.setAttribute("x", x);
        textElement.setAttribute("y", y);
        if (className) {
            textElement.setAttribute("class", className);
        }
        if (rotate) {
            var transform = "rotate(";
            transform += rotate;
            transform += " ";
            transform += x + "," + y;
            transform += ")";
            textElement.setAttribute("transform", transform);
        }
        textElement.innerHTML = text;
        this.svg.appendChild(textElement);
        return textElement;
    } // End placetext

RenderEngine.prototype.plotLine = function(x1, y1, x2, y2, style) {
    x1 = this.xRangeEstimator(x1);
    x2 = this.xRangeEstimator(x2);
    y1 = this.yRangeEstimator(y1);
    y2 = this.yRangeEstimator(y2);
    this.drawLine(x1, y1, x2, y2, "chart-line");
}

RenderEngine.prototype.plotCircle = function(x, y) {
    var value = y;
    x = this.xRangeEstimator(x);
    y = this.yRangeEstimator(y);
    var className = 'plot-circle';
    return this.__drawCircle(x, y, this.plotCircleRadius, className);
}




/* Function to replace existing */
RenderEngine.prototype.drawLine$ = function(x1, y1, x2, y2, className) { // Private function to
    // draw lines

    var line = document.createElementNS("http://www.w3.org/2000/svg", "line"); // creating our
    // element line.

    x1 += this.marginX;
    x2 += this.marginX;
    y1 += this.marginY;
    y2 += this.marginY;

    console.log(this.marginY / this.heig)

    line.setAttribute("x1", x1); // setting line
    line.setAttribute("y1", y1); // coordinates
    line.setAttribute("x2", x2); // and styles
    line.setAttribute("y2", y2); // with shifting

    if (className) {
        line.setAttribute("class", className);
    }
    this.svg.appendChild(line); // Drawing line to our canvas
    return line;
} // end drawLine function