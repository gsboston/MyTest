$RequestMapping("/systemManage/app/search.do", function() {
    this.get({
        url: "/portal-api/apps/list"
    }).then(items => {
        this.send(items);
    });
});

$RequestMapping("/systemManage/app/save.do", function(data) {
    if(data.id != null) {
        this.put({
            url: "/portal-api/apps/update/" + data.id,
            data: data
        }).then(data => {
            this.send(data);
        });
    }else {
        this.post({
            url: "/portal-api/apps/create",
            data: data
        }).then(data => {
            this.send(data);
        });
    }
});

$RequestMapping("/systemManage/app/info.do", function(id) {
    this.get({
        url: "/portal-api/apps/get/" + id,
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/app/remove.do", function(id) {
    this.delete({
        url: "/portal-api/apps/delete/" + id,
    }).then(data => {
        this.send();
    });
});