// 函数 https://www.tslang.cn/docs/handbook/functions.html
// 普通函数 与js一致
function add(x, y) {
    return x + y
}

let myAdd = function (x, y) {
    return x + y
}


// 函数类型 可以描述函数的参数及返回的类型
function add2(x: number, y: number): number {
    return x + y
}

let myAdd2 = function (x: number, y: number): number {
    return x + y
}


// 完整的函数类型

let myAdd3: (val1: number, val2: number) => number = function (x: number, y: number): number {
    return x + y
}
// 无法返回值也要写清
let myAdd4: (val1: number, val2: number) => void = function (x: number, y: number): void {
    console.log(x + y)
}


// 推断类型，保留一侧即可
let myAdd5 = function (x: number, y: number): number {
    return x + y
}

let myAdd6: (val1: number, val2: number) => number = function (x, y) {
    return x + y
}


// 可选参数
// 正常情况下ts每个函数的参数都是必须的，传递的个数要与函数期望个数一致
function buildName(firstName: string, lastName: string): string {
    return firstName + ' ' + lastName
}

// let result1=buildName('bob') // error
let result2 = buildName('bob', 'sr')

// 如某个参数在不确定的情况下就可以使用可选参数
function buildName2(firstName: string, lastName?: string): string {
    return firstName + ' ' + lastName
}

let result11 = buildName2('bob')
// 注意：可选参数要跟在必须参数后面，不能写在前面


// 默认参数
// 给参数设置一个默认值时使用，与可选参数不同，默认参数不传也会有值
function buildName3(firstName: string, lastName = 'default'): string {
    return firstName + ' ' + lastName
}
let result3 = buildName3('bob')
// 注意：默认参数如果放到必须参数前，那么一定要传一个undefined


// 剩余参数
// 不清楚有多少参数时 js使用arguments
// ts不需要, restOfName可以是任意多个
function buildName4(firstName: string, ...restOfName: string[]): string {
    return firstName + ' ' + restOfName
}

buildName4('aa','bb','cc') // restOfName 就是[ 'bb', 'cc' ]
// restOfName名字可以任意

// 声明函数的定义时也可以使用
let buildNameFn: (fname: string, ...rest: string[]) => string = buildName4

