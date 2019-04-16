let Demand = function() {
    var _this = this;
    _this.status = 200;
    _this.message = null;
    _this.stack = null;
    _this.data = null;

    var args = arguments || [];
    if(args.length == 1) {
        _this.data = args[0];

    }else if(args.length == 2) {
        _this.status = args[0];
        _this.message = args[1];

    }else if(args.length == 3) {
        _this.status = args[0];
        _this.message = args[1];
        _this.stack = args[2];
    }
};

module.exports = Demand;