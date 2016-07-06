# Line Chart
Multiple variables plot against time in multiple synchronised chart

# Json Structure

```
{
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
			time : 05-15-2012,			// time in mm-dd-yyyy format
			sale : 120
		}, 
		{
			time : 06-26-2015,
			hike : 1.5
		}]			
}
```