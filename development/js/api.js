"use strict"
// Exposing public Api
window.MultiVariantChart = function(data, selector) {
    var t = performance.now(),
        dataAr = data[data.datasource || "data"];
    if (this.isCrossChart(dataAr) && !data.crosschartoff) {
        var model = new CrossModel(data);
        this.engine = new CrossController(model);
        document.getElementById(selector).setAttribute("id", selector + "cross");
        this.engine.render(selector + "cross");
    } else {
        var model = new Model(data);
        this.engine = new Engine(model);
        this.engine.render({
            selector: selector,
            type: model.getType(),
            smartCategory: data.smartCategory
        });
    }
    console.log("rendered in ", performance.now() - t, " ms")
};

MultiVariantChart.prototype.sort = function(fn) {
    this.engine.rearrange(fn);
}   // end sort


MultiVariantChart.prototype.reverse = function(fn) {
    this.engine.reverse();
} // end reverse

// Function to determine if data is of crosschart type
MultiVariantChart.prototype.isCrossChart = function(arr) {
    var i = 0,
        len = arr.length;
    for(i = len; i--; ){
        if(!arr[i].category || !arr[i].zone){
            return false;
        }
        if(!arr[i].profit || !arr[i].sale || !arr[i].name){
            return false;
        }
    }
    return true;
} // end isCrossChart

// Data function; helper for sorting
window.Sort = {
    average: function(arr) {
        var sum = 0,
            i;
        for (i = arr.length; --i;) {
            sum += arr[i].value;
        }
        return sum / arr.length;
    },
    min: function(arr) {
        var min = arr[0].value,
            i;
        for (i = arr.length; --i;) {
            if (min > arr[i].value) {
                min = arr[i].value;
            }
        }
        return min;
    },
    max: function(arr) {
        var max = arr[0].value,
            i;
        for (i = arr.length; --i;) {
            if (max < arr[i].value) {
                max = arr[i].value;
            }
        }
        return max;
    },
    shuffle: function(arr) {
        return Math.random() - Math.random();
    }
}