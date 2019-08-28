// 声明变量，类型注解
let isDone: boolean = false

let decLiteral: number = 20 // 10进制
let hexLiteral: number = 0x14 // 16进制
let binaryLiteral: number = 0b10100 // 2进制
let octalLiteral: number = 0o24 // 8进制

let obj2: Object = {}

let name2: string = 'bob'

let list1: number[] = [1, 2, 3, 4]
let list2: Array<number> = [1, 2, 3, 4] // 数组泛型，推荐第一种


// 元组——已知长度和类型的数组
let x: [string, number]
x = ['halo', 10]
// x = [10,'halo'] // error 顺序不可变
console.log(x[0].substr(1)) // 
x[3] = 'world' // 这样越界赋值 3.1版本及以上 会报错


// 枚举类型
enum Color1 {
    Red, // 默认从0，可以修改
    Green,
    Blue
}
enum Color2 {
    Red = 1, // 默认从0，可以修改
    Green = 2,
    Blue = 4
}

let cc: Color2 = Color2.Blue
let colorName: string = Color2[2] // 反查 Green


// any 任意类型
let notSure1: any = 4
let notSure3: any = 'str'
let notSure2 = 4 // 不写类型，会根据赋值进行推断，类型为number
// any 类型的变了可以赋值成任意类型
notSure1 = 'maybe a string inttead'
notSure3 = false
// any 类型的数组
let list3: any[] = [1, true, 'dd']
list3[1] = 100


// void 表示没有任何类型
function warnUser(): void {
    console.log('this is my waring message');
}

let unsable: void = null // 还可以赋值为undefined 赋值其他会报错


// null & undefined
// 赋值成这两种类型没有意义
let num: number = 3
num = null // 正常编译不会报错，但是使用 tsc xx.ts --strictNullChecks严格模式编译会报错
// 使用联合类型
let num2: number | null = 4
num2 = null


// never 表示不存在的类型 任何类型的子类型（never可以赋值给其他类型，其他类型不能赋值给never）
let test1: number = 123
let test2: never
test1 = test2
// test2=test1 // error 

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


// object 类型
declare function create(o: object | null): void;
create({ prop: 0 })
create(null)
// create(42) error


// 类型断言——两种方式
let someVal: any = 'this is a string'
let strLen1: number = (<string>someVal).length
let strLen2: number = (someVal as string).length // 两种类型等价，推荐后者


// 变量声明
var a = 10;
function f_02() {
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


// 可选参数 & 默认参数
function fn4(o: { a: string, b?: number }) {
    let { a, b = 1000 } = o;
}

function fn5({ a, b = 0 } = { a: '' }): void {

}
// 可以传空，就以{a:''}为默认值解构，{a:'',b:0}
// 可以传入一个对象，必须含有a属性，如果传入空对象报错。
fn5({ a: 'yes' }) // 正确
fn5() // 正确
// fn5({}) // 报错

// 展开运算符同js
