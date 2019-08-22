// 抽象类一般作为其他派生类的基类使用，不能直接使用（实例化）
// 包含抽象方法，不能直接实现，在派生类中实现

abstract class AnimalAb {
    // 可以加访问修饰符
    abstract makeSound(): void
    move(): void {
        console.log('ssss');
    }
}

// 复杂的抽象类
abstract class Department {
    name: string

    constructor(name: string) {
        this.name = name
    }

    printName(): void {
        console.log('name:' + this.name)
    }

    abstract printMeeting(): void
}

// 继承抽象类后，要实现抽象类中的抽象方法，对于实例方法可以直接使用
// 并且如果实例化的对象设置为抽象类的类型时，实例化对象不能调用继承类的方法和属性
class AccountingDepartment extends Department {
    constructor() {
        super('Accounting ad Auditing')
    }

    printMeeting(): void {
        console.log('the accounting Department meets each Monday at 10am')
    }

    genterateReports(): void {
        console.log('generating accouunting reports...')
    }
}

let department: Department
// department=new Department()  // error
department = new AccountingDepartment()
department.printName()
department.printMeeting()
// department.genterateReports() // error
// 因为 department 已经声明为 Department 类型，这个类中没有genterateReports
// 只能声明为 let department: AccountingDepartment


// 类的高级技巧============================================================

class Greeter2 {
    static standardGreeting = 'halo there'

    greeting: string

    constructor(message?: string) {
        this.greeting = message
    }

    greet() {
        if (this.greeting) {
            return 'halo ' + this.greeting
        } else {
            return 'halo' + Greeter2.standardGreeting
        }
    }
}

let greeter2: Greeter2 = new Greeter2()
console.log(greeter2.greet())

// 创建一个新的构造器
let greetMaker: typeof Greeter2 = Greeter2
// 修改静态属性
greetMaker.standardGreeting = 'hey there'

let greeter3: Greeter2 = new greetMaker()
console.log(greeter3.greet())


// 类作为接口使用================================================
// 允许，但是不经常使用
class Point1 {
    x_p: number
    y_p: number
}

interface Point3d extends Point1 {
    z_3d: number
}

let point3d: Point3d = { x_p: 1, y_p: 2, z_3d: 3 }
