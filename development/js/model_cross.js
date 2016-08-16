function CrossModel(data){
	this.data = data;
	this.__crunch__();
} // end constructor function

CrossModel.prototype.__crunch__ = function(){
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

	for(i = 0, len = dataAr.length; i < len; ++i){
		item = dataAr[i];

		this.dataStore[item.category] = this.dataStore[item.category] || {};
		this.dataStore[item.category][item.zone] = this.dataStore[item.category][item.zone] || [];

		this.dataStore[item.category][item.zone].push({
			name : item.name,
			sale : item.sale,
			profit : item.profit
		});		

		this.productsPerCategory[item.category] = this.productsPerCategory[item.category] || [];

		if(this.productsPerCategory[item.category].indexOf(item.name) === -1){
			this.productsPerCategory[item.category].push(item.name);
		} 

		if(this.uniqueZones.indexOf(item.zone) === -1){
			this.uniqueZones.push(item.zone);
		}

		if(item.sale > this.max.sale){
			this.max.sale = item.sale;
		}

		if(item.profit > 0){
			if(item.profit > this.max.profit){
				this.max.profit = item.profit;
			}

			if(item.profit < this.min.profit){
				this.min.profit = item.profit;
			}
		} else {
			if(item.profit < this.max.loss){
				this.max.loss = item.profit;
			}

			if(item.profit > this.min.loss){
				this.min.loss = item.profit;
			}
		}

	}

}

CrossModel.prototype.getUniqueNames = function(ob){

	var i = 0, 
		len = 0,
		key = "",
		item = [],
		uniqueNames = [];

	for(key in ob){
		item = ob[key];

		for(i = 0, len = item.length; i < len; ++i){
			if(uniqueNames.indexOf(item[i].name) === -1){
				uniqueNames.push(item[i].name);
			}
		}
	}
	uniqueNames.sort(function(a, b){
		return (a < b ? -1 : (a > b ? 1 : 0) ) * -1;
	});
	return uniqueNames;
}

CrossModel.prototype.getMaxColumnCount = function() {
	var key = "",
		maxColumn = 0;

	for(key in this.dataStore){
		if(this.getUniqueNames(this.dataStore[key]).length > maxColumn){
			maxColumn = this.getUniqueNames(this.dataStore[key]).length;
		} 
	}
	return maxColumn;
}	// end getMin

CrossModel.prototype.getMaxSale = function() {
	return this.max.sale;
}	// end getMin

CrossModel.prototype.getZones = function(){
	this.uniqueZones.sort(function(a, b){
		if(a === b){
			return 0;
		}
		return a > b ? 1 : -1;
	});
	return this.uniqueZones;
}	// end getZones

CrossModel.prototype.getPlotData = function(){
	return this.dataStore;
}	// end getPlotData

CrossModel.prototype.getColorByProfit = function(profit){
	var minProfit = this.min.profit;
	var maxProfit = this.max.profit;
	var minLoss = this.min.loss;
	var maxLoss = this.max.loss;

	var color1, color2;

	if(profit > 0){
		var ratio = (profit - minProfit) / (maxProfit - minProfit);
	} else {
		var ratio = (profit - maxLoss) / (minLoss - maxLoss);
	}
	
	if(ratio < 0){
		ratio *= -1;
	}

	if(profit > 0 ){
		color1 = this.data.colorRange.minprofit;
		color2 = this.data.colorRange.maxprofit;
	} else {
		color1 = this.data.colorRange.minloss;
		color2 = this.data.colorRange.maxloss;
		//profit = -profit;
	}
	var hex = function(x) {
	    x = x.toString(16);
	    return (x.length <= 1) ? '0' + x : x;
	};

	var r = Math.ceil(parseInt(color1.substring(0,2), 16) * ratio + parseInt(color2.substring(0,2), 16) * (1-ratio));
	var g = Math.ceil(parseInt(color1.substring(2,4), 16) * ratio + parseInt(color2.substring(2,4), 16) * (1-ratio));
	var b = Math.ceil(parseInt(color1.substring(4,6), 16) * ratio + parseInt(color2.substring(4,6), 16) * (1-ratio));
	var middle = hex(r) + hex(g) + hex(b);
	return "#" + middle;
}

