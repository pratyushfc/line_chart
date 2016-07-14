# Line Chart
Multiple variables plot against time in multiple synchronised chart

# Steps to Run

```
- Clone the github repo
- Install node and npm
- cd directory
- npm install[optional]
- npm start
- Open browser to localhost:3000
```

# Json Structure

```
{
	"dimensions" : {					// Size of canvas
		"width" : 600,		
		"height" : 400,
	},

	"caption" : "Caption here",
	"subcaption" : "Sub Caption here",

	interpolation : true,				// Default true; if false nearest value will be shown

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