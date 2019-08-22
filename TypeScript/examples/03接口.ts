// 接口
// https://www.tslang.cn/docs/handbook/interfaces.html

// TypeScript的核心原则之一是对值所具有的结构进行类型检查
// 接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约

function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

// 我们传入的对象参数实际上会包含很多属性，但是编译器只会检查那些必需的属性是否存在，并且其类型是否匹配。
// 但有些时候ts没有那么宽松，就会出现问题
let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);

// 下面用接口改写这个例子
// interface声明接口
interface LabelledValue {
    label: string
}

function printLabel2(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
let myObj2 = { size: 10, label: 'Size 10 Object' };
printLabel2(myObj2);

// 例子中，接口用来描述上面例子的要求，它代表一个对象，对象包含label属性，且类型为string
// 区别于其他语言，这里并不能说是printLabel2的参数（myObj2）实现了接口，只能说是一种约束。

// 这时只要接口中的属性同时出现在传入的对象中，并且类型一致即可，也不用关心顺序。


