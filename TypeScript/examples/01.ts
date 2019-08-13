// npm i -g typescript
// tsc -v

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

console.log(greeter(user));

// 编译 tsc 01.ts
// 同目录下会生成js文件