RenderChart({
	"dimensions" : {						// Size of canvas
		"width" : 1200,		
		"height" : 400,
	},

	"caption" : "Caption here",
	"subcaption" : "Sub Caption here",

	"data" : [
		{
			time : "05-05-2012",			// time in mm-dd-yyyy format
			sale : 160000000
		}, 
		{
			time : "06-06-2015",
			hike : 15,
			sale : 40000000
		},{
			time : "01-09-2006",			// time in mm-dd-yyyy format
			sale : 160000000,
			hike : 12
		},{
			time : "05-02-2011",			// time in mm-dd-yyyy format
			sale : 103000000
		},{
			time : "04-11-2012",			// time in mm-dd-yyyy format
			sale : 80000000,
			hike : 13
		},{
			time : "01-01-2000",
			sale : 0
		},{
			time : "11-01-2004",
			sale : 200000000
		},{
			time : "04-01-2005",
			sale : 40000000
		},{
			time : "09-06-2017",
			hike : 19
		},{
			time : "09-06-2019",
			hike : 14
		},{
			time : "09-06-2020",
			hike : 12
		}]			
}, 'graph');

