function CrossController(model){
	this.model = model;
	console.log(model)

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
		dataAr = [],
		canvasOb = {};

	dataAr = this.model.getPlotData();

	for(key in dataAr){
		canvasOb[key] = new RenderEngine(this, selector, this.dimension, key);
		item = canvasOb[key];
        item.shiftRatioX = 1;
        item.shiftRatioY = 1;
        item.marginY *= 1;
        item.marginX *= 1;
        item.attachAxisX(new XAxisCross(this.dimension, 0.8, {min : 0, max : 100}));
        item.drawAxisX();
        item.attachAxisY(new YAxisCross(this.dimension, 0.8, ["A", "B"]));
        item.drawAxisY();
        item.drawAxisXLabel();
        item.drawAxisYLabel();
	}


}
