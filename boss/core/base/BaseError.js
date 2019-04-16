const BaseError = function() {
    var _this = this;
    _this.status = 110;
    _this.message = null;

    var args = arguments || [];
    if(args.length == 1) {
        _this.message = args[0];

    }else if(args.length == 2) {
        if(args[0] > 200 && args[0] < 300) {
            _this.status = args[0];
        }
        _this.message = args[1];
    }
};

module.exports = BaseError;