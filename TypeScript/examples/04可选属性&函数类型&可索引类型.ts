// https://www.tslang.cn/docs/handbook/interfaces.html
// 可选属性
// 接口里的属性有时也不全都是必须的
interface Square_04 {
    color: string
    area: number
}

interface SquareConfig_04 {
    color?: string
    width?: number
}

function createSquare(config: SquareConfig_04): Square_04 {
    let newSquare = { color: 'white', area: 100 }
    if (config.color) {
        newSquare.color = config.color
    }
    if (config.width) {
        newSquare.area = config.width * config.width
    }
    return newSquare;
}
let mySquare = createSquare({ color: 'black' })
// 可选属性的好处之一是可以对可能存在的属性进行预定义，好处之二是可以捕获引用了不存在的属性时的错误。


// 只读属性
// 一些对象属性只能在对象刚刚创建的时候修改其值。
interface Point {
    readonly x: number
    readonly y: number
}
// x,y不能改变
let p1: Point = { x: 10, y: 20 }
// p1.x = 5 // error


// 泛型只读数组
let a3: number[] = [1, 2, 3, 4]
let ro: ReadonlyArray<number> = a3
// ro不能修改，并且
// a3 = ro  // error 泛型只读数组不能赋值给普通数组
// 类型断言
a3 = ro as number[]

// readonly vs const
// 只读——作为变量用const 作为属性用readonly


// 额外的属性检查
// 看一个例子
interface SquareConfig5 {
    color?: string;
    width?: number;
}

function createSquare5(config: SquareConfig5): { color: string; area: number } {
    // ...
    return
}

// let mySquare5 = createSquare5({ colour: "red", width: 100 }); // error “colour”中不存在类型“SquareConfig5”
// 这时就会报错，对象字面量会被特殊对待而且会经过 额外属性检查，当将它们赋值给变量或作为参数传递的时候。 
// 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。
// 绕开错误方式1-类型断言
let mySquare5 = createSquare5({ colour: "red", width: 100 } as SquareConfig5);
// 绕开错误方式2-赋值另外变量
// 因为不同于字面量形式的参数传递，opt不会经过额外属性检查，
let opt = { colour: "red", width: 100 };
let mySquare6 = createSquare5(opt);
// 但以上都不是最佳实现。添加一个字符串索引签名，索引签名下面有详细说明
// 前提是你能够确定这个对象可能具有某些做为特殊用途使用的额外属性
interface SquareConfig5 {
    color?: string;
    width?: number;
    [propName: string]: any;
}
// SquareConfig5可以有任意数量的属性，并且只要它们不是color和width，那么就无所谓它们的类型是什么。


// 函数类型
// 接口除了描述带有属性的普通对象外，也可以描述函数类型。
// 为了使用接口表示函数类型，我们需要给接口定义一个调用签名。
interface SearchFunc {
    // 调用签名
    (source: string, subString: string): boolean
}
// 这样定义后，我们可以像使用其它接口一样使用这个函数类型的接口。 
// 下例展示了如何创建一个函数类型的变量，并将一个同类型的函数赋值给这个变量。

let mySearch: SearchFunc = function (src: string, sub: string): boolean {
    let result = src.search(sub)
    return result > -1
}


// 可索引的类型
// 与使用接口描述函数类型差不多，我们也可以描述那些能够“通过索引得到”的类型，比如a[10]或ageMap["daniel"]。 
// 可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。 
// 数字索引签名
interface StringArray {
    // 数字签名
    [index: number]: string
}

let myArray: StringArray;

myArray = ['bob', 'fred', 'smith'];
let myStr: string = myArray[0];

// 字符串索引签名
interface StringArray2 {
    // 字符串索引签名
    [index: string]: string
}

let myArray22: StringArray2;

myArray22 = { 'a': 'aaa', 'b': 'bbb' };
let myStr22: string = myArray22['a'];
console.log(myStr22) // aaa


// ts支持两种类型的索引签名，字符串和数字， 数字签名返回的类型要是字符串签名索引返回的子类型
// 因为访问数字索引的时候，会将数字转换为字符串
class Animal {
    name: string
}

class Dog extends Animal {
    breed: string
}

interface NotOkay {
    [x: number]: Dog // 数字签名
    [x: string]: Animal // 字符串签名
    // 数字签名返回的类型要是字符串签名索引返回的子类型
}

let an1 = new Animal()
let do1 = new Dog()
let oo1: NotOkay = { 'bb': an1, 2: do1 }

console.log(oo1[2]) // Dog {} 访问数字签名时，会将数字转换为字符串，
// 也就是为什么数字签名的返回类型要是字符串签名返回类型的子类型
console.log(oo1['bb']) // Animal {}


// 字符串索引签名 
// 字符串索引签名能够很好的描述dictionary模式，并且它们也会确保所有属性与其返回值类型相匹配
interface NumberDictionaty {
    [index: string]: number
    length: number
    // name:string 返回类型与索引类型不一致 error
}

// 也可以是只读的
interface ReadonlyStringArray {
    readonly [index: number]: string
}
let myArray2: ReadonlyStringArray = ['alice', 'bob'];
myArray[2] = 'kevin' // error