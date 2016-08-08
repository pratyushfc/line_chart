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
	this.numSvgs = numSvgs;

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
		dwarfDimension = {},
		dwarfDimension2 = {},
		biggerDimension = {},
		chartDimension = {},
		columnWidth;

	biggerDimension = {
		height : this.dimension.height * 1,
		width : this.dimension.width,
	};
	smallerDimension = {
		height : this.dimension.height,
		width : this.dimension.width / 2,
	};
	dwarfDimension2 = {
		height : 30,
		width : this.dimension.width,
	}
	dwarfDimension = {
		height : 20,
		width : this.dimension.width,
	}
	dataAr = this.model.getPlotData();
	columnWidth = this.dimension.height / (this.model.getMaxColumnCount() * 2);

	// Rendering text product type
	item = new RenderEngine(this, selector, dwarfDimension, key);
    item.marginY *= 1;
    item.marginX *= 1;
    item.shiftRatioX *= 1;
    item.shiftRatioY *= 1;
    item.attachAxisX(new XAxisCross(dwarfDimension, 1, {min : 0, max : 100}));
    //item.drawAxisX();
    item.attachAxisY(new YAxisCross(dwarfDimension, 0.8, ["Product type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Product"]));
    //item.drawAxisY();
    item.drawAxisYLabel("left-10px");
    item.attachChart(new ColumnCrossChart(item, columnWidth));
    item.renderChart(arItem2, this.model.getColorByProfit.bind(this.model));
		// Rendering top labels
	for(key2 of this.model.getZones()){
		arItem2 = arItem1[key2];
		canvasOb[key] = new RenderEngine(this, selector, dwarfDimension, key);
		item = canvasOb[key];
        item.marginY *= 1;
        item.marginX *= 1;
        item.shiftRatioX *= 1;
        item.shiftRatioY *= 1;
        item.attachAxisX(new XAxisCross(dwarfDimension, 1, {min : 0, max : 100}));
        //item.drawAxisX();
        item.attachAxisY(new YAxisCross(dwarfDimension, 0.8, [key2]));
        //item.drawAxisY();
        item.drawAxisYLabel();
        item.attachChart(new ColumnCrossChart(item, columnWidth));
        item.renderChart(arItem2, this.model.getColorByProfit.bind(this.model));
	}


	for(key in dataAr){
		arItem1 = dataAr[key];
		uniqueNameList = this.model.getUniqueNames(arItem1);



			item = new RenderEngine(this, selector, smallerDimension, key, null, null,true);
	        item.marginY *= 0;
	        item.marginX *= 0;
	        item.shiftRatioX *= 1;
	        item.shiftRatioY *= 1;
	        item.attachAxisX(new XAxisCross(smallerDimension, 1, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(smallerDimension, 0.8, [key]));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        item.drawAxisYLabel("right-10px right-10px");
	        // Drawing product type
	        item = new RenderEngine(this, selector, smallerDimension, key, null, null,true);
	        item.marginY *= 0;
	        item.marginX *= 0;
	        item.shiftRatioX *= 1;
	        item.shiftRatioY *= 1;
	        item.attachAxisX(new XAxisCross(smallerDimension, 1, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(smallerDimension, 0.8, uniqueNameList));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        item.drawAxisYLabel("right-10px");


	        var isLastRow = Object.keys(dataAr)[Object.keys(dataAr).length - 1] === key;

		for(key2 of this.model.getZones()){

			chartDimension =  this.dimension;

			arItem2 = arItem1[key2];
			canvasOb[key] = new RenderEngine(this, selector, chartDimension, key, null, null,true);
			item = canvasOb[key];
	        item.marginY *= 0;
        	item.shiftRatioX *= 0;
		    item.marginX *= 0;
	        item.shiftRatioY *= 1;
	        item.attachAxisX(new XAxisCross(chartDimension, 1, {min : 0, max : this.model.getMaxSale()}));
	        item.drawAxisX();
	        item.attachAxisY(new YAxisCross(chartDimension, 0.8, uniqueNameList));
	        item.drawAxisY();
	        item.drawAxisXLabel();
	        //item.drawAxisYLabel();
	        item.attachChart(new ColumnCrossChart(item, columnWidth));
	        item.renderChart(arItem2, this.model.getColorByProfit.bind(this.model));
			//item.rootElement.appendChild(document.createElement("br"));

		}

	}
	for(var i = 0; i < this.numSvgs - 2; ++i){
		item = new RenderEngine(this, selector, this.dimension, key, true, i ? "chart x-axis-only" : "chart x-axis-only-first", true);
        item.marginY *= 3;
        item.attachAxisX(new XAxisCross(this.dimension, 1, {min : 0, max : this.model.getMaxSale()}));
        item.drawAxisX();
        item.attachAxisY(new YAxisCross(this.dimension, 0.8, ["uniqueNameList"]));
        //item.drawAxisY();
        item.drawAxisXLabel();
        //item.drawAxisYLabel();
        item.attachChart(new ColumnCrossChart(item, columnWidth));
        item.renderChart(arItem2, this.model.getColorByProfit.bind(this.model)); 
        item.chartLabel("Sum of sales");       
    
	}

}
