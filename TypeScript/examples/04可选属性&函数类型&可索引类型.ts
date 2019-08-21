
// 可选属性
interface Square {
    color: string
    area: number
}

interface SquareConfig {
    color?: string
    width?: number

    // 索引签名-跳过检查
    [propName: string]: any // 允许出现除color width外的其他属性，并且类型任意
}

function createSquare(config: SquareConfig): Square {
    let newSquare = { color: 'white', area: 100 }
    if (config.color) {
        newSquare.color = config.color
    }
    if (config.width) {
        newSquare.area = config.width * config.width
    }
    return newSquare;
}

// 这样也可以跳转检查，但是不推荐
// let squareOptions = { color: 'black', width: 100 };
// let mySquare = createSquare(squareOptions)

let mySquare = createSquare({ color: 'black' })


// 只读属性
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
// a3 = ro  // error 泛型只读数组不能赋值给普通数组，普通数组可以赋值给泛型只读数组
// 只读——作为变量用const 作为属性用readonly

// 类型断言
a3 = ro as number[]


// 函数类型
// 可以使用接口描述函数类型
interface SearchFunc {
    (source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function (src: string, sub: string): boolean {
    let result = src.search(sub)
    return result > -1
}


// 可索引类型
interface StringArray {
    [index: number]: string
}

let myArray: StringArray;

myArray = ['bob', 'fred', 'smith'];
let myStr: string = myArray[0];


// 
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

//
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