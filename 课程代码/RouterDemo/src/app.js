require.config({
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery-3.3.1",
        service: "../service"
    }
})

require(["jquery", "router"], function ($, router) {
    $('.sidebar-ul').on("click", "li", function () {
        if ($(this).hasClass('stuManage')) {
            // 初始化学生管理模块
            router.push({ path: "/student" })
        } else if ($(this).hasClass('lesManage')) {
            // 初始化课程管理模块
            router.push({ path: "/lesson" })
        } else if ($(this).hasClass('claManage')) {
            // 初始化班级管理模块
            router.push({ path: "/class" })
        }
    })

})