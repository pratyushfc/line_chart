// A construction function for tooltip
function Tooltip() {
    this.toolEl = document.createElement("div");
    document.body.appendChild(this.toolEl);
    this.toolEl.setAttribute("class", "plotTooltip");
    this.style = "position:absolute;top:" + -100 + "px;left:" + -100 + "px;visibility:";
    var visibility = 'hidden';
    this.toolEl.setAttribute("style", this.style + visibility);
    this.textNode = document.createTextNode("");
    this.toolEl.appendChild(this.textNode);
} // end tooltip constructor
// Show tooltip based on top-left value
Tooltip.prototype.show = function(top, left, value) {
    this.style = "position:absolute;top:" + top + "px;left:" + left + "px;visibility:";
    this.style += 'visible';
    this.textNode.textContent = value;
    if(this.isHidden){
        this.toolEl.setAttribute("style", this.style);
    }
    this.isHidden = false;
}
// Hide tooltip
Tooltip.prototype.hide = function() {
    var visibility = ';visibility: hidden';
    this.toolEl.setAttribute("style", this.style + visibility);
    this.isHidden = true;
}