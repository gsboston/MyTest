/**
 * 派单岗位列表
 */
$RequestMapping("/systemManage/serviceSend/permissionList.do", function(state) {
    this.get({
        url:'/serve-api/post/list',
        param:{
            type:'DISPATCH',
            state:state
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 人员列表
 */
$RequestMapping("/systemManage/serviceSend/personList.do", function(id) {
    this.get({
        url:'/serve-api/post/postUserList?secPostId='+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合约列表
 */
$RequestMapping("/systemManage/serviceSend/agreementList.do", function(id) {
    this.get({
        url:'/serve-api/post/postContractList?secPostId='+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 所有人员列表
 */
$RequestMapping("/systemManage/serviceSend/allPersonList.do", function() {
    this.get({
        url:'/serve-api/post/orgUserList'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 修改人员列表
 */
$RequestMapping("/systemManage/serviceSend/changePersonList.do", function(data) {
    this.post({
        url:'/serve-api/post/save/userPost',
        param:{
            secPostId:data.id,
            userIds:data.targetKeys
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 所有合约列表
 */
$RequestMapping("/systemManage/serviceSend/allAgreementList.do", function() {
    this.get({
        url:'/serve-api/post/orgContractList'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 修改合约列表
 */
$RequestMapping("/systemManage/serviceSend/changeAgreementList.do", function(data) {
    this.post({
        url:'/serve-api/post/save/postContract',
        param:{
            secPostId:data.id,
            contractDefIds:data.targetKeys
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存岗位信息
 */
$RequestMapping("/systemManage/serviceSend/savePost.do", function(data) {
    this.post({
        url:'/serve-api/post/dispatchPost/save',
        data:data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 启用岗位信息
 */
$RequestMapping("/systemManage/serviceSend/startPost.do", function(id) {
    this.put({
        url:'/serve-api/post/enable/'+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 停用岗位信息
 */
$RequestMapping("/systemManage/serviceSend/stopPost.do", function(id) {
    this.put({
        url:'/serve-api/post/disable/'+id
    }).then(data => {
        this.send(data);
    });
});

