// Semicolon; IIFE wont be parsed as function parameter
;(function(){
	"use strict";
	
	var global = Function('return this')() || (eval)('this');

	// Exposing public Api
	global.RenderChart = function(data, selector){
		var chart = new Chart(data);
		console.log("x-axis", chart.xAxisRange());
		console.log("sale", chart.yAxisRange("sale"));
		console.log("interval ", chart.intervalOf())
	};

	var sortByTime = function(a, b){		// Helper function to sort array by time
		if(a.year === b.year){
			return a.month > b.month;
		}
		return a.year > b.year;
	}

	var joinDate = function(year, month){	// Helper function to combine year and 
		return ((year * 12) + month);		// month
	}
	var splitDate = function(date){			// Helper function to split year and month
		return {							// joined by previous function
			year : Math.floor(date / 12),
			month : date % 12
		};
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
			height : 500
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

					this.data.category[key].push({
						year : date.getYear(),
						month : date.getMonth(),
						value : Number(item[key])
					});

				}

			}	// End for loop
		}	// End copy data 
		
		// Sorting each category's data array by time
		for(key in this.data.category){
			this.data.category[key].sort(sortByTime);
		}

		console.log(this.data.category);
	}	// End Chart Constructor Function

	Chart.prototype.xAxisRange = function(){

		var i, j, leni, lenj, itemi, item;			// Loop interation variables
		var minDate, maxDate, dateRange = [];		// Finding the range based on
		var itemDate;								// tick values

		for(i in this.data.category){				// Loop to find ranges
			itemi = this.data.category[i];
			for(j = 0, lenj = itemi.length; j < lenj; ++j){
				item = itemi[j];
				itemDate = joinDate(item.year, item.month);
				minDate = minDate ? minDate : itemDate;
				maxDate = maxDate ? maxDate : itemDate;

				if(minDate > itemDate){
					minDate = itemDate;
				}
				if(maxDate < itemDate){
					maxDate = itemDate;
				}


			} // End for-j
		}  // End for-i

		// Calculating range points
		for(i = 0; i < this.data.ticks.xaxis; ++i){
			dateRange.push(Math.floor(((i * (maxDate - minDate) / (this.data.ticks.xaxis - 1))) + minDate));
		}

		return dateRange;
	} // End xAxisRange

	Chart.prototype.yAxisRange = function(idx){		// Find y-axis range of data with index value provided

		var i, len;									// Loop iteration variables
		var arr = this.data.category[idx];			// Fetching the required array
		var min, max;	
		var valueRange = [];						// array for range	
		for(i = 0, len = arr.length; i < len; ++i){
			min = min ? min : arr[i].value;			// Setting first index value of array
			max = max ? max : arr[i].value;			// to min and max

			if(min > arr[i].value){
				min = arr[i].value;
			}

			if(max < arr[i].value){
				max = arr[i].value;
			}
		}

		for(i = 0; i < this.data.ticks.yaxis; ++i){
			valueRange.push(Math.floor(((i * (max - min) / (this.data.ticks.yaxis - 1))) + min));
		}
		//return [min, max];
		return valueRange;
	} // End yAxisRange


	Chart.prototype.intervalOf = function(){ // Function to find div intervals

		return {
			X : (this.data.dimensions.width / this.data.ticks.xaxis),
			Y : (this.data.dimensions.height / this.data.ticks.yaxis)
		}

	} // End interval

})();