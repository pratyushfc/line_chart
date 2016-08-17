function Engine(model) {    // An object to fetch data from 'Chart' and make
                            // it more meaningful
    this.model = model;     // saved chart so that it can be used by other functions
}


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
    var dataArray = this.model.getY({key : idx});
    var yDateArray = [];

    for (i = 0, len = dataArray.length; i < len; ++i) {
        item = dataArray[i].xaxis;
        yDateArray[i] = item;
    }
    return yDateArray;

}
Engine.prototype.getYRangeOfVariable = function(idx) {
    var i, len, item; // Loop variables
    var dataArray = this.model.getY({key : idx});
    var yDataArray = [];

    for (i = 0, len = dataArray.length; i < len; ++i) {
        item = dataArray[i];
        yDataArray[i] = item.value;
    }
    return yDataArray;

}

Engine.prototype.getValueAtPosition = function(ob) {
    if (!ob) {
        return;
    }

    ob = ob || {};

    var xValue = ob.point,
        key = ob.key,
        yArray = this.model.getY({key : key}), 
        convertFn = ob.convertFn,
        readFn = ob.readFn,
        i = 0,
        len = yArray.length;

    if(isNaN(xValue)){
        return;
    }


    for(i = len; i--; ){
        if(readFn(yArray[i].xaxis) === xValue){
            return yArray[i];
        }
    }
}

Engine.prototype.getColumnWidth = function() {
    var chartWidth = this.model.getWidth();
    var chartHeight = this.model.getHeight();

    var maxPoints = this.model.getMaxPointsOfAllChart();
    var maxGaps = maxPoints + 1;

    return Math.floor((chartWidth) / (maxPoints + maxGaps));
}

Engine.prototype.render = function(ob) {

    var i = 0,
        len = 0,
        key = 0,
        item, 
        selector = ob.selector,
        type = ob.type,
        smartCategory = ob.smartCategory;

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

    for (var idx in allVariables) {
        key = allVariables[idx];
        this.renderEngineObject[key] = new RenderEngine(this, selector, dimension, key, this.isChartLabelTop);
        item = this.renderEngineObject[key];

        // Attaching xaxis module
        item.attachAxisX(new XAxis({
            height : dimension.height,
            width : dimension.width,
            range : this.model.getX(key),
            shrink : item.shiftRatioX,
            basicRange : true,
            trimSize : 8,
            alignment : "center-horizontal down"
        }));

   
        item.attachAxisY(new YAxis({
            height : dimension.height,
            width : dimension.width,
            range : this.model.getY({
                key : key,
                sortAr : item.xaxis.rangeArray,
                isDateType : item.xaxis.isDateType,
                isNumericType : item.xaxis.isNumericType,
            }),
            trimSize : 8,
            shrink : item.shiftRatioY,
            smartCategory : smartCategory,
            readFn : function(item){
                return item.value;
            },
            alignment : "left left-10px half-center-vertical"
        }));

        item.drawAxisX();
        item.drawAxisY();
        item.drawAxisYLabel();
        item.chartLabel();

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
                data: this.model.getY({key : key}),
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
                _this.storeSvgArray[i].object.drawAxisXLabel(this.isChartLabelTop)
            }
        } else {
            for (len = _this.storeSvgArray.length, i = len - this.numChartsRow; i < len; ++i) {
                _this.storeSvgArray[i].object.drawAxisXLabel(this.isChartLabelTop)
            }
        }
    } // end showLabel

Engine.prototype.__hideLabels__ = function() {
        var _this = this;
        var i, len;
        for (i = 0, len = _this.storeSvgArray.length; i < len; ++i) {
            _this.storeSvgArray[i].object.removeAxisXLabel(this.getXRange());
        }
    } // end hideLabel
