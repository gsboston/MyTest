// 交叉类型-多种类型叠加================================
function extend<T, U>(first: T, second: U): T & U {
    let result = {} as T & U

    for (let id in first) {
        // result[id] = first[id] // error
        result[id] = first[id] as any
    }

    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            // result[id] = second[id] // error
            result[id] = second[id] as any
        }
    }
    return result
}

class Person {
    // name 为简写
    constructor(public name: string) {

    }
}

interface Loggable {
    log(): void
}

class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}

// 拼接在一起，就是交叉类型
var jim = extend(new Person('jim'), new ConsoleLogger())
jim.name
jim.log()

// 联合类型==================================================
// 与交叉类型有关联，但是又截然不同，
// 交叉类型是几种类型之和，联合类型是几种类型之一
function padLeft(value: string, padding: any) {
    if (typeof padding === 'number') {
        return Array(padding + 1).join(' ') + value
    }

    if (typeof padding === 'string') {
        return padding + value
    }

    throw new Error('Expectd string or number')
}

padLeft('halo world', 4)
// padLeft('halo world', true) // 解决这个问题

function padLeft2(value: string, padding: string | number) {
    // ...
}
// padLeft2('halo world', true) 


//
interface Bird {
    fly()
    layEggs()
}

interface Fish {
    swim()
    layEggs()
}

function getSmallPet(): Fish | Bird {
    // ...
    return
}
let pet = getSmallPet()
pet.layEggs()
// pet.swim() // error
// 类型保护解决这个问题

// 类型保护=========================================
// 接上面例子，想明确知道pet类型

// if ((pet as Fish).swim) {
//     (pet as Fish).swim()
// } else if ((pet as Bird).fly) {
//     (pet as Bird).fly()
// }

// 类型保护机制-类型which
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined
}

if (isFish(pet)) {
    pet.swim()
} else {
    pet.fly()
}

// 类型保护机制-typeof

function isNumber(x: any): x is number {
    return typeof x === 'number'
}

function isString(x: any): x is string {
    return typeof x === 'string'
}

function padLeft3(value: string, padding: string | number) {
    // number string boolean sysbml  可以做类型保护
    // 也可以在此处直接用typeof
    if (isNumber(padding)) {
        return Array(padding + 1).join(' ')
    }
    // 也可以在此处直接用typeof
    if (isString(padding)) {
        return padding + value
    }
    throw new Error('error')
}

// 类型保护机制-instanceof

class Bird {
    fly() {
        console.log('bird fly')
    }
    layEggs() {
        console.log('bird lay')
    }
}

class Fish {
    swim() {
        console.log('fish swim')
    }
    layEggs() {
        console.log('fish lay')
    }
}

function getRandomPet(): Fish | Bird {
    return Math.random() > 0.5 ? new Bird() : new Fish()
}

let pet2 = getRandomPet()
if (pet2 instanceof Bird) {
    pet2.fly()
}
if (pet2 instanceof Fish) {
    pet2.swim()
}

// 可以为null的类型 ============================================
let s = 'foo'
// s = null
let sn: string | null = 'bar'
// sn = null 
sn = undefined

function f(x: number, y?: number) {
    return x + (y || 0)
}

f(1, 2)
f(1)
f(1, undefined)
// f(1,null) // error null不能赋值给联合类型(number\undefined)

class C {
    a: number
    b?: number
}
let c_13 = new C()
c_13.a = 12
// c.a = undefined // error
c_13.b = 13
c_13.b = undefined // 因为b是number 和 undefined的联合类型
// c.b = null // null不能赋值给undefined 和 联合类型

function f1(sn: string | null): string {
    if (sn === null) {
        return 'default'
    } else {
        return sn
    }
}
// 更常用的方式
function f2(sn: string | null): string {
    return sn! || 'default'
}

function broken(name: string | null): string {
    function postfix(epither: string) {
        return name.charAt(0) + '.the ' + epither
    }

    name = name || 'bob'
    return postfix(name)
}
// 编译器无法识别嵌套函数的null
function broken2(name: string | null): string {
    function postfix(epithet: string) {
        return name!.charAt(0) + '.the ' + epithet
    }

    name = name || 'bob'
    return postfix(name)
}

// 字符串字面量类型=============================================
type Easing = 'ease-in' | 'ease-out' | 'ease-in-out'
// function f4(easing: Easing) {
//     if (easing === 'ease in') {

//     }
// }

class UIElement2 {
    animate(easing: Easing) {
        if (easing === 'ease-in') {

        } else if (easing === 'ease-out') {

        } else if (easing === 'ease-in-out') {

        } else { }
    }
}

let button = new UIElement2()
button.animate('ease-in')
button.animate(null) // error