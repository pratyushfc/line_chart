var chart = new MultiVariantChart({
	"dimensions" : {						// Size of canvas
		"width" : 370,
		"height" : 240,
	},

	"caption" : "Caption",
	"subcaption" : "Subcaption",
	"interpolation" : true,					// Default true
	"type" : "column",						// line, column
	"crosstab" : false,
	"smartCategory" : true,
	"xaxisname" : "time",
	"colorRange" : ["aaaaaa", "000000", "770000", "ff6600"],


		"data" : [
		{
			"category" : "Coffee",
			"zone" : "South",
			"name" : "Amaretto",
			"profit" : -5105,
			"sale" : 19011
		},
		{
			"category" : "Coffee",
			"zone" : "West",
			"name" : "Amaretto",
			"profit" : -5105,
			"sale" : 7011
		}, {
			"category" : "Coffee",
			"zone" : "East",
			"name" : "Columbian",
			"profit" : 9528,
			"sale" : 18913
		},
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
			"name" : "Decaf Irish",
			"profit" : 9632,
			"sale" : 26155
		}, {
			"category" : "Coffee",
			"zone" : "East",
			"name" : "Amaretto",
			"profit" : -5105,
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
			"name" : "Decaf Irish",
			"profit" : 9632,
			"sale" : 26155
		}, {
			"category" : "Espresso",
			"zone" : "Central",
			"name" : "Mocha",
			"profit" : 	-14646,
			"sale" : 35218
		}, {
			"category" : "Espresso",
			"zone" : "Central",
			"name" : "Decaf Es",
			"profit" : -8840,
			"sale" : 24410
		}, {
			"category" : "Espresso",
			"zone" : "South",
			"name" : "Lattee",
			"profit" : 3872,
			"sale" : 15444
		}
	],

	"data" : [
		{
			time : "2009-4-10",
			population : "324324",
		}		,{
			time : "2010-4-10",
			population : "4412631857"
		}		,{
			time : "2010-8-10",
			population : "1775217418"
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
			sale1 : "472"
		}		,{
			time : "2010-4-10",
			sale1 : 475
		}		,{
			time : "2010-8-10",
			sale1 : 1053
		}		,{
			time : "2011-12-10",
			sale1 : 962
		}		,{
			time : "2012-3-10",
			sale1 : 397
		}		,{
			time : "2012-7-10",
			sale1 : 649
		}		,{
			time : "2012-11-10",
			sale1 : 360
		}		,{
			time : "2013-2-10",
			sale1 : 556
		}		,{
			time : "2013-6-10",
			sale1 : 597
		}		,{
			time : "2013-10-10",
			sale1 : 874
		}		,{
			time : "2014-1-10",
			sale1 : 659
		}		,{
			time : "2010-4-10",
			sale2 : 1655
		}		,{
			time : "2010-8-10",
			sale2 : 1107
		}		,{
			time : "2011-12-10",
			sale2 : 1387
		}		,{
			time : "2012-3-10",
			sale2 : 1634
		}		,{
			time : "2012-7-10",
			sale2 : 528
		}		,{
			time : "2012-11-10",
			sale2 : 1361
		}		,{
			time : "2013-2-10",
			sale2 : 1424
		}		,{
			time : "2013-6-10",
			sale2 : 859
		}		,{
			time : "2013-10-10",
			sale2 : 866
		}		,{
			time : "2014-1-10",
			sale2 : 370
		}		,{
			time : "2010-4-10",
			sale3 : 520
		}		,{
			time : "2010-8-10",
			sale3 : 400
		}		,{
			time : "2011-12-10",
			sale3 : 1018
		}		,{
			time : "2012-3-10",
			sale3 : 1130
		}		,{
			time : "2012-7-10",
			sale3 : 331
		}		,{
			time : "2012-11-10",
			sale3 : 535
		}		,{
			time : "2013-2-10",
			sale3 : 1390
		}		,{
			time : "2013-6-10",
			sale3 : 1374
		}		,{
			time : "2013-10-10",
			sale3 : 533
		}		,{
			time : "2014-1-10",
			sale3 : 923
		}		,{
			time : "2009-4-10",
			test4 : "sUN"
		}	,{
			time : "2010-4-10",
			test4 : "sat"
		}		,{
			time : "2010-8-10",
			test4 : "tUE"
		}		,{
			time : "2011-12-10",
			test4 : "Thu"
		}		,{
			time : "2009-4-10",
			test2 : "dEC"
		}	,{
			time : "2010-4-10",
			test2 : "JaN"
		}		,{
			time : "2010-8-10",
			test2 : "fEB"
		}		,{
			time : "2011-12-10",
			test2 : "aPR"
		},{
			time : "2010-4-10",
			test5 : "2004-8-10"
		}		,{
			time : "2010-8-10",
			test5 : "2017-8-10"
		}		,{
			time : "2011-12-10",
			test5 : "2011-12-10"
		}
	],

}, 'graph');
