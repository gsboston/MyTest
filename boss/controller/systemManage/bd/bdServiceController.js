//获取服务档案项目
$RequestMapping("/systemManage/bd/searchServiceItems.do", function(page,name,groupId) {
    this.get({
        url:'/portal-api/basedocs/service/page',
        param:{page:page,searchText:name,groupId:groupId}
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/bd/getServiceItem.do", function(id) {
    this.get({
        url:'/portal-api/basedocs/getItemSuppById/'+id,
    }).then(data => {
        this.send(data);
    });
});

//保存服务档案
$RequestMapping("/systemManage/bd/saveServiceItem.do", function(vo,groupId) {
    console.log(vo);
    this.post({
        url:'/portal-api/basedocs/service/save?groupId='+groupId,
        data:vo
    }).then(data => {
        this.send(data);
    });
});

//获取服务群组
$RequestMapping("/systemManage/bd/getGroupList.do", function(page) {
    this.get({
        url:'/portal-api//basedocs/serviceGroup/page',
        param:{page:page}
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/systemManage/bd/getAllGroupList.do", function() {
    this.get({
        url:'/portal-api//basedocs/serviceGroup/list'
    }).then(data => {
        this.send(data);
    });
});

//保存服务群组
$RequestMapping("/systemManage/bd/saveServiceGroup.do", function(data) {
    console.log(data);
    this.post({
        url:'/portal-api/basedocs/serviceGroup/save',
        data:data
    }).then(data => {
        this.send(data);
    });
});

//删除服务群组
$RequestMapping("/systemManage/bd/removeServiceGroup.do", function(id) {
    this.delete({
        url:'/portal-api/basedocs/serviceGroup/remove?id='+id
    }).then(data => {
        this.send();
    });
});

//删除服务档案
$RequestMapping("/systemManage/bd/removeServiceItem.do", function(id) {
    this.delete({
        url:'/portal-api//basedocs/service/remove?id='+id
    }).then(data => {
        this.send();
    });
});