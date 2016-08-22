function CrossController(model) {
    this.model = model;

    // Calculating dimensions
    var numSvgs = 2 + model.getZones().length;
    var width = (window.innerWidth / numSvgs) * 1.2;
    var height = 0.6 * width;
    this.dimension = {
        width: width,
        height: height
    };
    this.numSvgs = numSvgs;

} // end constructor crosscontroller

CrossController.prototype.render = function(selector) {

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
        height: this.dimension.height * 1,
        width: this.dimension.width,
    };
    smallerDimension = {
        height: this.dimension.height,
        width: this.dimension.width / 2,
    };
    dwarfDimension2 = {
        height: 30,
        width: this.dimension.width,
    }
    dwarfDimension = {
        height: 20,
        width: this.dimension.width,
    }
    dataAr = this.model.getPlotData();
    columnWidth = this.dimension.height / (this.model.getMaxColumnCount() * 2);

    // Rendering text product type
    item = new RenderEngine(this, selector, dwarfDimension, key);
    item.marginY *= 1;
    item.marginX *= 0.64;
    item.shiftRatioX *= 1;
    item.shiftRatioY *= 1;
    item.attachAxisX(new XAxis({
            height: dwarfDimension.height,
            width: dwarfDimension.width,
            shrink: 1,
            range: [0, 100]
        }))
        .attachAxisY(new YAxis({
            height: dwarfDimension.height,
            width: dwarfDimension.width,
            shrink: 1,
            range: ["Product type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Product"
            ],
            alignment: "left-10px left-10px"
        }))
        .drawAxisYLabel();

    for (key2 in this.model.getZones()) {
        key2 = this.model.getZones()[key2];
        arItem2 = arItem1[key2];
        canvasOb[key] = new RenderEngine(this, selector, dwarfDimension, key);
        item = canvasOb[key];
        item.marginY *= 1;
        item.marginX *= 1;
        item.shiftRatioX *= 1;
        item.shiftRatioY *= 1;
        item.attachAxisX(new XAxis({
                height: dwarfDimension.height,
                width: dwarfDimension.width,
                shrink: 1,
                range: [0, 100]
            }))
            .attachAxisY(new YAxis({
                height: dwarfDimension.height,
                width: dwarfDimension.width,
                shrink: 0.8,
                range: [key2],
                alignment: "left-10px left-10px "
            }))
            .drawAxisYLabel()
            .attachChart(new ColumnCrossChart(item, columnWidth))
            .renderChart(arItem2, this.model.getColorByProfit.bind(this.model));
    }


    for (key in dataAr) {
        arItem1 = dataAr[key];
        uniqueNameList = this.model.getUniqueNames(arItem1);



        item = new RenderEngine(this, selector, smallerDimension, key, null, null, true);
        item.marginY *= 0;
        item.marginX *= 0;
        item.shiftRatioX *= 1;
        item.shiftRatioY *= 1;
        item.attachAxisX(new XAxis({
                height: smallerDimension.height,
                width: smallerDimension.width,
                shrink: 1,
                range: [0, this.model.getMaxSale()]
            }))
            .attachAxisY(new YAxis({
                height: smallerDimension.height,
                width: smallerDimension.width,
                shrink: 0.8,
                range: [key],
                alignment: "right-10px"
            }))
            .drawAxisY(true)
            .drawAxisYLabel();

        item = new RenderEngine(this, selector, smallerDimension, key, null, null, true);
        item.marginY *= 0;
        item.marginX *= 0;
        item.shiftRatioX *= 1;
        item.shiftRatioY *= 1;
        item.attachAxisX(new XAxis({
                height: smallerDimension.height,
                width: smallerDimension.width,
                shrink: 1,
                range: [0, this.model.getMaxSale()]
            }))
            .drawAxisX()
            .attachAxisY(new YAxis({
                height: smallerDimension.height,
                width: smallerDimension.width,
                shrink: 0.8,
                range: uniqueNameList,
                alignment: "right-10px"
            }))
            .drawAxisY(true)
            .drawAxisYLabel();


        var isLastRow = Object.keys(dataAr)[Object.keys(dataAr).length - 1] === key;

        for (key2 in this.model.getZones()) {
            key2 = this.model.getZones()[key2];

            chartDimension = this.dimension;

            arItem2 = arItem1[key2];
            canvasOb[key] = new RenderEngine(this, selector, chartDimension, key, null, null, true);
            item = canvasOb[key];
            item.marginY *= 0;
            item.shiftRatioX *= 0;
            item.marginX *= 0;
            item.shiftRatioY *= 1;
            item.attachAxisX(new XAxis({
                    height: chartDimension.height,
                    width: chartDimension.width,
                    shrink: 0.8,
                    range: [0, this.model.getMaxSale()]
                }))
                .attachAxisY(new YAxis({
                    height: chartDimension.height,
                    width: chartDimension.width,
                    shrink: 0.8,
                    range: uniqueNameList
                }))
                .drawAxisX(true)
                .drawAxisY(true)
                .attachChart(new ColumnCrossChart(item, columnWidth))
                .renderChart(arItem2, this.model.getColorByProfit.bind(this.model));

        }

    }
    for (var i = 0; i < this.numSvgs - 2; ++i) {
        item = new RenderEngine(this, selector, this.dimension, key, true, i ? "chart x-axis-only" : "chart x-axis-only-first", true);
        item.marginY *= 3;
        item.attachAxisX(new XAxis({
                height: chartDimension.height,
                width: chartDimension.width,
                shrink: 0.8,
                range: [0, this.model.getMaxSale()],
                alignment: "down center-horizontal"
            }))
            .attachAxisY(new YAxis({
                height: chartDimension.height,
                width: chartDimension.width,
                shrink: 0.8,
                range: uniqueNameList
            }))
            .chartLabel("Sum of sales")
            .drawAxisX()
            .drawAxisXLabel()
            .attachChart(new ColumnCrossChart(item, columnWidth))
            .renderChart(arItem2, this.model.getColorByProfit.bind(this.model));

    }

}