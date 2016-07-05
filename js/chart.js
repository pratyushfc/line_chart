// Semicolon; IIFE wont be parsed as function parameter
;(function(){
	"use strict";
	
	// Exposing public Api
	global.RenderChart = function(data, selector){
		var chart = new Chart(data);
		console.log(chart.xAxisRange());
		console.log(chart.yAxisRange("sale"));
	};

	var sortByTime = function(a, b){
		if(a.year === b.year){
			a.month > b.month;
		}
		return a.year > b.year;
	}

	function Chart(data){			// Contructor function to parse and validate data

		var i, len, key,					// Varibles for loop iteration
			item, 					// Data parsing variables
			date,
			index,
			value;

		if(typeof data === "string"){	// If data is string; convert to 
			data = JSON.parse(data);	// JSON object
		}

		this.data = {};				// Initialize Chart's data variable
		this.data.dimensions = {	// Initializing dimension property with default value
			width : 500,
			height : 500
		};

		this.data.ticks = {			// Initializing ticks property in Chart's data
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


		if(Array.isArray(data.data)){	// Copy over data to category if Array
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
		
		
		console.log(this.data.category);
	}	// End Chart Constructor Function

	Chart.prototype.xAxisRange = function(){

		var i, j, leni, lenj, itemi, item;	// Loop interation variables
		var minYear, minMonth, maxYear, maxMonth;	// Finding Ranges
		for(i in this.data.category){	// Loop to find ranges
			itemi = this.data.category[i];
			for(j = 0, lenj = itemi.length; j < lenj; ++j){
				item = itemi[j];

				minYear = minYear ? minYear : item.year;	// Initiazlizing min max variables to
				maxYear = maxYear ? maxYear : item.year;	// first items value
				minMonth = minMonth ? minMonth : item.month;
				maxMonth = maxMonth ? maxMonth : item.month;

				if(minYear > item.year){
					minYear = item.year;
					minMonth = item.month;
				}

				if(maxYear < item.year){
					maxYear = item.year;
					maxMonth = item.month;
				}

				if(minYear === item.year && minMonth > item.month){	// Change minMonth only when year
					minMonth = item.month;							// is minimum
				}

				if(maxYear === item.year && maxMonth < item.month){	// Change maxMonth only when year 
					maxMonth = item.month;							// is maximum
				}

			} // End for-j
		}  // End for-i

		// return [[minMonth, minYear], [maxMonth, maxYear]];
		return {
			min : {
				year : minYear,
				month : minMonth
			},
			max : {
				year : maxYear,
				month : maxMonth
			}
		};
	} // End xAxisRange

	Chart.prototype.yAxisRange = function(idx){		// Find y-axis range of data with index value provided

		var i, len;									// Loop iteration variables
		var arr = this.data.category[idx];			// Fetching the required array
		var min, max;								// variables for range	
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

		//return [min, max];
		return {
			min : min,
			max : max
		};
	} // End yAxisRange

})();



RenderChart({
	"dimensions" : {					// Size of canvas
		"width" : 400,		
		"height" : 400,
	},

	"ticks" : {
		"xaxis" : 5,					// Number of ticks to be shown on X and Y axis
		"yaxis" : 5
	},

	"caption" : "Caption here",
	"subcaption" : "Sub Caption here",
	"xaxisname" : "Time",				// Label for X-axis
	"variables" : ['sale', 'population'], 	// If not provided all unique   
											// attributes will be mapped

	"separator" : "|", 					// delimiter for data source; '|' default

	"data" : [{
			time : "05-05-2012",			// time in mm-dd-yyyy format
			sale : 120
		}, 
		{
			time : "06-06-2015",
			hike : 1.5,
			sale : 45
		},{
			time : "01-09-2006",			// time in mm-dd-yyyy format
			sale : 150
		},{
			time : "05-02-2011",			// time in mm-dd-yyyy format
			sale : 103
		},{
			time : "04-11-2012",			// time in mm-dd-yyyy format
			sale : 89
		},]			
});