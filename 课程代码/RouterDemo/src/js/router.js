define(["Route", "studentManage/index", "studentManage/add", "lessonManage/index", "classManage/index"],
    function (Route, stuIndex, stuAdd, lessIndex, classIndex) {
        var router = new Route({
            routes: [
                { path: "/", redirect: "/student" },
                { path: "/student", component: stuIndex.init },
                { path: "/student/add", component: stuAdd },
                { path: "/lesson", component: lessIndex },
                { path: "/class", component: classIndex }
            ]
        });

        return router;

    })