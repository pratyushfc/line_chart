// XAxis inherited from Axis
XAxis.prototype = Object.create(Axis.prototype);
XAxis.prototype.constructor = XAxis;
// Xaxis simply uses all functions of Axis and jus sets the isVertical 
// property to false strictly
function XAxis(ob) {
    ob.isVertical = false;
    Axis.call(this, ob);
}