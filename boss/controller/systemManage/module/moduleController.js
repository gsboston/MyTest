$RequestMapping("/systemManage/module/search.do", function() {
    this.get({
        url: "/portal-api/models/list"
    }).then(items => {
        this.send(items);
    });
});

$RequestMapping("/systemManage/module/save.do", function(data) {
    this.request({
        url: "/portal-api/models/save",
        data: data
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/module/info.do", function(id) {
    this.get({
        url: "/portal-api/models/get/" + id,
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/module/remove.do", function(id) {
    this.delete({
        url: "/portal-api/models/remove/" + id,
    }).then(data => {
        this.send();
    });
});