/**
 * 服务岗位设置列表
 */
$RequestMapping("/systemManage/service/orgServePostPage.do", function(id,page,size) {
    this.get({
        url:'/serve-api/post/orgServePostPage',
        param:{
            billDefId:id,
            page:page,
            size:size
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 服务岗位设置列表
 */
$RequestMapping("/systemManage/service/orgServePostPage.do", function(id,page,size) {
    this.get({
        url:'/serve-api/post/orgServePostPage',
        param:{
            billDefId:id,
            page:page,
            size:size
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 服务岗位设置列表
 */
$RequestMapping("/systemManage/service/orgServePostPage.do", function(id,page,size) {
    this.get({
        url:'/serve-api/post/orgServePostPage',
        param:{
            billDefId:id,
            page:page,
            size:size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 编辑服务岗位
 */
$RequestMapping("/systemManage/service/serviceSave.do", function(data,id) {
    this.post({
        url:'/serve-api/post/servePost/save',
        data:data,
        param:{
            billDefId:id,
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 删除服务岗位
 */
$RequestMapping("/systemManage/service/serviceDelete.do", function(id) {
    this.delete({
        url:'/serve-api/post/servePost/delete/' + id,
    }).then(data => {
        this.send(data);
    });
});


