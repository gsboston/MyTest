// 用接口来明确强制一个类去符合某种契约
interface ClockInterface {
    currentTime: Date
    setTime(d: Date)
}

// 类实现接口就要拥有接口中定义的属性和方法
class Clock2 implements ClockInterface {
    currentTime: Date
    constructor(h: number, m: number) {

    }

    setTime(d: Date) {
        this.currentTime = d
    }
}

// 类实现接口，接口只描述了类的公共部分，是不会检查类的私有成员
// 类有两个类型的，静态部分类型，实例部分类型。实现接口的叫实例类型，
// 实现接口的属性和方法就是实例类型
// 构造器是静态类型

// 构造器接口
// 类不能实现构造器接口，会报错。
// 因为构造器存在于类的静态部分，类只会对实例部分做类型检查
interface ClockConstructor {
    // 构造器签名
    new(hour: number, minute: number)
}


// 实例接口，构造器接口

// 什么时候用构造器接口==============================================

interface ClockInterface2 {
    tick()
}

interface ClockConstructor2 {
    // 构造函数签名
    new(hour: number, minute: number): ClockInterface2
}

// 工厂方法
function createClock(ctor: ClockConstructor2, hour: number, minute: number): ClockInterface2 {
    return new ctor(hour, minute)
}

// 定义两个类实现实例接口
class DigitalClock implements ClockInterface2 {
    constructor(h: number, m: number) { }
    tick() {
        console.log('tick  Digital');
    }
}

class AnalogClock implements ClockInterface2 {
    constructor(h: number, m: number) { }
    tick() {
        console.log('tick Analog');
    }
}

let digital = createClock(DigitalClock, 12, 17)
let anglog = createClock(AnalogClock, 7, 32)



// 继承接口 接口也可以相互继承 从一个接口里复制成员到另一个接口，更灵活的将接口分割到一些可重用的模块 ==========================

interface Shape {
    color: string
}

interface PenStroke {
    penWidth: number
}

interface Square extends Shape, PenStroke {
    sideLength: number
}
// 一个接口可以继承多个接口
let squre = {} as Square
squre.color = 'blue'
squre.sideLength = 10
squre.penWidth = 5.0



// 混合类型 ===================================================

// 接口函数签名（函数型接口）
interface CalcTwo {
    (a: number, b: number): number;
}
function calcArr(arr: number[], calc: CalcTwo, initVal: number): number {
    var result = initVal;
    arr.forEach((value) => {
        result = calc(result, value);
    });

    return result;
}
var arr: number[] = [1, 3, 5, 7, 9];
var add = function (a: number, b: number): number {
    return a + b;
};
console.log("相加", calcArr(arr, add, 0));

//或者直接传入一个匿名函数亦可
var s1 = calcArr(arr, function (a, b) {
    return a * b;
}, 1);
//  接口函数签名（函数型接口）end


interface Counter {
    // 函数签名
    (start: number): string
    interval: number
    reset(): void
}

function getCounter(): Counter {
    let counter = (function (star: number) {

    }) as Counter
    counter.interval = 123
    counter.reset = function () {

    }
    return counter
}

let c = getCounter()
c(10)
c.reset()
c.interval = 100


// 接口继承类，使用场景不多=================================================
// 接口继承一个类时，会继承类的成员，但不包括它的实现，好像接口声明了所有类存在的成员，
// 但并没有提供具体实现，同时也会继承私有的和受保护的成员。

// 这就意味着，我们去创建一个接口继承一个拥有私有或者受保护成员类的时候，
// 这个接口的类型只能够被这个类或其子类实现。

class Control {
    private state: any
}

interface SelectableControl extends Control {
    select()
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 这个类没有继承Control就实现了接口，是不行的，缺少私有成员state
// class ImageC implements SelectableControl {
//     select() { }
// }