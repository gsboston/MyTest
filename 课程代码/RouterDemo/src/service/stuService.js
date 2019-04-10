define([], function () {
    var stuMockList = [{
        name: "小王",
        age: "18"
    }, {
        name: "小八",
        age: "20"
    }, {
        name: "小王八",
        age: "25"
    }];
    return {
        getList() {
            return stuMockList;
        },
        addStu(name, age) {
            stuMockList.push({ name: name, age: age });
        }
    }
})