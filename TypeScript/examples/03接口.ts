function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

// 当传入的对象还有其他值时，ts没有那么宽松，有些时候就会出现问题
let myObj = { size: 10, label: 'Size 10 Object' };
printLabel(myObj);



// 接口描述 interface
interface LabelledValue {
    label: string
}

function printLabel2(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
// 这时只要接口中的属性同时出现在传入的对象中，并且类型一致即可，不需要实现接口


