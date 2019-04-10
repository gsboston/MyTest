require.config({
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery-3.3.1",
        service:"../service"
    }
})

require(["jquery", "studentManage/index","lessonManage/index","classManage/index"], function ($, studentIndex,lessonIndex,classIndex) {

    $('.sidebar-ul').on("click", "li", function () {
        if ($(this).hasClass('stuManage')) {
            // 初始化学生管理模块
            studentIndex.init();
        } else if ($(this).hasClass('lesManage')) {
            lessonIndex();
        } else if ($(this).hasClass('claManage')) {
            classIndex();
        }
    })
    
})