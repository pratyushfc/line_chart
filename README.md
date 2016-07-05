# Line Chart
Multiple variables plotted against time in multiple synchronised chart

# Json Structure

```
{
    "dimensions" : {                    // Size of canvas
        "width" : 400,      
        "height" : 400,
    },

    "ticks" : {
        "xaxis" : 5,                    // Number of ticks to be shown on X and Y axis
        "yaxis" : 5
    },

    "caption" : "Caption here",
    "subcaption" : "Sub Caption here",
    "xaxisname" : "Time",               // Label for X-axis
    "yaxisnames" : ["Label 1",          // Label for Y axes of different sub charts
                    "Label 2",           
                    "Label 3"],  

    "separator" : "|",                  // delimiter for data source; '|' default

    "datasource" : ["04-13-2015|0|96",  // time|index|value
                    "01-19-2015|1|56",  // time in mm-dd-yyyy
                    "03-25-106|1|90"]           
}
```