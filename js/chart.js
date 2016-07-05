// Semicolon; IIFE wont be parsed as function parameter
;(function(){
	"use strict";
	
	// Exposing public Api
	this.RenderChart = function(data, selector){
		var chart = new Chart(data);
	};

	function Chart(data){			// Contructor function to parse and validate data

		var i, len,					// Varibles for loop iteration
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
 
		this.data.yaxisnames = data.yaxisnames || [];	// Default blank array for yaxisname
		this.data.separator = data.separator || '|';	// Default '|' for separator

		this.data.category = [];						// A array to store array of data 
														// on basis of their yaxis index

		if(data.dimensions){		// If parameter data has dimensions, copy them over to
									// Chart's data
			this.data.dimensions.width = data.dimensions.width || this.data.dimensions.width;
			this.data.dimensions.height = data.dimensions.height || this.data.dimensions.height;
		}

		if(data.ticks){				// If parameter data has ticks, copy them over to
									// Chart's data
			this.data.ticks.xaxis = data.ticks.xaxis || this.data.ticks.xaxis;
			this.data.ticks.yaxis = data.ticks.yaxis || this.data.ticks.yaxis;
		}

		// Create an array for every single yaxis name
		for(i = 0, len = this.data.yaxis.length; i < len; ++i){
			this.data.category.push([]);
		}

		if(Array.isArray(data.data)){	// Copy over data to category if Array
			for(i = 0, len = data.data.length; i < len; ++i){
				item = data.data[i];
				item = item.split(this.data.separator);
				
				if(item.length !== 3){	// Every data item has 3 defined fields
					continue;			// if not skip over
				}

				date = item[0];			// Extracting all three fields
				index = item[1];		// passed in data item
				value = item[2];

				if(index < 0 || index >= this.data.yaxisnames.length){	// Ignoring invalid data
					continue;
				}

				value = value * 1;				// Convert to number if valid data
				if(typeof value !== "number"){ // If value not a number; ignore
					continue;
				}

				date = new Date(date);

				this.data.category[index].push({	// Push new object with date 
					year : date.getYear(),			// and value to their 
					month : date.getMonth(),		// corresponding category
					value : value
				});

			}	// End for loop
		}	// End copy data 

		console.log(this.data.category);
	}	// End Chart Constructor Function

})();