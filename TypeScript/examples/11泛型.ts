// 基本示例
// 不确定参数类型和返回值类型时(参数和返回值类型一致)。
function identity(arg: any): any {
    return arg + ''
}
// 如传入number 返回就不是number
// 用到泛型，可以指代为任意一种类型
function identity2<T>(arg: T): T {
    return arg
}
let output = identity2<string>('mystr')
let output2 = identity2('mystr') // 类型推论，推荐


// 泛型变量================
function loggingIndentity<T>(arg: T): T {
    // console.log(arg.length) // error,任意类型，如不是数组就不满足
    return arg
}
// => 这样就可以了
function loggingIndentity2<T>(arg: T[]): T[] {
    console.log(arg.length)
    return arg
}


// 泛型类型================
function identity3<T>(arg: T): T {
    return arg
}
// 泛型接口
interface GenericIndetityFn<T> {
    (arg: T): T
}
let myIndetity1: { <T>(arg: T): T } = identity3
let myIndetity2: GenericIndetityFn<number> = identity3


// 泛型类==================
class GenericNumber<T>{
    zeroValue: T
    add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
    return x + y
}

let stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function (x, y) {
    return x + y
}
// 静态属性不能使用泛型类型


// 泛型约束================

interface Lengthwise {
    length: number
}
function loggingIndentity3<T extends Lengthwise>(arg: T): T {
    console.log(arg.length) // 不再报错，因为有接口约束泛型,
    return arg
}

loggingIndentity3({ length: 1 })


// 约束属性
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
}

let x2 = { a: 1, b: 2, c: 3, d: 4 }
getProperty(x2, 'a')
// getProperty(x, 'm') // error


// 类类型
function create<T>(c: { new(): T }): T {
    return new c()
}

// 示例
class BeeKeeper {
    hasMask: boolean
}
class LionKeeper {
    nametag: string
}
class Animal {
    numLengs: number
}
class Bee extends Animal {
    keeper: BeeKeeper
}
class Lion extends Animal {
    keeper: LionKeeper
}
function createInstance<T extends Animal>(c: new () => T): T {
    return new c()
}
createInstance(Lion).keeper.nametag
createInstance(Bee).keeper.hasMask
