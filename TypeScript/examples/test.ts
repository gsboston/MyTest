class Greeter22 {
    greeting: string
    constructor(message: string) {
        this.greeting = message
    }
    greet() {
        return 'halo,' + this.greeting
    }
}

let greeter22 = new Greeter22('world')
greeter22.greet()
