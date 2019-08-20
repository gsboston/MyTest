// 没有存取器
class Employee3 {
    fullName: string
}

let employee3 = new Employee3()
employee3.fullName = 'bob'
if (employee3.fullName) {
    console.log(employee3.fullName)
}

// 设置属性值时，进行额外的逻辑，用到存取器
let password = '123456'
class Employee4 {
    private _fullName: string

    get fullName(): string {
        return this._fullName
    }

    set fullName(newName: string) {
        if (password && password === '123456') {
            this._fullName = newName
        } else {
            console.log('error')
        }
    }
}

let employee4 = new Employee4()
employee4.fullName = 'bob'
if (employee4.fullName) {
    console.log(employee4.fullName)
}
// 编译后的代码就是利用es5的defineProperty实现，对象劫持


// 类的静态属性（成员）=================================
class Grid {
    static origin = { x: 0, y: 0 }

    scale: number

    constructor(scale: number) {
        this.scale = scale
    }

    calculateDistanceFormOrigin(potin: { x: number; y: number }) {
        // 访问静态属性
        let xDist = potin.x - Grid.origin.x
        let yDist = potin.y - Grid.origin.y
        return Math.sqrt(xDist * xDist + yDist * yDist) * this.scale
    }
}

let grid1 = new Grid(1.0)
let grid2 = new Grid(5.0)

console.log(grid1.calculateDistanceFormOrigin({ x: 3, y: 4 }))
console.log(grid2.calculateDistanceFormOrigin({ x: 3, y: 4 }))
