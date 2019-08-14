let isDone: boolean = false

let decLiteral: number = 20 // 10
let hexLiteral: number = 0x14 // 16
let binaryLiteral: number = 0b10100 // 2
let octalLiteral: number = 0o24 // 8

let name2: string = 'bob'

let list1: number[] = [1, 2, 3, 4]
let list2: Array<number> = [1, 2, 3, 4] // 数组泛型，推荐第一种

// 元组 已知长度和类型
let x: [string, number]
x = ['halo', 10]
// x = [10,'halo'] error
console.log(x[0].substr(1))
x[3] = 'world' // 这样越界赋值 3.1版本及以上 会报错

// 枚举类型
enum Color {
    Red = 1, // 默认从0，可以修改
    Green = 2,
    Blue = 4
}

let c: Color = Color.Blue
let colorName: string = Color[2] // 反查 Green

// any 任意类型
let notSure: any = 4
// let notSure = 4 不写类型，会根据赋值进行推断，类型为number
notSure = 'maybe a string inttead'
notSure = false

let list3: any[] = [1, true, 'dd']
list3[1] = 100


// void 没有任何类型
function warnUser(): void {
    console.log('this is my waring message');
}

let unsable: void = null // undefined 赋值其他会报错


// null undefined
// 赋值成这两种类型没有意义
let num: number = 3
num = null // 正常编译不会报错，但是使用 tsc xx.ts --strictNullChecks严格模式编译会报错
// 使用联合类型
let num2: number | null = 4
num2 = null


// never 不存在的类型 任何类型的子类型（可以赋值给其他类型，其他类型不能赋值给never）
function error(message: string): never {
    throw new Error(message)
}

function fail() {
    return error('sth failed')
}

function inifiniteLoop(): never {
    while (true) {

    }
}


// object
declare function create(o: object | null): void;
create({ prop: 0 })
create(null)
// create(42) error


// 类型断言
let someVal: any = 'this is a string'
// let strLen: number = (<string>someVal).length
let strLen: number = (someVal as string).length // 两种类型等价，推荐后者



// 变量声明===================================================================================
var a = 10;
function f() {
    var message = 'halo';
    return message;
}

// 闭包 变量提升等同js一致

let input: [number, number] = [1, 2];
function f5([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
f5(input);

// 对象解构
let o = {
    a1: 'foo',
    b1: 12,
    c1: 'bar'
}
let { a1, b1 }: { a1: string, b1: number } = o;


// 默认参数
function fn4(o: { a: string, b?: number }) {
    let { a, b = 1000 } = o;
}

function fn5({a,b=0}={a:''}):void{

}
// 可以传空，就以{a:''}为默认值解构，{a:'',b:0}
// 可以传入一个对象，必须含有a属性，如果传入空对象报错。
fn5({a:'yes'}) // 正确
fn5() // 正确
// fn5({}) // 报错