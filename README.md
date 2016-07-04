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
		"xaxis" : 5,
		"yaxis" : 5
	},

	"caption" : "Caption here",
	"subcaption" : "Sub Caption here",
	"xaxisname" : "Time",
	"yaxiscount" : 3,
	"yaxisnames" : ["Label 1", "Label 2", "Label 3"],
	"yaxisshorthand" : ["y1", "y2", "y3"],

	"datasource" : [{
		"time" : {
			year : 2011,
			month : 4
		}
		"y1" : 300
	},

	{
		"time" : {
			year : 2009,
			month : 5
		}
		"y2" : 40,
		"y3" : 99
	}, 
	
	{
		"time" : {
			year : 2013,
			month : 1
		}
		"y1" : 532
		"y3" : 108
	}]
}
```