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

    return (num / Math.pow(10, stepsDown)) + suffix;
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

var binarySearchDate = function(low, high, date, array, interpolation) {
    var result;
    if (high - low === 1) {
        if (array[low].date === date) {
            result = array[low].value;
        }
        if (array[high].date === date) {
            result = array[high].value;
        }

        if (interpolation) {

            var ratio = (array[high].value - array[low].value) / (array[high].date - array[low].date);
            var extra = array[low].value - (array[low].date * ratio);
            result = date * ratio + extra;
        } else {

            if (date - array[low].date > array[high].date - date) {
                result = array[high].value;
            } else {
                result = array[low].value;
            }
        }

        return {
            value: result
        };
    }
    var mid = Math.floor((low + high) / 2);
    if (array[mid].date === date) {
        return {
            value: array[mid].value
        };
    }

    if (date > array[mid].date) {
        return binarySearchDate(mid, high, date, array, interpolation);
    } else {
        return binarySearchDate(low, mid, date, array, interpolation);
    }
}
