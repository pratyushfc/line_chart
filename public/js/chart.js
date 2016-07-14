// Semicolon; IIFE wont be parsed as function parameter
;(function(){
	"use strict";

	var interpolation = true;


	// Exposing public Api
	window.RenderChart = function(data, selector){
		var t = performance.now();
		var chart = new Chart(data);
		var engine = new Engine(chart);
		engine.render(selector);
		console.log(performance.now() - t)
	};

	var sortByTime = function(a, b){		// Helper function to sort array by time
		a = joinDate(a.year, a.month);
		b = joinDate(b.year, b.month);
		return a - b;
	}

	var cumulativeOffset = function(element) {
    	var top = 0, left = 0;
    	do {
    	    top += element.offsetTop  || 0;
    	    left += element.offsetLeft || 0;
    	    element = element.offsetParent;
    	} while(element);

    	return {
        	top: top,
        	left: left
    	};
	};


	var joinDate = function(year, month){	// Helper function to combine year and
		return ((year * 12) + month);		// month
	}
	var splitDate = function(date){			// Helper function to split year and month
		return {							// joined by previous function
			year : Math.floor(date / 12),
			month : date % 12
		};
	}

	var timeInWords = function (date){		// Conver  joined dates to 'Feb'06' format
		var year = splitDate(date).year;
		var month = splitDate(date).month;
		var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		year %= 100;
		if(year < 10){
			return monthName[month] + " '0" + year;
		}
		return monthName[month] + " '" + year;
	}

	var shortNumber = function(num){
		var numDig = numberOfDigits(num);
		var suffix = "";
		var stepsDown;

		if(numDig >= 13){
			suffix = "t"
			stepsDown = 12;
		} else if(numDig >= 10){
			suffix = "b"
			stepsDown = 9;
		} else if(numDig >= 7){
			suffix = "m"
			stepsDown = 6;
		} else if(numDig >= 4){
			suffix = "k"
			stepsDown = 3;
		} else{
			suffix = ""
			stepsDown = 0;
		}

		return (num / Math.pow(10, stepsDown)) + suffix;
	}
	var shortNumberExpanded = function(num){
		var numDig = numberOfDigits(num);
		var suffix = "";
		var stepsDown;

		if(numDig >= 13){
			suffix = " trillion"
			stepsDown = 12;
		} else if(numDig >= 10){
			suffix = " billion"
			stepsDown = 9;
		} else if(numDig >= 7){
			suffix = " million"
			stepsDown = 6;
		} else if(numDig >= 4){
			suffix = " thousand"
			stepsDown = 3;
		} else{
			suffix = ""
			stepsDown = 0;
		}
		var result = (num / Math.pow(10, stepsDown));
		return Math.round(result * 100) / 100 + suffix;
	}

	var numberOfDigits = function(num){
		num = num < 0 ? num * -1 : num;
		var dig = 0;
		while(num > 0){
			++dig;
			num = Math.floor(num / 10);
		}
		return dig;
	}

	var binarySearchDate = function(low, high, date, array){
		var result;
		if(high - low === 1){
			if(array[low].date === date){
				result = array[low].value;
			}
			if(array[high].date === date){
				result = array[high].value;
			}

			if(interpolation){
				
				var ratio = (array[high].value - array[low].value) / (array[high].date - array[low].date);
				var extra = array[low].value - (array[low].date * ratio);
				result = date * ratio + extra;
			} else {

				if(date - array[low].date > array[high].date - date){
					result = array[high].value;
				} else {
					result = array[low].value;
				}
			}

			return {
						value : result
					};
		}
		var mid = Math.floor((low + high) / 2);
		if(array[mid].date === date){
			return {
						value : array[mid].value
					};
		}

		if(date > array[mid].date){
			return binarySearchDate(mid, high, date, array);
		} else{
			return binarySearchDate(low, mid, date, array)
		}
	}

	function Chart(data){					// Contructor function to parse and validate data

		var i, len, key,					// Varibles for loop iteration
			item, 							// Data parsing variables
			date,
			index,
			value;

		if(typeof data === "string"){	// If data is string; convert to
			data = JSON.parse(data);	// JSON object
		}

		this.data = {};					// Initialize Chart's data variable
		this.data.dimensions = {		// Initializing dimension property with default value
			width : 500,
			height : 600
		};

		this.data.ticks = {				// Initializing ticks property in Chart's data
			xaxis : 5,
			yaxis : 5
		}

		this.data.caption = data.caption || "";			// Fetching values for caption and
		this.data.subcaption = data.subcaption || "";	// subcaption; default "" string
		this.data.xaxisname = data.xaxisname || "Time";	// Default name for x-axis

		this.data.variables = data.variables || [];		// Default blank array for yaxis variables
		this.data.separator = data.separator || '|';	// Default '|' for separator

		this.data.category = {};						// An object to store array of data
														// on basis of their yaxis variable names
		this.data.dateArray = [];						// Array to store all dates

		if(data.interpolation === false){				// Turning off interpolation if required by user
			interpolation = false;
		}

		if(data.dimensions){							// If parameter data has dimensions, copy them over to
														// Chart's data
			this.data.dimensions.width = data.dimensions.width || this.data.dimensions.width;
			this.data.dimensions.height = data.dimensions.height || this.data.dimensions.height;
		}

		if(data.ticks){									// If parameter data has ticks, copy them over to
														// Chart's data
			this.data.ticks.xaxis = data.ticks.xaxis || this.data.ticks.xaxis;
			this.data.ticks.yaxis = data.ticks.yaxis || this.data.ticks.yaxis;
		}


		if(Array.isArray(data.data)){					// Copy over data to category if Array
			for(i = 0, len = data.data.length; i < len; ++i){
				item = data.data[i];
				date = new Date(item.time);
				for(key in item){
					if(key === "time"){
						continue;
					}

					this.data.category[key] = this.data.category[key] || [];

					var joinedDate = joinDate(date.getYear(), date.getMonth());
					
					this.data.category[key].push({
						year : date.getYear(),
						month : date.getMonth(),
						value : Number(item[key]),
						date : joinedDate
					});

				}

				// Push current date to date Array
				this.data.dateArray.push({
					year : date.getYear(),
					month : date.getMonth()
				});

			}	// End for loop
		}	// End copy data

		// Sorting each category's data array by time
		for(key in this.data.category){
			this.data.category[key].sort(sortByTime);
		}
		// Sorting the date array
		this.data.dateArray.sort(sortByTime);
	}	// End Chart Constructor Function

	Chart.prototype.getMinX = function(){
		return this.data.dateArray[0];
	}	//  End getMinX

	Chart.prototype.getMaxX = function(){
		return this.data.dateArray[this.data.dateArray.length - 1];
	}	//  End getMaxX

	Chart.prototype.getMinY = function(idx){
		var i, len;									// Loop iteration variables
		var arr = this.data.category[idx];			// Fetching the required array
		var min = arr[0].value;
		for(i = 0, len = arr.length; i < len; ++i){			// Setting first index value of array to min

			if(min > arr[i].value){
				min = arr[i].value;
			}
		}
		return min;
	}	//  End getMinY

	Chart.prototype.getMaxY = function(idx){
		var i, len;									// Loop iteration variables
		var arr = this.data.category[idx];			// Fetching the required array
		var max = arr[0].value;
		for(i = 0, len = arr.length; i < len; ++i){			// Setting first index value of array to max

			if(max < arr[i].value){
				max = arr[i].value;
			}
		}
		return max;
	}	//  End getMaxY

	Chart.prototype.getX = function(){
		return this.data.dateArray;
	} // end getX

	Chart.prototype.getY = function(idx){
		return this.data.category[idx];
	} // end getY

	Chart.prototype.getWidth = function(){
		return this.data.dimensions.width;
	} // end getWidth
	Chart.prototype.getHeight = function(){
		return this.data.dimensions.height;
	} // end getHeight

	Chart.prototype.getAllVariables = function(){
		return Object.keys(this.data.category);
	} // End getAllVariables

	Chart.prototype.getCaption = function(){
		return this.data.caption;
	}  // End getCaption()

	Chart.prototype.getSubCaption = function(){
		return this.data.subcaption;
	}  // End getSubCaption()


	function Engine(chart){		// An object to fetch data from 'Chart' and make
								// it more meaningful
		this.chart = chart;		// saved chart so that it can be used by other functions
	}

	Engine.prototype.__getYLimits = function(idx){	// Calculate a more good looking limit :)
		var minValue = this.chart.getMinY(idx);
		var maxValue = this.chart.getMaxY(idx);

		if(minValue === maxValue){
			return{
				min : minValue,
				max : maxValue
			}
		}

		var difference = maxValue - minValue;
		var difference2 = maxValue - minValue;
		// Algorithm to get more good looking ranges

		var numDig = numberOfDigits(difference);

		while(difference2 < 1){
			numDig -= 1;
			difference2 *= 10;
		}

		var beautyNumber = Math.pow(10, (numDig - 2)) * 5;

		minValue = Math.floor(minValue / beautyNumber) * beautyNumber;

		if((difference / maxValue) > 0.1){
			var newBeautyNumber = Math.pow(10, numberOfDigits(maxValue) - 2);
			beautyNumber = beautyNumber > newBeautyNumber ? beautyNumber : newBeautyNumber;
		}

		maxValue = Math.ceil(maxValue / beautyNumber) * beautyNumber;
		return {
			min : minValue,
			max : maxValue
		};

	} // End getYLimits

	Engine.prototype.getYRange = function(idx){

		var i, j, temp;

		var rangeArray = [];			// final range array that the
										// function will return
		var calcMin = this.__getYLimits(idx).min;
		var calcMax = this.__getYLimits(idx).max;

		if(calcMin === calcMax){
			return [calcMin * 2, calcMin, 0];
		}

		var computedMin, computedMax;	// variable to store final limits of
										// calculated range
		var difference;
		var steps;						// Variable to store steps from
										// min to max

		var twoDigitMin, twoDigitMax;	// Variables to store leading
										// two digits of max and min

		var stepsDown = 0;				// A variable to store how
										// many divisions were made

		
		twoDigitMax = calcMax;

		while(twoDigitMax > 99 || twoDigitMax < -99){
			twoDigitMax /= 10;
			++stepsDown;
		}

		twoDigitMin = Math.floor((calcMin * 100) / (Math.pow(10, stepsDown))) / 100;

		while(twoDigitMin > 99 || twoDigitMin < -99){
			twoDigitMin /= 10;
			twoDigitMax /= 10;
			++stepsDown;
		}

		difference = twoDigitMax - twoDigitMin;

		if(difference <= 0.3){
			steps = 0.05;
		} else if(difference <= 1){
			steps = 0.2;
		} else if(difference <= 3){
			steps = 0.5;
		} else if(difference <= 6){
			steps = 1;
		} else if(difference <= 12){
			steps = 2;
		} else if(difference <= 20){
			steps = 4;
		} else if(difference <= 30){
			steps = 5;
		} else if(difference <= 40){
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

		while(temp <= computedMax){
			temp = Math.round(temp * 100) / 100;
			rangeArray.push(temp);
			temp += steps;
		}
		return rangeArray;
	} // End getYRange

	Engine.prototype.getXRange = function(){
		var minValue = joinDate(this.chart.getMinX().year, this.chart.getMinX().month);
		var maxValue = joinDate(this.chart.getMaxX().year, this.chart.getMaxX().month);

		var steps = ((maxValue - minValue) / 5) ;
		var rangeArray = [];


		while(minValue <= maxValue){
			rangeArray.push(Math.round(minValue));
			minValue += steps;
		}
		//rangeArray.push(Math.round(minValue));

		return rangeArray;

	} // end getXrange

	Engine.prototype.getXRangeOfVariable = function(idx){
		var i, len, item;	// Loop variables
		var dataArray = this.chart.getY(idx);
		var yDateArray = [];

		for(i = 0, len = dataArray.length; i < len; ++i){
			item = dataArray[i];
			yDateArray[i] = joinDate(item.year, item.month);
		}
		return yDateArray;

	}
	Engine.prototype.getYRangeOfVariable = function(idx){
		var i, len, item;	// Loop variables
		var dataArray = this.chart.getY(idx);
		var yDataArray = [];

		for(i = 0, len = dataArray.length; i < len; ++i){
			item = dataArray[i];
			yDataArray[i] = item.value;
		}
		return yDataArray;

	}

	Engine.prototype.__getValueAtPosition = function(xValue, key){
		if(!xValue){
			return;
		}

		var yArray = this.chart.getY(key);
		var date = splitDate(xValue);

		if(xValue < yArray[0].date || xValue > yArray[yArray.length - 1].date){
			return;
		}
		return binarySearchDate(0, yArray.length - 1, xValue, yArray);
	}


	Engine.prototype.render = function(selector){

		var i, len, key, dateItem, prevDateItem, valueItem, prevValueItem;	// Loop variables


		var rootEl = document.getElementById(selector);
		rootEl.setAttribute("class", "pallete");
		var captionBox = document.createElement("div");
		captionBox.setAttribute('class', 'caption-box');
		var captionEl = document.createElement("h2");
		captionEl.setAttribute('class', 'caption');
		var subCaptionEl = document.createElement("h4");
		subCaptionEl.setAttribute('class', 'sub-caption');
		captionBox.appendChild(captionEl);
		captionBox.appendChild(subCaptionEl);
		captionEl.innerHTML = this.chart.getCaption();
		subCaptionEl.innerHTML = this.chart.getSubCaption();
		rootEl.appendChild(captionBox);

		var allVariables = this.chart.getAllVariables();

		var count = 0;
		var isLast;

		this.renderEngineObject = {};

		for(var idx in allVariables){
			key = allVariables[idx];

			// Only last chart will show time labels
			isLast = count === Object.keys(allVariables).length - 1;

			/* Chart title -- captionBox = document.createElement("div");
			captionBox.setAttribute('class', 'caption-box');
			subCaptionEl = document.createElement("h4");
			subCaptionEl.setAttribute('class', 'sub-caption');
			captionBox.appendChild(subCaptionEl);
			subCaptionEl.innerHTML = key.toUpperCase() + ' - TIME';
			rootEl.appendChild(captionBox);*/

			this.renderEngineObject[key] = new RenderEngine(this, selector, this.chart.getWidth(), this.chart.getHeight(), key);
			this.renderEngineObject[key].drawYAxis(this.getYRange(key), key);
			this.renderEngineObject[key].drawXAxis(this.getXRange(), isLast);
			

			var dateOfVariable = this.getXRangeOfVariable(key);
			var valueOfVariable = this.getYRangeOfVariable(key);

			for(i = 1, len = dateOfVariable.length; i < len; ++i){
				dateItem = dateOfVariable[i];
				prevDateItem = dateOfVariable[i - 1];
				valueItem = valueOfVariable[i];
				prevValueItem = valueOfVariable[i - 1];
				this.renderEngineObject[key].plotLine(prevDateItem, prevValueItem, dateItem, valueItem);
			}
			for(i = 0, len = dateOfVariable.length; i < len; ++i){
				dateItem = dateOfVariable[i];
				valueItem = valueOfVariable[i];
				this.renderEngineObject[key].plotCircle(dateItem, valueItem);
			}
			++count;
		}
	}


	// A construction function for tooltip
	function Tooltip(){
		this.toolEl = document.createElement("div");
		document.getElementsByTagName("body")[0].appendChild(this.toolEl);
		this.toolEl.setAttribute("class" , "plotTooltip");
		this.style = "position:absolute;top:" + -100 + "px;left:" + -100 + "px;visibility:";
		var visibility = 'hidden';
		this.toolEl.setAttribute("style" , this.style + visibility);
	}	// end tooltip constructor

	Tooltip.prototype.show = function(top, left, value){
		this.style = "position:absolute;top:" + top + "px;left:" + left + "px;visibility:";
		this.style += 'visible';

		//if(interpolated){
		//	this.style += ";opacity : 1"
		//}

		this.toolEl.innerHTML = value;
		this.toolEl.setAttribute("style" , this.style);
	}

	Tooltip.prototype.hide = function(){
		var visibility = ';visibility: hidden';
		this.toolEl.setAttribute("style" , this.style + visibility);
	}



	function RenderEngine(engine, selector, width, height, name){
		this.engine = engine;
		this.key = name;
		width = width ? width : 600;
		height = height ? height : 500;
		
		this.rootElement = document.getElementById(selector);				 		// getting parent element
		
		this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");	// creating canvas				// getting the canvas that was created
		this.svg.setAttribute("height", height);
		this.svg.setAttribute("width", width);
		this.svg.setAttribute("class", "chart");
		
		this.rootElement.appendChild(this.svg);	// adding our canvas to parent element
		
		this.width = width;						// Storing height and width
		this.height = height;					// for future uses
		this.marginX = 0.13 * this.width;		// Margin will be used for labels
		this.marginY = 0.08 * this.height;						// and ticks
		this.shiftRatio = 0.85;					// Shifting values for better
		this.shiftOriginX = 0;	// screen accomodation
		this.shiftOriginY = 0;

		this.plotCircleRadius = 5;

		// Saving X coordinate to retrieve position value later by Vertical line
		this.xCoords = {};

		// An object to store all plotCircles
		this.plotCirclesObject = {};
		// A tooltip for every chart
		this.tooltip = new Tooltip();
		this.listener();
	}

	RenderEngine.prototype.listener = function(){
		var _this = this;
		var event;
		
		this.svg.addEventListener("mousemove", function(e){
			event = new CustomEvent(
				"verticalLineHover", 
				{
					detail: {
						position: e.clientX
					},
					bubbles: false,
					cancelable: false
				}
			);
			document.dispatchEvent(event);
		});

		this.svg.addEventListener("mouseout", function(e){
			event = new CustomEvent(
				"verticalLineHover", 
				{
					detail: {
						position: -1
					},
					bubbles: false,
					cancelable: false
				}
			);
			document.dispatchEvent(event);
		});

		document.addEventListener("verticalLineHover", function(e){
			if(e.detail.position === -1){
				_this.__destroyVerticalLine();
			} else {
				_this.__syncVerticalLine(e.detail.position);
			}
		});

	}

	RenderEngine.prototype.getSvg = function(){
		return this.svg;
	}	// End getSvg



	RenderEngine.prototype.convert = function (x, y){
		return {
			x : x + this.marginX,
			y : this.height - (y + this.marginY)
		};
	} // end convert


	RenderEngine.prototype.__shiftX = function(coor){
		return coor * this.shiftRatio //+ this.shiftOriginX;
	} // End __shiftX

	RenderEngine.prototype.__shiftY = function(coor){
		return coor * this.shiftRatio //+ this.shiftOriginY;
	} // End __shiftY


	RenderEngine.prototype.__drawLine = function(x1, y1, x2, y2, className){	// Private function to
																					// draw lines
		var coord1 = this.convert(x1, y1);			// Getting converted axis
		var coord2 = this.convert(x2, y2);			// according to canvas
		var line = document.createElementNS("http://www.w3.org/2000/svg", "line");	// creating our
																					// element line.

		line.setAttribute("x1", coord1.x);	// setting line
		line.setAttribute("y1", coord1.y);	// coordinates
		line.setAttribute("x2", coord2.x);	// and styles
		line.setAttribute("y2", coord2.y);	// with shifting

		if(className){
			line.setAttribute("class", className);
		}
		this.svg.appendChild(line);					// Drawing line to our canvas
	} // end drawLine function

		RenderEngine.prototype.__drawRect = function(x1, y1, w, h, className){	// Private function to
																					// draw lines
		var coord1 = this.convert(x1, y1);			// Getting converted axis
													// according to canvas
		var line = document.createElementNS("http://www.w3.org/2000/svg", "rect");	// creating our
																					// element line.

		line.setAttribute("x", coord1.x);	// setting line
		line.setAttribute("y", coord1.y);	// coordinates
		line.setAttribute("width", w);	// and styles
		line.setAttribute("height", h);	// with shifting

		if(className){
			line.setAttribute("class", className);
		}
		this.svg.appendChild(line);					// Drawing line to our canvas
	} // end drawRect function


	RenderEngine.prototype.__drawCircle = function(x, y, r, className){	// Private function to
																					// draw circle


		var coord = this.convert(x, y);			// according to canvas
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");	// creating our
																					// element line.

		circle.setAttribute("cx", coord.x);	// setting circle
		circle.setAttribute("cy", coord.y);	// coordinates
		circle.setAttribute("r", r);			// and styles
		circle.setAttribute("class", className);

		this.plotCirclesObject[Math.floor(coord.x)] = circle;		// Storing the current circle with its x value
		this.svg.appendChild(circle);
		// Drawing line to our canvas
	} // end constructor function


	RenderEngine.prototype.__destroyVerticalLine = function() {

		if(this.verticalLine){
			this.svg.removeChild(this.verticalLine);
			this.verticalLine = undefined;
			this.tooltip.hide();
		}
		for(var keyx in this.plotCirclesObject){
			this.plotCirclesObject[keyx].setAttribute("style", "");
		}
	}	// end crosshair

	RenderEngine.prototype.__tooltipHeightCalulator = function(value, key) {

		var estimatedHeight = this.yRangeEstimator(value);
		var fl = Math.floor.bind(Math);
		var top = this.height - estimatedHeight;

		top -= this.height * 0.05;
		if(top / this.height > 0.75){
			top -= this.height * 0.25;
		}

		return top;
	}	// end __tooltipHeightCalculator

	RenderEngine.prototype.__findCircleAtPoint = function(x) {

		var i;

		if(this.key === "population"){
			console.log(x, this.plotCirclesObject)
		}

		for(i = x - this.plotCircleRadius; i <= x + this.plotCircleRadius; ++i){
			if(this.plotCirclesObject[i]){
				console.log("Circle found")
				return this.plotCirclesObject[i];
			}
		}

	}	// __findCircleAtPoint

	RenderEngine.prototype.__syncVerticalLine = function(x) {

		// Vertical line; create if already not created
		var svgLeft = cumulativeOffset(this.svg).left;
		if(!this.verticalLine){
			this.verticalLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
			this.svg.appendChild(this.verticalLine);
		}
		// Tooltip position and value
		var svgTop = cumulativeOffset(this.svg).top;
		var svgLeft = cumulativeOffset(this.svg).left;
		var verticalLineXPoint = this.getRatio(x - svgLeft);
		var yValue = this.engine.__getValueAtPosition(verticalLineXPoint, this.key);			
		if(yValue){
			var toolString = shortNumberExpanded(yValue.value);
			toolString += " <br> " + timeInWords(verticalLineXPoint);
			var tooltipTop = this.__tooltipHeightCalulator(yValue.value, this.key);
			this.tooltip.show(svgTop + tooltipTop, x + (this.plotCircleRadius * 2), toolString);
			var circle = this.__findCircleAtPoint(x - svgLeft);
			if(circle){
				circle.setAttribute("style", "stroke: #F44336; stroke-width : 3");	
			}
			for(var keyx in this.plotCirclesObject){
				if(this.plotCirclesObject[keyx] !== circle){
					this.plotCirclesObject[keyx].setAttribute("style", "");
				}
			}
		}
		this.verticalLine.setAttribute("x1", x - svgLeft);	// setting line
		this.verticalLine.setAttribute("y1", this.height * 0.07);	// coordinates
		this.verticalLine.setAttribute("x2", x - svgLeft);	// and styles
		this.verticalLine.setAttribute("y2", this.height - this.marginY);	// with shifting
		this.verticalLine.setAttribute("class", "vertical-line");		
	}	// end syncverticalline


	RenderEngine.prototype.__xRangeEstimateGenerator = function(min, max){
		var _this = this;
		return function(num){
			return this.__shiftX(((num - min) / (max - min)) * _this.width);
		}
	}	// End yRangeEstimator

	RenderEngine.prototype.__yRangeEstimateGenerator = function(min, max){
		var _this = this;
		return function(num){
			return this.__shiftY(((num - min) / (max - min)) * _this.height);
		}
	}	// End yRangeEstimator

	RenderEngine.prototype.drawXAxis = function(rangeArray, placeLabel){
		var i, len, item;			// Loop iteration variables
		// Drawing X axis
		var x1 = 0;
		var x2 = this.width;
		var y1 = 0;
		var y2 = 0;
 		this.__drawLine(x1, y1, x2, y2, "axis xaxis");

 		// Drawing the ticks
 		var firstItem = rangeArray[0];
 		var lastItem = rangeArray[rangeArray.length - 1];

 		this.xRangeEstimator = this.__xRangeEstimateGenerator(firstItem, lastItem);

 		for(i = 0, len = rangeArray.length; i < len; ++i){
 			item = rangeArray[i];
			x1 = this.xRangeEstimator(item);
			x2 = this.xRangeEstimator(item);
			y1 = -6;
			y2 = 0;
			if(placeLabel){
				this.__placeText(x1 - (timeInWords(item).length * 1.3), 0 - (this.marginY * 0.7) + (this.height * 0.016) , timeInWords(item), "axis-label xaxis-label");
			}
			this.__drawLine(x1, y1, x2, y2, "ticks");

			// Saving first and last coordinate and value 

			if(i === 0){
				this.xCoords.start = {};
				this.xCoords.start.value = item;
				this.xCoords.start.position = x1 + this.marginX;	
			}
			if(i === len - 1){
				this.xCoords.end = {};
				this.xCoords.end.value = item;
				this.xCoords.end.position = x1 + this.marginX;	
			}
 		}
	} // end draw x axis

	RenderEngine.prototype.drawYAxis = function(rangeArray, key){
		var i, len, item;
		var x1 = 0;
		var x2 = 0;
		var y1 = 0;
		var y2 = this.height;

		var divBoxHeight;
 		this.__drawLine(x1, y1, x2, y2, "axis yaxis");
 		// Drawing the ticks
 		var firstItem = rangeArray[0];
 		var lastItem = rangeArray[rangeArray.length - 1];

 		this.yRangeEstimator = this.__yRangeEstimateGenerator(firstItem, lastItem);

 		for(i = 0, len = rangeArray.length; i < len; ++i){
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
			this.__placeText(tx1 - 3, y1 - 3 , text, "axis-label yaxis-label");

	 		this.__drawLine(x1, y1, x2, y2, "ticks", true);

	 		if(i !== 0 && !divBoxHeight){
	 			divBoxHeight = y1 - this.yRangeEstimator(rangeArray[0]);
	 		}

 		}
 		for(i = 0, len = rangeArray.length; i < len; ++i){
 			item = rangeArray[i];
			y1 = this.yRangeEstimator(item);
			y2 = this.yRangeEstimator(item);
			x1 = 0;
			x2 = this.width;
			if(i){
				this.__drawRect(x1, y1, this.width, divBoxHeight, "div-lines", true);
			}
 		}

 		// Placing the yaxis name
 		key = key[0].toUpperCase() + key.substr(1);
 		var chartYLabelX = 0 - (this.marginX * 2 / 3);
 		var chartYLabelY = (this.height - this.marginY) / 2 - key.length * 2;
 		this.__placeText(chartYLabelX, chartYLabelY, key, "chartLabel", 270);

	} // end drawYAxis

	RenderEngine.prototype.getRatio = function(x){

		var difference = this.xCoords.end.position - this.xCoords.start.position;
		var position = x - this.xCoords.start.position;
		var ratio =  position / difference;
		var valueDifference = this.xCoords.end.value - this.xCoords.start.value;

		var value;

		if(ratio >= 0 && ratio <= 1){
			value = (ratio * valueDifference) + this.xCoords.start.value;
		} 

		return Math.round(value);

	}	// end getRatio


	RenderEngine.prototype.__placeText = function(x, y, text, className, rotate){
		var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
		x -= text.length / 2;

		x = this.convert(x, y).x;
		y = this.convert(x, y).y;
		textElement.setAttribute("x", x );
		textElement.setAttribute("y", y);
		if(className){
			textElement.setAttribute("class", className);
		}
		if(rotate){
			var transform = "rotate(";
			transform += rotate;
			transform += " ";
			transform += x + "," + y;
			transform += ")";
			textElement.setAttribute("transform", transform);
		}
		textElement.innerHTML = text;
		this.svg.appendChild(textElement);
	} // End placetext

	RenderEngine.prototype.plotLine = function(x1, y1, x2, y2, style){
		x1 = this.xRangeEstimator(x1);
		x2 = this.xRangeEstimator(x2);
		y1 = this.yRangeEstimator(y1);
		y2 = this.yRangeEstimator(y2);
		this.__drawLine(x1, y1, x2, y2, "chart-line");
	}

	RenderEngine.prototype.plotCircle = function(x, y){
		var value = y;
		x = this.xRangeEstimator(x);
		y = this.yRangeEstimator(y);
		var className = 'plot-circle';
		this.__drawCircle(x, y, this.plotCircleRadius, className);
	}


})();
