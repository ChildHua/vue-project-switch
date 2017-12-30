var _Run;
_Run = {
    toExponential:function (value,point,limit) {
        if (value > Math.pow(10, point)) {
            value = value.toExponential(limit)
        }
        if (value < Math.pow(10, -(point-2))) {
            value = value.toExponential(limit)
        }
        if (value < Math.pow(10, 7) && value > Math.pow(10, -5)) {
            value = parseFloat(value.toFixed(point-1));
        }
        return value
    }
};