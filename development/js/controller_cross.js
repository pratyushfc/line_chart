function CrossController(model){
	this.model = model;

	// Calculating dimensions
	var numSvgs = 2 + model.getZones().length;
	var width = (window.innerWidth / numSvgs) * 1.2;
	var height = 0.6 * width;
	this.dimension = {
		width : width,
		height : height
	};

}	// end constructor crosscontroller

CrossController.prototype.render = function(selector){

	var i = 0,
		len = 0,
		item = {},
		key = "",
		key2 = "",
		dataAr = [],
		arItem1 = {},
		arItem2 = [],
		uniqueNameList = [],
		canvasOb = {};

	dataAr = this.model.getPlotData();

	for(key in dataAr){
		arItem1 = dataAr[key];
		uniqueNameList = this.model.getUniqueNames(arItem1);
		for(key2 of this.model.getZones()){
			arItem2 = arItem1[key2];
			canvasOb[key] = new RenderEngine(this, selector, this.dimension, key);
			item = canvasOb[key];
	        item.marginY *= 1;
	        item.marginX *= 1;
	        item.attachAxisX(new XAxisCross(this.dimension, 0.8, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(this.dimension, 0.8, uniqueNameList));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        item.drawAxisYLabel();
		}
	}


}
