function Engine(model) {    // An object to fetch data from 'Chart' and make
                            // it more meaningful
    this.model = model;     // saved chart so that it can be used by other functions
}

Engine.prototype.__getYLimits__ = function(idx) { // Calculate a more good looking limit
    var minValue = this.model.getMinY(idx);
    var maxValue = this.model.getMaxY(idx);

    if (minValue === maxValue) {
        return {
            min: minValue,
            max: maxValue
        }
    }

    var difference = maxValue - minValue;
    var difference2 = maxValue - minValue;
    // Algorithm to get more good looking ranges

    var numDig = numberOfDigits(difference);

    while (difference2 < 1) {
        numDig -= 1;
        difference2 *= 10;
    }

    var beautyNumber = Math.pow(10, (numDig - 2)) * 5;

    minValue = Math.floor(minValue / beautyNumber) * beautyNumber;

    if ((difference / maxValue) > 0.1) {
        var newBeautyNumber = Math.pow(10, numberOfDigits(maxValue) - 2);
        beautyNumber = beautyNumber > newBeautyNumber ? beautyNumber : newBeautyNumber;
    }

    maxValue = Math.ceil(maxValue / beautyNumber) * beautyNumber;
    return {
        min: minValue,
        max: maxValue
    };

} // End getYLimits

Engine.prototype.getYRange = function(idx) {

        var i, j, temp;

        var rangeArray = []; // final range array that the
        // function will return
        var calcMin = this.__getYLimits__(idx).min;
        var calcMax = this.__getYLimits__(idx).max;

        if (calcMin === calcMax) {
            return [calcMin * 2, calcMin, 0];
        }

        var computedMin, computedMax; // variable to store final limits of
        // calculated range
        var difference;
        var steps; // Variable to store steps from
        // min to max

        var twoDigitMin, twoDigitMax; // Variables to store leading
        // two digits of max and min

        var stepsDown = 0; // A variable to store how
        // many divisions were made


        twoDigitMax = calcMax;

        while (twoDigitMax > 99 || twoDigitMax < -99) {
            twoDigitMax /= 10;
            ++stepsDown;
        }

        twoDigitMin = Math.floor((calcMin * 100) / (Math.pow(10, stepsDown))) / 100;

        while (twoDigitMin > 99 || twoDigitMin < -99) {
            twoDigitMin /= 10;
            twoDigitMax /= 10;
            ++stepsDown;
        }

        difference = twoDigitMax - twoDigitMin;

        if (difference <= 0.3) {
            steps = 0.05;
        } else if (difference <= 1) {
            steps = 0.2;
        } else if (difference <= 3) {
            steps = 0.5;
        } else if (difference <= 6) {
            steps = 1;
        } else if (difference <= 12) {
            steps = 2;
        } else if (difference <= 20) {
            steps = 4;
        } else if (difference <= 30) {
            steps = 5;
        } else if (difference <= 40) {
            steps = 7;
        } else {
            steps = 10;
        }

        computedMin = Math.floor(twoDigitMin / steps) * steps;
        computedMax = Math.ceil(twoDigitMax / steps) * steps;

        // Step up; Multiplying the value to min-max that was divided before

        steps *= Math.pow(10, stepsDown);
        computedMin *= Math.pow(10, stepsDown);
        computedMax *= Math.pow(10, stepsDown);

        temp = computedMin;

        while (temp <= computedMax) {
            temp = Math.round(temp * 100) / 100;
            rangeArray.push(temp);
            temp += steps;
        }
        return rangeArray;
    } // End getYRange

Engine.prototype.getXRange = function() {
        var minValue = joinDate(this.model.getMinX().year, this.model.getMinX().month);
        var maxValue = joinDate(this.model.getMaxX().year, this.model.getMaxX().month);

        var steps = ((maxValue - minValue) / 5);
        var rangeArray = [];


        while (minValue <= maxValue) {
            rangeArray.push(Math.round(minValue));
            minValue += steps;
        }
        //rangeArray.push(Math.round(minValue));

        return rangeArray;

    } // end getXrange

Engine.prototype.getXRangeOfVariable = function(idx) {
    var i, len, item; // Loop variables
    var dataArray = this.model.getY(idx);
    var yDateArray = [];

    for (i = 0, len = dataArray.length; i < len; ++i) {
        item = dataArray[i];
        yDateArray[i] = joinDate(item.year, item.month);
    }
    return yDateArray;

}
Engine.prototype.getYRangeOfVariable = function(idx) {
    var i, len, item; // Loop variables
    var dataArray = this.model.getY(idx);
    var yDataArray = [];

    for (i = 0, len = dataArray.length; i < len; ++i) {
        item = dataArray[i];
        yDataArray[i] = item.value;
    }
    return yDataArray;

}

Engine.prototype.__getValueAtPosition = function(xValue, key) {
    if (!xValue) {
        return;
    }

    var yArray = this.model.getY(key);
    var date = splitDate(xValue);

    if (xValue < yArray[0].date || xValue > yArray[yArray.length - 1].date) {
        return;
    }
    return binarySearchDate(0, yArray.length - 1, xValue, yArray, this.model.interpolation);
}

Engine.prototype.getColumnWidth = function() {
    var chartWidth = this.model.getWidth();
    var chartHeight = this.model.getHeight();

    var maxPoints = this.model.getMaxPointsOfAllChart();
    var maxGaps = maxPoints + 1;

    return Math.floor((chartWidth) / (maxPoints + maxGaps));
}

Engine.prototype.render = function(selector, type) {

    var i, len, key, item; // Loop variables

    this.rootEl = document.getElementById(selector);
    this.rootEl.innerHTML = "";
    this.rootEl.setAttribute("class", "pallete");
    var captionBox = document.createElement("div");
    captionBox.setAttribute('class', 'caption-box');
    var captionEl = document.createElement("h2");
    captionEl.setAttribute('class', 'caption');
    var subCaptionEl = document.createElement("h4");
    subCaptionEl.setAttribute('class', 'sub-caption');
    captionBox.appendChild(captionEl);
    captionBox.appendChild(subCaptionEl);
    captionEl.innerHTML = this.model.getCaption();
    subCaptionEl.innerHTML = this.model.getSubCaption();
    this.rootEl.appendChild(captionBox);

    // Count number of charts possible in one row
    this.numChartsRow = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; //getting width first
    this.numChartsRow = Math.floor(this.numChartsRow / (this.model.getWidth() + this.numChartsRow * 0.03))
    var allVariables = this.model.getAllVariables();

    var count = 0;

    var colWidth = colWidth ? colWidth : this.getColumnWidth();

    // A variable to determine if chart label is to be drawn on top or not
    this.isChartLabelTop = (allVariables.length) % this.numChartsRow !== 0;

    this.renderEngineObject = {};
    var dimension = {
        height : this.model.getWidth(),
        width : this.model.getWidth()
    }
    var rangeX = {
        min : joinDate(this.model.getMinX().year, this.model.getMinX().month),
        max : joinDate(this.model.getMaxX().year, this.model.getMaxX().month)
    };
    var rangeY = {};

    for (var idx in allVariables) {
        key = allVariables[idx];
        this.renderEngineObject[key] = new RenderEngine(this, selector, dimension, key, this.isChartLabelTop);
        item = this.renderEngineObject[key];



        rangeY = {
            min : this.model.getMinY(key),
            max : this.model.getMaxY(key)
        }
        // Attaching xaxis module
        item.attachAxisX(new XAxis(dimension, item.shiftRatioX, rangeX));
        item.attachAxisY(new YAxis(dimension, item.shiftRatioY, rangeY));
        item.drawAxisX();
        item.drawAxisY();
        item.drawAxisXLabel(this.isChartLabelTop);
        item.drawAxisYLabel();
        item.chartLabel();

/*        // Remove later
        item.drawYAxis(this.getYRange(key), key);
        item.drawXAxis(this.getXRange());
        */
        //item.drawXAxisLabels(this.getXRange(), this.isChartLabelTop);


        if (type.toLowerCase() === "column") {
            item.attachChart(new ColumnChart(item, colWidth));
        } else {
            item.attachChart(new LineChart(item, colWidth));
        }

        item.renderChart(this.getXRangeOfVariable(key), this.getYRangeOfVariable(key))

        ++count;
    }

    this.__prepareArrange__();
    this.__showLabels__();
}


Engine.prototype.__prepareArrange__ = function() {
    var key, item, i, iv, len;
    var _this = this;
    var style;

    if (!this.storeSvgArray) {
        this.storeSvgArray = [];
        this.storeSvgDimensionArray = [];

        for (key in this.renderEngineObject) {
            this.storeSvgArray.push({
                svg: this.renderEngineObject[key].svg,
                key: key,
                data: this.model.getY(key),
                object: this.renderEngineObject[key]
            });
            this.storeSvgDimensionArray.push(cumulativeOffset(this.renderEngineObject[key].svg))
        }

    }

    for (i = 0, len = this.storeSvgArray.length; i < len; ++i) {
        style = "position : absolute; top : " + _this.storeSvgDimensionArray[i].top + "px;";
        style += "left : " + _this.storeSvgDimensionArray[i].left + "px;"
        style += "margin-left : 0px"
        _this.storeSvgArray[i].svg.setAttribute("style", style)
    }
}

Engine.prototype.reverse = function(func) {

        var key, item, i, iv, len;
        var _this = this;
        var style;

        var customFunction = func;

        this.storeSvgArray.reverse();


        this.__hideLabels__();

        for (i = 0, len = _this.storeSvgArray.length; i < len; ++i) {
            style = "position : absolute; top : " + _this.storeSvgDimensionArray[i].top + "px;";
            style += "left : " + _this.storeSvgDimensionArray[i].left + "px;"
            style += "margin-left : 0px"
            _this.storeSvgArray[i].svg.setAttribute("style", style)
        }

        this.__showLabels__();
    } // end reverse function

Engine.prototype.rearrange = function(func) {

        var key, item, i, iv, len;
        var _this = this;
        var style;

        var customFunction = func;

        this.storeSvgArray.sort(function(a, b) {
            return customFunction(a.data) - customFunction(b.data);
        });


        this.__hideLabels__();

        for (i = 0, len = _this.storeSvgArray.length; i < len; ++i) {
            style = "position : absolute; top : " + _this.storeSvgDimensionArray[i].top + "px;";
            style += "left : " + _this.storeSvgDimensionArray[i].left + "px;"
            style += "margin-left : 0px"
            _this.storeSvgArray[i].svg.setAttribute("style", style)
        }

        this.__showLabels__();
    } // end rearrange function


Engine.prototype.__showLabels__ = function() {
        var _this = this;
        var i, len;
        if (this.isChartLabelTop) {
            for (i = 0, len = _this.storeSvgArray.length; i < this.numChartsRow && i < len; ++i) {
                _this.storeSvgArray[i].object.drawAxisXLabel(this.getXRange(), this.isChartLabelTop)
            }
        } else {
            for (len = _this.storeSvgArray.length, i = len - this.numChartsRow; i < len; ++i) {
                _this.storeSvgArray[i].object.drawAxisXLabels(this.getXRange(), this.isChartLabelTop)
            }
        }
    } // end showLabel

Engine.prototype.__hideLabels__ = function() {
        var _this = this;
        var i, len;
        for (i = 0, len = _this.storeSvgArray.length; i < len; ++i) {
            _this.storeSvgArray[i].object.removeXAxisLabels(this.getXRange());
        }
    } // end hideLabel