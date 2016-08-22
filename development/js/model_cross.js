function CrossModel(data) {
    this.data = data;
    this.__crunch__();
} // end constructor function

// Arranging data in meaningful order to help in displaying it properly
// as required by controllers and render engines
CrossModel.prototype.__crunch__ = function() {
    var i = 0,
        j = 0,
        len = 0,
        len2 = 0,
        item = {},
        item2 = {},
        key = "",
        key2 = "",
        item3 = {},
        data = this.data,
        dataAr = data[data.datasource || "data"];

    this.dataStore = {};
    this.max = {};
    this.max.sale = -Infinity;
    this.max.profit = -Infinity;
    this.max.loss = Infinity;
    this.min = {};
    this.min.profit = Infinity;
    this.min.loss = -Infinity;

    this.uniqueZones = [];
    this.productsPerCategory = {};


    // Divide the data and store it in sataStore Object according to its
    // Category. Each category is an object which stores data divided by zones
    // zone contains Array that is data which is to be plotted in one chart
    // of the crosstab chart
    for (i = 0, len = dataAr.length; i < len; ++i) {
        item = dataAr[i];

        this.dataStore[item.category] = this.dataStore[item.category] || {};
        this.dataStore[item.category][item.zone] = this.dataStore[item.category][item.zone] || [];

        this.dataStore[item.category][item.zone].push({
            name: item.name,
            sale: item.sale,
            profit: item.profit
        });

        this.productsPerCategory[item.category] = this.productsPerCategory[item.category] || [];

        if (this.productsPerCategory[item.category].indexOf(item.name) === -1) {
            this.productsPerCategory[item.category].push(item.name);
        }

        if (this.uniqueZones.indexOf(item.zone) === -1) {
            this.uniqueZones.push(item.zone);
        }

        if (item.sale > this.max.sale) {
            this.max.sale = item.sale;
        }
        // Storing profit and loss for the color
        // transition
        if (item.profit > 0) {
            if (item.profit > this.max.profit) {
                this.max.profit = item.profit;
            }

            if (item.profit < this.min.profit) {
                this.min.profit = item.profit;
            }
        } else {
            if (item.profit < this.max.loss) {
                this.max.loss = item.profit;
            }

            if (item.profit > this.min.loss) {
                this.min.loss = item.profit;
            }
        }

    }
    console.log(this.dataStore)
}

// Getting all the different product names in an array
CrossModel.prototype.getUniqueNames = function(ob) {

    var i = 0,
        len = 0,
        key = "",
        item = [],
        uniqueNames = [];

    for (key in ob) {
        item = ob[key];

        for (i = 0, len = item.length; i < len; ++i) {
            if (uniqueNames.indexOf(item[i].name) === -1) {
                uniqueNames.push(item[i].name);
            }
        }
    }
    uniqueNames.sort(function(a, b) {
        return (a < b ? -1 : (a > b ? 1 : 0)) * -1;
    });
    return uniqueNames;
}

// Get max number of column ins a chart
// to decide overall column width
CrossModel.prototype.getMaxColumnCount = function() {
        var key = "",
            maxColumn = 0;

        for (key in this.dataStore) {
            if (this.getUniqueNames(this.dataStore[key]).length > maxColumn) {
                maxColumn = this.getUniqueNames(this.dataStore[key]).length;
            }
        }
        return maxColumn;
    } // end getMin

CrossModel.prototype.getMaxSale = function() {
    return this.max.sale;
} // end getMin

CrossModel.prototype.getZones = function() {
    this.uniqueZones.sort(function(a, b) {
        if (a === b) {
            return 0;
        }
        return a > b ? 1 : -1;
    });
    return this.uniqueZones;
} // end getZones

CrossModel.prototype.getPlotData = function() {
    return this.dataStore;
} // end getPlotData

// Function to get color of column based on profit or loss
CrossModel.prototype.getColorByProfit = function(profit) {
    var minProfit = this.min.profit,
        maxProfit = this.max.profit,
        minLoss = this.min.loss,
        maxLoss = this.max.loss,
        color1 = "", 
        color2 = "",
        ratio = 0,
        r = 0,
        g = 0,
        b = 0;

    this.data.colorRange = this.data.colorRange || {};

    // If profit less than zero use loss ranges;
    // otherwise use profit ranges
    if (profit > 0) {
        ratio = (profit - minProfit) / (maxProfit - minProfit);
    } else {
        ratio = (profit - maxLoss) / (minLoss - maxLoss);
    }

    if (ratio < 0) {
        ratio *= -1;
    }

    // Use profit color if profit greater than zero;
    // Otherwise use loss color
    if (profit > 0) {
        color1 = this.data.colorRange.maxprofit || "000000";
        color2 = this.data.colorRange.minprofit || "aaaaaa";
    } else {
        color1 = this.data.colorRange.minloss || "ff9966";
        color2 = this.data.colorRange.maxloss || "770000";
        //profit = -profit;
    }
    // return hex value of integer
    var hex = function(x) {
        x = "00" + x.toString(16);
        return x.substr(x.length - 2);
    };

    r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
    g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
    b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));
    var middle = hex(r) + hex(g) + hex(b);
    return "#" + middle;
}