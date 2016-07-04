# Line Chart
Multiple variables plotted against time in multiple synchronised chart

# Json Structure

```
{
	"dimensions" : {
		"width" : 400,		
		"height" : 400,
	},

	"ticks" : {
		"xaxis" : 5,					// Number of ticks to be shown on either of X or Y axis
		"yaxis" : 5
	},

	"caption" : "Caption here",
	"subcaption" : "Sub Caption here",
	"xaxisname" : "Time",				// Label for X-axis
	"yaxiscount" : 3,					// Will map to number of charts
	"yaxisnames" : ["Label 1", 			// Y-axis names for different charts
					"Label 2",			 
					"Label 3"],  

	"datasource" : [{					// Datasource; array of objects
		"time" : {						// time required
			year : 2011,		
			month : 4
		},

		"data" : [ "93",				// Data will be an array
		 			{ 
		 				index : 2,		// Object or values
		 				value : 96		// if value chart will be mapped with array index
		 			}]
	},

	{
		"time" : {
			year : 2009,
			month : 5
		},

		"data" : [89, 56, 78]		// Only values
	}, 
	
	{
		"time" : {
			year : 2013,
			month : 1
		},

		"data" : [{					// Only objects
				index : 1,
				value : 3
			}]
	}]
}
```