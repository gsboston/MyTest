define(["jquery", "service/stuService", "require", "studentManage/index"], function ($, stuService, require) {
    return function () {
        console.log('stuAddInit');

        var str = `
        <div>
            <label>姓名</label>
            <input type="text" name="name">
            <label>年龄</label>
            <input type="text" name="age">
            <button class="subMsg">提交</button>
        </div>
                `;

        $str = $(str);
        $str.on('click', '.subMsg', function () {
            var name = $("input[name=name]").val();
            var age = $("input[name=age]").val();
            stuService.addStu(name, age);
            // 循环依赖，通过导入require模块解决
            require("studentManage/index").init();
        })

        $('.main .content').html($str);

    }
})