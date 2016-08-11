// XAxis inherited from Axis
XAxis.prototype = Object.create(Axis.prototype);
XAxis.prototype.constructor = XAxis;

function XAxis(ob){
	ob.isVertical = false;
	Axis.call(this, ob);
}


