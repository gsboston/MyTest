// npm i -g typescript
// tsc -v

// 使用ts开发的时候需要配置一些配置文件，可以使用脚手架工具 TypeScript library starter
// github

class User {
    fullName: string
    firstName: string
    lastName: string
    constructor(firstName: string, lastName: string) {
        this.firstName = firstName
        this.lastName = lastName
        this.fullName = firstName + ' ' + lastName
    }
}

interface Person {
    firstName: string
    lastName: string
}

// 类型注解：明确参数类型
function greeter(person: Person) {
    return 'Hello ' + person.firstName + ' ' + person.lastName;
}

// let user = {
//     firstName: 'Yee',
//     lastName: 'Huang'
// };
let user = new User('Yee', 'Huang');

// console.log(greeter(user));

// 编译 tsc 01.ts
// 同目录下会生成js文件