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
		canvasOb = {},
		smallerDimension = {},
		columnWidth;


	smallerDimension = {
		height : this.dimension.height,
		width : this.dimension.width / 2,
	}
	dataAr = this.model.getPlotData();
	columnWidth = this.dimension.height / (this.model.getMaxColumnCount() * 2);

	for(key in dataAr){
		arItem1 = dataAr[key];
		uniqueNameList = this.model.getUniqueNames(arItem1);


			item = new RenderEngine(this, selector, smallerDimension, key);
	        item.marginY *= 0;
	        item.marginX *= 0;
	        item.shiftRatioX *= 1;
	        item.shiftRatioY *= 1;
	        item.attachAxisX(new XAxisCross(smallerDimension, 1, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(smallerDimension, 0.8, [key]));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        item.drawAxisYLabel("right");
	        // Drawing product type
	        item = new RenderEngine(this, selector, smallerDimension, key);
	        item.marginY *= 0;
	        item.marginX *= 0;
	        item.shiftRatioX *= 1;
	        item.shiftRatioY *= 1;
	        item.attachAxisX(new XAxisCross(smallerDimension, 1, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(smallerDimension, 0.8, uniqueNameList));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        item.drawAxisYLabel();

		for(key2 of this.model.getZones()){
			arItem2 = arItem1[key2];
			canvasOb[key] = new RenderEngine(this, selector, this.dimension, key);
			item = canvasOb[key];
	        item.marginY *= 0;
	        item.marginX *= 0;
	        item.shiftRatioX *= 0;
	        item.shiftRatioY *= 1;
	        item.attachAxisX(new XAxisCross(this.dimension, 1, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(this.dimension, 0.8, uniqueNameList));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        //item.drawAxisYLabel();
	        item.attachChart(new ColumnCrossChart(item, columnWidth));
	        item.renderChart(arItem2, this.model.getColorByProfit.bind(this.model));
		}
		item.rootElement.appendChild(document.createElement("br"));
	}


}
