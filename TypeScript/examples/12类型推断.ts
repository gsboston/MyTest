// 基础==================================
let x1 = 3 // 自动推断为数字

// 最佳通用类型===========================
let x2 = [0, 1, null] // 数字和null的联合类型

class Animal2 {
    numLeas: number
}
class Bee2 extends Animal2 {

}

class Lion2 extends Animal2 {

}
let zoo: Animal2[] = [new Bee2(), new Lion2()]
// 如果不指定，就会推断为联合数组类型

// 上下文类型==============================

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