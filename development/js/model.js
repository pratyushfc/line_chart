function Model(data) { // Contructor function to parse and validate data

    var i, len, key, // Varibles for loop iteration
        item, // Data parsing variables
        date,
        index,
        value, 
        dataAr = data[data.datasource || "data"];

    if (typeof data === "string") { // If data is string; convert to
        data = JSON.parse(data); // JSON object
    }

    this.data = {}; // Initialize Chart's data variable
    this.data.dimensions = { // Initializing dimension property with default value
        width: 500,
        height: 600
    };

    this.data.ticks = { // Initializing ticks property in Chart's data
        xaxis: 5,
        yaxis: 5
    }

    this.interpolation = true;          // Default value of interpolation
    if(data.interpolation === false){   // to false
        this.interpolation = false;
    }

    this.type = data.type || "line"; // Fetching type of chart; default line
    this.data.caption = data.caption || ""; // Fetching values for caption and
    this.data.subcaption = data.subcaption || ""; // subcaption; default "" string
    this.xaxisname = data.xaxisname || "time"; // Default name for x-axis

    this.data.variables = data.variables || []; // Default blank array for yaxis variables
    this.data.separator = data.separator || '|'; // Default '|' for separator

    this.data.category = {}; // An object to store array of data
    // on basis of their yaxis variable names
    this.data.dateArray = []; // Array to store all dates

    if (data.interpolation === false) { // Turning off interpolation if required by user
        this.interpolation = false;
    }

    if (data.dimensions) { // If parameter data has dimensions, copy them over to
        // Chart's data
        this.data.dimensions.width = data.dimensions.width || this.data.dimensions.width;
        this.data.dimensions.height = data.dimensions.height || this.data.dimensions.height;
    }

    if (data.ticks) { // If parameter data has ticks, copy them over to
        // Chart's data
        this.data.ticks.xaxis = data.ticks.xaxis || this.data.ticks.xaxis;
        this.data.ticks.yaxis = data.ticks.yaxis || this.data.ticks.yaxis;
    }


    if (Array.isArray(dataAr)) { // Copy over data to category if Array
        for (i = 0, len = dataAr.length; i < len; ++i) {
            item = dataAr[i];
            date = new Date(item.time);
            for (key in item) {
                if (key === this.xaxisname) {
                    continue;
                }

                this.data.category[key] = this.data.category[key] || [];

                var joinedDate = joinDate(date.getYear(), date.getMonth());

                this.data.category[key].push({
                    value : item[key],
                    xaxis : item[this.xaxisname]
                });

            }

            // Push current date to date Array
            if(this.data.dateArray.indexOf(item[this.xaxisname]) === -1){
                this.data.dateArray.push(item[this.xaxisname]);
            }

        } // End for loop
    } // End copy data

    // Sorting each category's data array by time
    for (key in this.data.category) {
        this.data.category[key].sort(sortByTime);
    }
    // Sorting the date array
    this.data.dateArray.sort(sortByTime);
} // End Chart Constructor Function

Model.prototype.getMaxPointsOfAllChart = function() {
    var max = 0;

    for (var key in this.data.category) {
        if (this.data.category[key].length > max) {
            max = this.data.category[key].length;
        }
    }
    return max;

}

Model.prototype.getType = function() {
        return this.type;
    } // end getType

Model.prototype.getMinX = function() {
        return this.data.dateArray[0];
    } //  End getMinX

Model.prototype.getMaxX = function() {
        return this.data.dateArray[this.data.dateArray.length - 1];
    } //  End getMaxX

Model.prototype.getMinY = function(idx) {
        var i, len; // Loop iteration variables
        var arr = this.data.category[idx]; // Fetching the required array
        var min = arr[0].value;
        for (i = 0, len = arr.length; i < len; ++i) { // Setting first index value of array to min

            if (min > arr[i].value) {
                min = arr[i].value;
            }
        }
        return min;
    } //  End getMinY

Model.prototype.getMaxY = function(idx) {
        var i, len; // Loop iteration variables
        var arr = this.data.category[idx]; // Fetching the required array
        var max = arr[0].value;
        for (i = 0, len = arr.length; i < len; ++i) { // Setting first index value of array to max

            if (max < arr[i].value) {
                max = arr[i].value;
            }
        }
        return max;
    } //  End getMaxY

Model.prototype.getX = function() {
        return this.data.dateArray;
    } // end getX

Model.prototype.getY = function(ob) {
        var ob = ob || {},
            idx = ob.key,
            isDateType = ob.isDateType || false,
            isNumericType = ob.isNumericType || false,
            t1, t2,
            _this = this,
            sortAr = ob.sortAr || [];

        if(ob.sortAr){

            this.data.category[idx].sort(function(a, b){

                if(isDateType){
                    a = new Date(a.xaxis);
                    b = new Date(b.xaxis);

                    a = joinDate(a.getYear(), a.getMonth());
                    b = joinDate(b.getYear(), b.getMonth());

                    return a - b;
                } else if(isNumericType){
                    return a.xaxis - b.xaxis;
                } else {
                    return a.xaxis.in(sortAr) - b.xaxis.in(sortAr);
                }

            });
        }

        return this.data.category[idx];
    } // end getY

Model.prototype.getWidth = function() {
        return this.data.dimensions.width;
    } // end getWidth
Model.prototype.getHeight = function() {
        return this.data.dimensions.height;
    } // end getHeight

Model.prototype.getAllVariables = function() {
        return Object.keys(this.data.category);
    } // End getAllVariables

Model.prototype.getCaption = function() {
        return this.data.caption;
    } // End getCaption()

Model.prototype.getSubCaption = function() {
        return this.data.subcaption;
    } // End getSubCaption()

