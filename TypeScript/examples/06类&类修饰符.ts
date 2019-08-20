class Greeter {
    greeting: string
    constructor(message: string) {
        this.greeting = message
    }
    greet() {
        return 'halo,' + this.greeting
    }
}

let greeter = new Greeter('world')
greeter.greet()


// 继承==================================================================
class Animal2 {
    move(distance: number = 0) {
        console.log(`Animal moved ${distance}m`)
    }
}

class Dog2 extends Animal2 {
    bark() {
        console.log('wolf');
    }
}

const dog = new Dog2()
dog.bark()
dog.move(10)

// 更复杂的
class Animal3 {
    name: string
    constructor(name: string) {
        this.name = name
    }
    move(distance: number = 0) {
        console.log(`${this.name} moved ${distance}m`)
    }
}

class Snake extends Animal3 {
    constructor(name: string) {
        super(name)
    }
    move(distance: number = 5) {
        console.log('sa sa sa')
        super.move(distance)
    }
}

class Horse extends Animal3 {
    constructor(name: string) {
        super(name)
    }
    move(distance: number = 45) {
        console.log('dadada')
        super.move(distance)
    }
}

let sam = new Snake('Sammy');
let tom: Animal3 = new Horse('Tony');

sam.move()
tom.move(24)


// 修饰符=============================================
class Animal4 {
    // public 是默认的
    public name: string
    // private 声明的成员是不能再外部使用的
    private age: number

    public constructor(name: string) {
        this.name = name
    }

    public move(distance: number = 0) {
        console.log(`${this.name} moved ${distance}m`)
    }
}
// ts是一个结构性的类型系统，当去比较两种不同类型的时候，并不在乎从来哪来，如果他们所有的成员类型都是兼容的话，
// 我们认为他是类型兼容的。当比较私有的或者受保护成员类型的时候，这个情况就不同了。
// 如果其中一个类型包含private、受保护成员，只有当另一个类型也包含这样一个private成员
// 并且他们都是来自同一处声明的时候，我们才认为这两个是类型兼容的。
// 示例

class Animal5 {
    private name: string

    constructor(name: string) {
        this.name = name
    }

    move(distance: number = 0) {
        console.log(`${this.name} moved ${distance}m`)
    }
}

class Rhino extends Animal5 {
    constructor() {
        super('Rhino')
    }
}

class Employee {
    private name: string
    constructor(name: string) {
        this.name = name
    }
}

let animal5 = new Animal5('goat')
let rhino = new Rhino()
let employee = new Employee('kevin')

animal5 = rhino
// 报错 因为e中的私有成员和a中的私有成员来源不一样
// 而a和r共享了私有成员的定义。所以是兼容的，a和e是不兼容的
// animal = employee

// protected 

class Person {
    protected name: string

    // 外部不能实例化
    protected constructor(name: string) {
        this.name = name
    }
}


class Employee2 extends Person {
    private department: string
    constructor(name: string, department: string) {
        super(name)
        this.department = department
    }

    getElebatorPitch() {
        return `halo my name is ${this.name} and i word in ${this.department}`
    }
}

let howard = new Employee2('howard', 'sales')
console.log(howard.getElebatorPitch());
// 受保护的，只能在子类中使用，但是不能再外部使用
// console.log(howard.name)

// readonly ==========================================
class Person2 {
    readonly name: string

    constructor(name: string) {
        this.name = name
    }
}

let john = new Person2('john')
// john.name='ddd' // error

// 参数属性（尽量不用）==============================================
class Person3 {
    // 也可以用 private protected
    constructor(readonly name: string) {
    }
}

let tom4 = new Person3('tom')
// tom4.name='xxx' // error
