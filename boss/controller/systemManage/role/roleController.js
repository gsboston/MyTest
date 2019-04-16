/**
 * 获取角色列表
 * 分页
 * name 条件
 */
$RequestMapping("/systemManage/role/search.do", function(page, name, pageSize) {
    this.get({
        url:'/portal-api/role/list',
        param:{
            page: page,
            name: name,
            size: pageSize
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 新增角色
 */
$RequestMapping("/systemManage/role/add.do", function(data) {
    this.post({
        url:'/portal-api/role',
        data:data
    }).then(data => {
        this.send();
    });
});

/**
 * 根据角色获取职责
 */
$RequestMapping("/systemManage/role/findDutyByRole.do", function(id) {
    this.get({
        url:'/portal-api/role/'+id+'/duty'
    }).then(data => {
        this.send(data);
    });
});

// $RequestMapping("/systemManage/role/findUsedDutyByRole.do", function(id) {
//     this.get({
//         url:'/adminApi/role/'+id+'/nunDuty'
//     }).then(data => {
//         this.send(data);
//     });
// });

/**
 * 角色与职责列表的关联操作
 */
$RequestMapping("/systemManage/role/refRoleDuty.do", function(id,dutyList) {
    this.put({
        url:'/portal-api/role/'+id+'/duty',
        param:{dutyList:dutyList}
    }).then(data => {
        this.send();
    });
});

/**
 * 解除角色与职责的关联关系
 */
$RequestMapping("/systemManage/role/removeDutyByRole.do", function(roleId,dutyId) {
    this.delete({
        url:'/portal-api/role/'+roleId+'/roleDuty',
        param:{dutyId:dutyId}
    }).then(data => {
        this.send();
    });
});
/**
 * 删除角色
 */
$RequestMapping("/systemManage/role/removeRole.do", function(id) {
    this.delete({
        url:'/portal-api/role/'+id
    }).then(data => {
        this.send();
    });
});