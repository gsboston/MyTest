var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal55 = /** @class */ (function () {
    function Animal55(name) {
        this.name = name;
    }
    Animal55.prototype.move = function (distance) {
        if (distance === void 0) { distance = 0; }
        console.log(this.name + " moved " + distance + "m");
    };
    return Animal55;
}());
var Rhino5 = /** @class */ (function (_super) {
    __extends(Rhino5, _super);
    function Rhino5() {
        return _super.call(this, 'Rhino') || this;
    }
    Rhino5.prototype.getT = function () {
        console.log(this.name);
    };
    return Rhino5;
}(Animal55));
var rr = new Rhino5();
rr.getT();
