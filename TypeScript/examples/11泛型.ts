// https://www.tslang.cn/docs/handbook/generics.html

// 在像C#和Java这样的语言中，可以使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。
// 基本示例
// 不确定参数类型和返回值类型时(已知参数和返回值类型一致)。
function identity(arg: any): any {
    return arg + ''
}
// 如传入number 返回就不是number，使用any可以让接收任何类型的参数，也可以返回任何类型参数。
// 但是同样带来一个问题，会丢失了一些信息。无法同时控制传入的类型与返回的类型，如传入数字类型，返回字符串类型。
// 我们需要的方法是可以接收任意类型，同时将传入的类型作为返回类型。这时就用到泛型。
// 用到泛型，可以泛指任意一种类型
// T可以捕获到传入的类型，
function identity2<T>(arg: T): T {
    return arg
}
// 调用泛型函数
let output = identity2<string>('mystr')
// 当然也可以不显式指定类型，利用类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型：
let output2 = identity2('mystr') // 类型推论，推荐


// 泛型变量================
// 在这个泛型函数中打印arg的长度，但是T可以是任意类型，所以arg也并不一定具有length这个属性（传入的是个数字就没有length属性）
function loggingIndentity<T>(arg: T): T {
    // console.log(arg.length) // error,任意类型，如不是数组就不满足
    return arg
}
// 可以让arg变为一个泛型数组，数组就可以正确的访问length属性了
// 这样就可以了
function loggingIndentity2<T>(arg: T[]): T[] {
    console.log(arg.length)
    return arg
}


// 泛型类型================
// 研究一下函数本身的类型，以及如何创建泛型接口。
// 泛型函数的类型与非泛型函数的类型没什么不同
function identity3<T>(arg: T): T {
    return arg
}
let myIdentity: <T>(arg: T) => T = identity3;
// 也可以使用带有调用签名的对象字面量的方式定义泛型函数
let myIndetity1: { <T>(arg: T): T } = identity3
// 泛型接口
interface GenericIndetityFn<T> {
    (arg: T): T
}
function identity4<T>(arg: T): T {
    return arg
}

let myIndetity2: GenericIndetityFn<number> = identity4


// 泛型类==================
// 泛型类与泛型接口很像
class GenericNumber<T>{
    zeroValue: T
    add: (x: T, y: T) => T
}

let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) {
    return x + y
}
// 

let stringNumeric = new GenericNumber<string>()
stringNumeric.zeroValue = ''
stringNumeric.add = function (x, y) {
    return x + y
}

// 泛型类可以帮助我们确认类的所有属性都在使用相同的类型。
// 静态属性不能使用泛型类型


// 泛型约束================
// 记得之前那个错误，当时是用泛型数组解决的，除此之外，还可以对于T进行约束要求
// 创建一个接口描述约束条件，接口包含length属性，让泛型T实现接口
interface Lengthwise {
    length: number
}
function loggingIndentity3<T extends Lengthwise>(arg: T): T {
    console.log(arg.length) // 不再报错，因为有接口约束泛型,
    return arg
}
// 我们为这个泛型函数定义了约束，所以它不再是适用于任意类型了
// 传入符合约束类型的值，必须包含必要的属性
loggingIndentity3({ length: 1 })


// 在泛型约束中使用类型参数
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
}

let x2_11 = { a: 1, b: 2, c: 3, d: 4 }
getProperty(x2_11, 'a')
// getProperty(x, 'm') // error


// 在泛型里使用类类型
// 在TypeScript使用泛型创建工厂函数时，需要引用构造函数的类类型
function create2<T>(c: { new(): T }): T {
    return new c()
}
// 更高级的例子，使用原型属性推断并约束构造函数与类实例的关系。
class BeeKeeper {
    hasMask: boolean
}
class LionKeeper {
    nametag: string
}
class AnimalKeeper {
    numLengs: number
}
class Bee extends AnimalKeeper {
    keeper: BeeKeeper
}
class Lion extends AnimalKeeper {
    keeper: LionKeeper
}
function createInstance<T extends AnimalKeeper>(c: new () => T): T {
    return new c()
}
createInstance(Lion).keeper.nametag
createInstance(Bee).keeper.hasMask
