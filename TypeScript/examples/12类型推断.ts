// https://www.tslang.cn/docs/handbook/type-inference.html
// 基础
// ts中没有明确指出类型的地方，类型推断会推断出类型
let x1 = 3 // 自动推断为数字
// 推断发生在初始化变量和成员，设置默认参数和决定函数返回值时。


// 最佳通用类型
let x2 = [0, 1, null] 
// 数字和null的联合类型
// 为了推断x2的类型，我们必须考虑所有元素的类型。计算通用类型算法会考虑所有的候选类型，并给出一个兼容所有候选类型的类型。

class Animal2 {
    numLeas: number
}
class Bee2 extends Animal2 {}

class Lion2 extends Animal2 {}
let zoo: Animal2[] = [new Bee2(), new Lion2()]
// 如果不指定，就会推断为联合数组类型 如： (Bee2 | Lion2)[]。


// 上下文类型

window.onmousedown = function (mouseEvent) {
    // console.log(mouseEvent.clickTime) // error
}
// 如果上下文表达式包含一个明确的类型信息，这个上下文类型就会被忽略
window.onmousedown = function (mouseEvent: any) {
    console.log(mouseEvent.clickTime)
}


// Animal2就是最佳通用类型
function createSZoo(): Animal2[] {
    return [new Bee2(), new Lion2()]
}