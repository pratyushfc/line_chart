// Exposing public Api
window.MultiVariantChart = function(data, selector) {
    var t = performance.now();
    if(data.crosstab){
        var model = new CrossModel(data);
        this.engine = new CrossController(model);
        this.engine.render(selector + "cross");
    } else {
        var model = new Model(data);
        this.engine = new Engine(model);
        this.engine.render(selector, model.getType());
    }
    console.log("rendered in ", performance.now() - t, " mili seconds")
};

MultiVariantChart.prototype.sort = function(fn) {
    this.engine.rearrange(fn);
}

// Data function; helper for sorting

MultiVariantChart.prototype.reverse = function(fn) {
        this.engine.reverse();
    } // end reverse

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