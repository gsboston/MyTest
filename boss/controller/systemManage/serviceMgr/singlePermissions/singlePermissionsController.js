/**
 * 接单岗位列表
 */
$RequestMapping("/systemManage/service/ordersList.do", function(type,page,size,state) {
    this.get({
        url:'/serve-api/post/page',
        param:{
            type:type,
            page:page,
            size:size,
            state:state
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 岗位人员列表（已选） 带翻页
 */
$RequestMapping("/systemManage/service/personnelList.do", function(id,page,size) {
    this.get({
        url:'/serve-api/post/postUserPage',
        param:{
            secPostId:id,
            page:page,
            size:size
        }
    }).then(data => {
        this.send(data);
    });
});/**
 * 岗位人员列表（已选） 不带翻页
 */
$RequestMapping("/systemManage/service/postUserList.do", function(id) {
    this.get({
        url:'/serve-api/post/postUserList',
        param:{
            secPostId:id
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 岗位人员列表（待选）
 */
$RequestMapping("/systemManage/service/orgUserList.do", function() {
    this.get({
        url:'/serve-api/post/orgUserList',
    }).then(data => {
        this.send(data);
    });
});

/**
 * 选择岗位人员
 */
$RequestMapping("/systemManage/service/userPost.do", function(id,userIds) {
    this.post({
        url:'/serve-api/post/save/userPost',
        param:{
            secPostId:id,
            userIds:userIds
        }
    }).then(() => {
        this.send();
    });
});
/**
 * 选择服务单
 */
$RequestMapping("/systemManage/service/postBillDef.do", function(id,billDefIds) {
    this.post({
        url:'/serve-api/post/save/postBillDef',
        param:{
            secPostId:id,
            billDefIds:billDefIds
        }
    }).then(() => {
        this.send();
    });
});
/**
 * 可接服务单列表 （带翻页-已选）
 */
$RequestMapping("/systemManage/service/postBillDefPage.do", function(id,page,size) {
    this.get({
        url:'/serve-api/post/postBillDefPage',
        param:{
            secPostId:id,
            page:page,
            size:size
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 可接服务单列表 （已选）
 */
$RequestMapping("/systemManage/service/postBillDefList.do", function(id) {
    this.get({
        url:'/serve-api/post/postBillDefList',
        param:{
            secPostId:id
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 可接服务单列表 （带翻页）----待选列表
 */
$RequestMapping("/systemManage/service/orgBillDefPage.do", function(page,size) {
    this.get({
        url:'/serve-api/post/orgBillDefPage',
        param:{
            page:page,
            size:size
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 可接服务单列表 （不带翻页）---待选列表
 */
$RequestMapping("/systemManage/service/orgBillDefList.do", function() {
    this.get({
        url:'/serve-api/post/orgBillDefList',
    }).then(data => {
        this.send(data);
    });
});

/**
 * 添加，修改，删除接单岗位列表
 */
$RequestMapping("/systemManage/service/save.do", function(data) {
    this.post({
        url:'/serve-api/post/receivePost/save',
        data:data
    }).then(data => {
        this.send(data);
    });
});


/**
 * 校验岗位编码
 */
$RequestMapping("/systemManage/service/checkServiceCode.do", function(code,type,id) {
    this.get({
        url:'/serve-api/post/code/check',
        param:{
            code:code,
            type:type,
            id:id
        }
    }).then(data => {
        this.send(data);
    });
});


