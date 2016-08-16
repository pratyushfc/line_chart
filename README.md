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
    "dimensions": { // Size of canvas
        "width": 370,
        "height": 240,
    },

    "caption": "Caption",
    "subcaption": "Subcaption",
    "type": "column",           // line, column
    "crosstab": true,       
    "datasource" : "data",      // Default - data
    "smartCategory": true,      // Detect weeks, months
    "xaxisname": "time",        // default - time
    "colorRange": {
        "minprofit": "aaaaaa",
        "maxprofit": "000000",
        "minloss": "770000",
        "maxloss": "ff6600"
    },


    "data": [{
        "category": "Coffee",
        "zone": "South",
        "name": "Amaretto",
        "profit": -5105,
        "sale": 19011
    }, {
        "category": "Coffee",
        "zone": "West",
        "name": "Amaretto",
        "profit": -5105,
        "sale": 7011
    }]


```