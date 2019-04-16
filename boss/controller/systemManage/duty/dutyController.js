/**
 * 查询所有职责
 * 分页
 * 条件：名称
 */
$RequestMapping("/systemManage/duty/searchAll.do", function(page,name) {
     this.get({
         url:'/portal-api/duty/list',
         param:{page:page,name:name}
     }).then(data => {
         this.send(data);
     });
});
/**
 * 根据职责ID获取功能树
 */
$RequestMapping("/systemManage/duty/findFunctionTreeByDutyId.do", function(id) {
    this.get({
        url:'/portal-api/funcs/duty/'+id
    }).then(data => {
        this.send(data);
    });
});
/**
 * 获取所有的职责
 */
$RequestMapping("/systemManage/duty/findAllDuty.do", function() {
    this.get({
        url:'/portal-api/duty'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存职责
 */
$RequestMapping("/systemManage/duty/save.do", function(data) {
    if(data.id){
        this.put({
            url:'/portal-api/duty/'+data.id,
            data:data
        }).then(data => {
            this.send();
        });
    }else{
        this.post({
            url:'/portal-api/duty',
            data:data
        }).then(data => {
            this.send();
        });
    }

});

/**
 * 删除职责
 */
$RequestMapping("/systemManage/duty/remove.do", function(id) {
    this.delete({
        url:'/portal-api/duty/'+id
    }).then(data => {
        this.send();
    });
});

/**
 * 获取功能树（所有）
 */
$RequestMapping("/systemManage/duty/getFuncTree.do", function() {
    this.get({
        url:'/portal-api/funcs/list'
    }).then(data => {
        let result= data.map(m=>{
            m.expand= true;
            m.title= m.name;
            m.disableCheckbox = true;
            m.children= m.funcVos;
            return m;
        });
        this.send(result);
    });
});

/**
 * 通过职责ID获取功能
 */
$RequestMapping("/systemManage/duty/findFuncByDuty.do", function(id) {
    this.get({
        url:'/portal-api/duty/'+id+'/func'
    }).then(data => {
        this.send(data);
    });
});
/**
 * 保存职责的功能列表
 */
$RequestMapping("/systemManage/duty/saveFunc.do", function(dutyId,funcList) {
    this.put({
        url:'/portal-api/duty/'+dutyId+'/func',
        data:funcList
    }).then(data => {
        this.send(data);
    });
});