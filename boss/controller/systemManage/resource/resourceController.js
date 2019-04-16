$RequestMapping("/systemManage/resource/search.do", function(current, moduleId) {
    this.get({
        url: "/portal-api/funcs/search",
        param: {
            current: current,
            moduleId: moduleId
        }
    }).then(data => {
        this.send({
            data: data.records,
            current: data.current,
            total: data.total,
        });
    });
});

$RequestMapping("/systemManage/resource/save.do", function(data) {
    this.request({
        url: "/portal-api/funcs/save",
        data: data
    }).then(item => {
        this.send(item);
    });
});

$RequestMapping("/systemManage/resource/info.do", function(id) {
    this.get({
        url: "/portal-api/funcs/get/" + id,
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/resource/remove.do", function(id) {
    this.delete({
        url: "/portal-api/funcs/remove/" + id,
    }).then(data => {
        this.send();
    });
});
