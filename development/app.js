var chart = new MultiVariantChart({
	"dimensions" : {						// Size of canvas
		"width" : 370,
		"height" : 240,
	},

	"caption" : "Caption",
	"subcaption" : "Subcaption",
	"interpolation" : true,					// Default true
	"type" : "line",						// line, column
	"crosstab" : true,

	"data" : [
		{
			time : "2009-4-10",
			population : 4412631857
		},
		{
			time : "2010-4-10",
			population : 4412631857
		}		,{
			time : "2010-8-10",
			population : 1775217418
		}		,{
			time : "2011-12-10",
			population : 4451251998
		}		,{
			time : "2012-3-10",
			population : 4980593131
		}		,{
			time : "2012-7-10",
			population : 1329978264
		}		,{
			time : "2012-11-10",
			population : 4428197078
		}		,{
			time : "2013-2-10",
			population : 2925447687
		}		,{
			time : "2013-6-10",
			population : 1745285271
		}		,{
			time : "2013-10-10",
			population : 2427679956
		}		,{
			time : "2014-1-10",
			population : 1618174413
		}		,{
			time : "4-10-2010",
			alqaida : 472
		}		,{
			time : "2010-4-10",
			alqaida : 475
		}		,{
			time : "2010-8-10",
			alqaida : 1053
		}		,{
			time : "2011-12-10",
			alqaida : 962
		}		,{
			time : "2012-3-10",
			alqaida : 397
		}		,{
			time : "2012-7-10",
			alqaida : 649
		}		,{
			time : "2012-11-10",
			alqaida : 360
		}		,{
			time : "2013-2-10",
			alqaida : 556
		}		,{
			time : "2013-6-10",
			alqaida : 597
		}		,{
			time : "2013-10-10",
			alqaida : 874
		}		,{
			time : "2014-1-10",
			alqaida : 659
		}		,{
			time : "2010-4-10",
			isis : 1655
		}		,{
			time : "2010-8-10",
			isis : 1107
		}		,{
			time : "2011-12-10",
			isis : 1387
		}		,{
			time : "2012-3-10",
			isis : 1634
		}		,{
			time : "2012-7-10",
			isis : 528
		}		,{
			time : "2012-11-10",
			isis : 1361
		}		,{
			time : "2013-2-10",
			isis : 1424
		}		,{
			time : "2013-6-10",
			isis : 859
		}		,{
			time : "2013-10-10",
			isis : 866
		}		,{
			time : "2014-1-10",
			isis : 370
		}		,{
			time : "2010-4-10",
			taliban : 520
		}		,{
			time : "2010-8-10",
			taliban : 400
		}		,{
			time : "2011-12-10",
			taliban : 1018
		}		,{
			time : "2012-3-10",
			taliban : 1130
		}		,{
			time : "2012-7-10",
			taliban : 331
		}		,{
			time : "2012-11-10",
			taliban : 535
		}		,{
			time : "2013-2-10",
			taliban : 1390
		}		,{
			time : "2013-6-10",
			taliban : 1374
		}		,{
			time : "2013-10-10",
			taliban : 533
		}		,{
			time : "2014-1-10",
			taliban : 923
		}
	],

	"dataset" : [
		{
			"category" : "Coffee",
			"zone" : "Central",
			"name" : "Amaretto",
			"profit" : 5105,
			"sale" : 14011
		}, {
			"category" : "Coffee",
			"zone" : "Central",
			"name" : "Columbian",
			"profit" : 8528,
			"sale" : 28913
		}, {
			"category" : "Coffee",
			"zone" : "Central",
			"name" : "Decaf Irish Cream",
			"profit" : 9632,
			"sale" : 26155
		}, {
			"category" : "Coffee",
			"zone" : "East",
			"name" : "Amaretto",
			"profit" : 5105,
			"sale" : 14011
		}, {
			"category" : "Coffee",
			"zone" : "East",
			"name" : "Columbian",
			"profit" : 8528,
			"sale" : 28913
		}, {
			"category" : "Coffee",
			"zone" : "East",
			"name" : "Decaf Irish Cream",
			"profit" : 9632,
			"sale" : 26155
		}, {
			"category" : "Espresso",
			"zone" : "Central",
			"name" : "Caffee Mocha",
			"profit" : 	14646,
			"sale" : 35218
		}, {
			"category" : "Espresso",
			"zone" : "Central",
			"name" : "Decaf Espresso",
			"profit" : 8840,
			"sale" : 24410
		}, {
			"category" : "Espresso",
			"zone" : "South",
			"name" : "Caffee Lattee",
			"profit" : 3872,
			"sale" : 15444
		}, {
			"category" : "Espresso",
			"zone" : "Central",
			"name" : "Decaf Espresso 2",
			"profit" : 8840,
			"sale" : 24410
		},
	]

}, 'graph');
