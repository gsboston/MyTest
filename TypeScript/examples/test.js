var Greeter22 = /** @class */ (function () {
    function Greeter22(message) {
        this.greeting = message;
    }
    Greeter22.prototype.greet = function () {
        return 'halo,' + this.greeting;
    };
    return Greeter22;
}());
var greeter22 = new Greeter22('world');
greeter22.greet();
