"use strict";
String.prototype.in = function(arr, readFn){
    var i = 0,
        len = arr.length,
        readFn = readFn || function(item){ return item; };

    for(i = len; i--;){
        if((readFn(arr[i]) + "").toLowerCase() === this.valueOf().toLowerCase()){
            return i;
        }
    }
    return false
}

// Function to set All variables in array to specific value
// similar to memset in C
function setAll(arr, val, size){
    var i = 0,
        len = size || arr.length;
    for(i = len; i--;){
        if(size){
            arr.push(val);
        } else {
            arr[i] = val;
        }
    }
}

// Function to trim text based on size provided
function trimText(string, length){
    length = length || Infinity;
    string += "";
    if(!string){
        return;
    }
    if(string.length <= length){
        return string;
    }
    return string.substr(0, 7) + ""; 
}


var sortByTime = function(a, b) { // Helper function to sort array by time
    a = joinDate(a.year, a.month);
    b = joinDate(b.year, b.month);
    return a - b;
}

var cumulativeOffset = function(element) {
    var el = element;
    var top = 0,
        left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    if (top === 0 || left === 0) {
        return getOffset(el);
    } else {
        return {
            top: top,
            left: left
        };
    }
};

function getOffset(el) {
    el = el.getBoundingClientRect();
    return {
        left: el.left + window.scrollX,
        top: el.top + window.scrollY
    }
}


var joinDate = function(year, month) { // Helper function to combine year and
    return ((year * 12) + month); // month
}
var splitDate = function(date) { // Helper function to split year and month
    return { // joined by previous function
        year: Math.floor(date / 12),
        month: date % 12
    };
}

var timeInWords = function(date) { // Conver  joined dates to 'Feb'06' format
    var year = splitDate(date).year;
    var month = splitDate(date).month;
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    year %= 100;
    if (year < 10) {
        return monthName[month] + " '0" + year;
    }
    return monthName[month] + " '" + year;
}

var shortNumber = function(num) {

    if(typeof num !== "number"){
        return num;
    }

    var numDig = numberOfDigits(num);
    var suffix = "";
    var stepsDown;

    if (numDig >= 13) {
        suffix = "t"
        stepsDown = 12;
    } else if (numDig >= 10) {
        suffix = "b"
        stepsDown = 9;
    } else if (numDig >= 7) {
        suffix = "m"
        stepsDown = 6;
    } else if (numDig >= 4) {
        suffix = "k"
        stepsDown = 3;
    } else {
        suffix = ""
        stepsDown = 0;
    }

    num = (num / Math.pow(10, stepsDown));
    num *= 100;
    num = Math.round(num);
    num /= 100;

    return num + suffix;
}
var shortNumberExpanded = function(num) {
    var numDig = numberOfDigits(num);
    var suffix = "";
    var stepsDown;

    if (numDig >= 13) {
        suffix = " trillion"
        stepsDown = 12;
    } else if (numDig >= 10) {
        suffix = " billion"
        stepsDown = 9;
    } else if (numDig >= 7) {
        suffix = " million"
        stepsDown = 6;
    } else if (numDig >= 4) {
        suffix = " thousand"
        stepsDown = 3;
    } else {
        suffix = ""
        stepsDown = 0;
    }
    var result = (num / Math.pow(10, stepsDown));
    return Math.round(result * 100) / 100 + suffix;
}

var numberOfDigits = function(num) {
    num = num < 0 ? num * -1 : num;
    var dig = 0;
    while (num > 0) {
        ++dig;
        num = Math.floor(num / 10);
    }
    return dig;
}


var createRange = function(ob){

    if(!ob || typeof ob !== "object"){
        return [];
    }true

    if(ob.basic){
        return createBasicRange(ob);
    }

    var i, j, temp,
        rangeArray = [],            // final range array that the
                                    // function will return
        beautyLimits = beautifyLimits({
            min : ob.min,
            max : ob.max
        }),
        calcMin = beautyLimits.min,
        calcMax = beautyLimits.max,
        computedMin = 0, computedMax = 0,   // variable to store final limits of
                                    // calculated range
        difference = 0,
        steps = 0,                      // Variable to store steps from
                                    // min to max

        twoDigitMin = 0, twoDigitMax = 0,   // Variables to store leading
                                    // two digits of max and min

        stepsDown = 0,              // A variable to store how
                                    // many divisions were made
        twoDigitMax = calcMax,
        rangeArray = [];

    // Algo started


    if (calcMin === calcMax) {
        rangeArray = [calcMin * 2, calcMin, 0];
        return rangeArray;
    }

    while (twoDigitMax > 99 || twoDigitMax < -99) {
        twoDigitMax /= 10;
        ++stepsDown;
    }

    twoDigitMin = Math.floor((calcMin * 100) / (Math.pow(10, stepsDown))) / 100;


    while (twoDigitMin > 99 || twoDigitMin < -99) {
        twoDigitMin /= 10;
        twoDigitMax /= 10;
        ++stepsDown;
    }

    difference = twoDigitMax - twoDigitMin;

    if (difference <= 0.3) {
        steps = 0.05;
    } else if (difference <= 1) {
        steps = 0.2;
    } else if (difference <= 3) {
        steps = 0.5;
    } else if (difference <= 6) {
        steps = 1;
    } else if (difference <= 12) {
        steps = 2;
    } else if (difference <= 20) {
        steps = 4;
    } else if (difference <= 30) {
        steps = 5;
    } else if (difference <= 40) {
        steps = 7;
    } else if (difference <= 50){
        steps = 10;
    } else if (difference <= 75){
        steps = 15;
    } else{
        steps = 20;
    }

    computedMin = Math.floor(twoDigitMin / steps) * steps;
    computedMax = Math.ceil(twoDigitMax / steps) * steps;

    // Step up; Multiplying the value to min-max that was divided before

    steps *= Math.pow(10, stepsDown);
    computedMin *= Math.pow(10, stepsDown);
    computedMax *= Math.pow(10, stepsDown);

    temp = computedMin;

    // Setting new global min and max

    while (temp <= computedMax) {
        temp = Math.round(temp * 100) / 100;
        rangeArray.push(temp);
        temp += steps;
    }

    return rangeArray;
}
var beautifyLimits = function(ob){
    if(!ob){
        return;
    }
    var minValue = ob.min;
    var maxValue = ob.max;

    if (minValue === maxValue) {
        return {
            min: minValue - 1,
            max: maxValue + 1
        }
    }

    var difference = maxValue - minValue;
    var difference2 = maxValue - minValue;
    // Algorithm to get more good looking ranges

    var numDig = numberOfDigits(difference);

    while (difference2 < 1) {
        numDig -= 1;
        difference2 *= 10;
    }

    var beautyNumber = Math.pow(10, (numDig - 2)) * 5;

    minValue = Math.floor(minValue / beautyNumber) * beautyNumber;

    if ((difference / maxValue) > 0.1) {
        var newBeautyNumber = Math.pow(10, numberOfDigits(maxValue) - 2);
        beautyNumber = beautyNumber > newBeautyNumber ? beautyNumber : newBeautyNumber;
    }

    maxValue = Math.ceil(maxValue / beautyNumber) * beautyNumber;
    return {
        min: minValue,
        max: maxValue
    };
}

var createBasicRange = function(ob){        // Function to get array of range with
                                                        // optional divisions parameter for number of
                                                        // divisions on axis
    if(!ob || typeof ob !== "object"){
        return [];
    }
    --divisions;

    var i = 0,
        min = ob.min,           // Getting min
        max = ob.max,           // and max
        difference = (max - min),    // Calculating steps value
        temp = 0,
        divisions = ob.divisions || 5,
        rangeArray = [];

    for(i = 0; i <= divisions; ++i){
        temp = (i / divisions) * difference + min;
        
        rangeArray.push(temp);
    }

    
    return rangeArray;
} //get createBasicRange

var readArray = function(ar, readFn){
    var i = 0,
        len = ar.length,
        genAr = [];

    for(i = 0; i < len; ++i){
        genAr.push(readFn(ar[i]));
    }
    return genAr;
}   // end readArray

function typeOfArray (ob) {
    var i = 0,
        j = 0,
        item,
        item2,
        len2 = 0,
        arr = ob.array,
        readFn = ob.read,
        smart = ob.smart,
        str = "",
        len = arr.length,
        categoryArr = [["January", "February", "March"
        , "April", "May", "June", "July", "August", "September" 
        , "October", "November", "December"],
        ["Jan", "Feb", "Mar", "Apr", "May" 
        , "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        ["Sunday", "Monday", "Tuesday" 
            , "Wednesday", "Thursday", "Friday", "Saturday"]],

        isDate = true,
        isNumeric = true,
        typeMatch = true,
        boolAr = [],
        finalAr = [],
        readFn = readFn || function(item){ return item; };


    for(i = len; i--; ){
        item = readFn(arr[i]);

        // Check for Date
        if(isDate && typeof item !== "string" || isNaN(+new Date(item)) ){
            isDate = false;
        }
        if(isDate && item.split("-").length !== 3){
            isDate = false;
        }

        // Check if numeric
        if(isNumeric && isNaN(+item)){
            isNumeric = false;
        }

        // break if item is not of any type
        if(!isDate && !isNumeric){
            break;
        }

    }

    if(isDate){
        return "date";
    }

    if(isNumeric){
        return "numeric";
    }

    // Algo to match array with any category
    setAll(boolAr, false, len);
    len2 = categoryArr.length;
    for(j = 0; j < len2 && smart; ++j){
        item = categoryArr[j];
        if(j) setAll(boolAr, false);

        typeMatch = true;
        for(i = 0; i < len; ++i){
            str = readFn(arr[i]) + "";
            if(str.in(item) === false){
                typeMatch = false;
                break;
            } else {
                boolAr[str.in(item)] = true;
            }
        }
        if(typeMatch){
            return item;
        }
    }

    for(i = 0; i < len; ++i){
        item = readFn(arr[i]);
        if(finalAr.indexOf(item) === -1){
            finalAr.push(item);
        }
    }

    return finalAr;
}


