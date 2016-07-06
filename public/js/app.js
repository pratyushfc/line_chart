RenderChart({
	"dimensions" : {						// Size of canvas
		"width" : 400,		
		"height" : 400,
	},

	"ticks" : {
		"xaxis" : 5,						// Number of ticks to be shown on X and Y axis
		"yaxis" : 5
	},

	"caption" : "Caption here",
	"subcaption" : "Sub Caption here",
	"xaxisname" : "Time",					// Label for X-axis
	"variables" : ['sale', 'population'], 	// If not provided all unique   
											// attributes will be mapped

	"separator" : "|", 						// delimiter for data source; '|' default

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
			sale : 150,
			hike : 1.2
		},{
			time : "05-02-2011",			// time in mm-dd-yyyy format
			sale : 103
		},{
			time : "04-11-2012",			// time in mm-dd-yyyy format
			sale : 89,
			hike : 1.3
		},]			
});