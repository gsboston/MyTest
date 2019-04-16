/**
 * 服务单定义列表
 */
$RequestMapping("/systemManage/service/defList.do", function(enable) {
    this.get({
        url:'/serve-api/billdef/get',
        param:{
            enable:enable
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务单保存
 */
$RequestMapping("/systemManage/service/saveDefBill.do", function(data) {
    this.post({
        url:'/serve-api/billdef/save',
        data:data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务单资料列表
 */
$RequestMapping("/systemManage/service/infoList.do", function(id,type) {
    this.get({
        url:'/serve-api/billdef/get/billMaterialDef',
        param:{
            place:type,
            billDefId:id
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务单定义停用
 */
$RequestMapping("/systemManage/service/stopType.do", function(id) {
    this.put({
        url:'/serve-api/billdef/disable/'+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务单定义启用
 */
$RequestMapping("/systemManage/service/startType.do", function(id) {
    this.put({
        url:'/serve-api/billdef/enable/'+id
    }).then(data => {
        this.send(data);
    });
});


/**
 * 服务单流程列表
 */
$RequestMapping("/systemManage/service/processList.do", function(id) {
    this.get({
        url:'/serve-api/billdef/billProcessNodes/get?billDefId='+id,
    }).then(data => {
        this.send(data);
    });
});


/**
 * 保存服务单流程
 */
$RequestMapping("/systemManage/service/saveProcess.do", function(data) {
    this.post({
        url:'/serve-api/billdef/billProcessDef/save?billDefId='+data.billDefId,
        data:{
            billProcessNodeDefVos:data.billProcessNodeDefVos,
            prepareMaterialVos:data.prepareMaterialVos,
            outputMaterialVos:data.outputMaterialVos
        }
    }).then(data => {
        this.send(data);
    });
});