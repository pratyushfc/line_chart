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
		data = this.data;

	this.dataStore = {};
	this.max = {};
	this.max.sale = 0;
	this.max.profit = 0;

	this.uniqueZones = [];
	this.productsPerCategory = {};

	for(i = 0, len = data.dataset.length; i < len; ++i){
		item = data.dataset[i];

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

		if(item.profit > this.max.profit){
			this.max.profit = item.profit;
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

CrossModel.prototype.getMaxSale = function() {
	return this.max.sale;
}	// end getMin

CrossModel.prototype.getZones = function(){
	return this.uniqueZones;
}	// end getZones

CrossModel.prototype.getPlotData = function(){
	return this.dataStore;
}	// end getPlotData