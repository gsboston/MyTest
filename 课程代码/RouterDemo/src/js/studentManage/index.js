define(["service/stuService", "jquery", "router"], function (stuService, $) {
    return {
        init() {
            console.log('stuinit');
            var str = `<div>
                    <div>操作：
                        <button class="add" >添加</button>
                    </div>
                    <table border="10" cellpadding="30">
                        <thead>
                            <tr>
                                <th>姓名</th>
                                <th>年龄</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${stuService.getList().map(item => {
                    return `<tr><td>${item.name}</td><td>${item.age}</td></tr>`
                }).join("")}
                        </tbody>
                    </table>
                </div>`;

            var $str = $(str);
            $str.on("click", ".add", function () {
                // 加载学生添加模块
                // 这里的router是循环引用，要使用require
                require('router').push({path:'/student/add'});
            })

            $('.main .content').html($str);

        }
    }
})