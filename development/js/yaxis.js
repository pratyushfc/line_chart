// YAxis inherited from Axis
YAxis.prototype = Object.create(Axis.prototype);
YAxis.prototype.constructor = YAxis;

function YAxis(ob){
    ob.isVertical = true;
	Axis.call(this, ob);
}
