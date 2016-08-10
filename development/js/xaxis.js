// XAxis inherited from Axis
XAxis.prototype = Object.create(Axis.prototype);
XAxis.prototype.constructor = XAxis;

function XAxis(ob){
	Axis.call(this, ob);
}


