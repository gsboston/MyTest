/**
 * 获取组织业务类型列表
 */
$RequestMapping("/systemManage/post/getOrgTypeList.do", function() {
    this.get({
        url: "/portal-api/orgtypes/",
    }).then(data => {
        data.unshift({id:"0",name:"全部"});
        this.send(data);
    });
});

/**
 * 获取岗位列表
 */
$RequestMapping("/systemManage/post/search.do", function(orgTypeId = 0, current, postKey) {
    this.get({
        url: "/portal-api/posts/list",
        param: {
            id: orgTypeId,
            page: current,
            size: 10,
            name: postKey,
        }
    }).then(data => {
        this.send({
            data: data.records,
            current: data.current,
            total: data.total,
        });
    });

});

/**
 * 获取岗位级别列表
 */
$RequestMapping("/systemManage/post/level.do", function() {
    this.get({
        url: "/portal-api/auths/level",
    }).then(data => {
        this.send(data);
    });
});
/**
 * 获取岗位
 */
$RequestMapping("/systemManage/post/info.do", function(postId) {
    this.get({
        url: "/portal-api/posts/"+postId,
    }).then(data => {
        this.send(data);
    });

});

/**
 * 获取岗位角色列表
 */
$RequestMapping("/systemManage/post/postRoleList.do", function(postId, current, postRoleKey) {
    this.get({
        url: "/portal-api/posts/"+postId+"/roles",
        param: {
            page: current,
            size: 99,
            name: postRoleKey,
        }
    }).then(data => {
        this.send({
            data: data.records,
            current: data.current,
            total: data.total,
        });
    });
});

/**
 * 获取当前岗位未绑定角色列表
 */
$RequestMapping("/systemManage/post/roleList.do", function(postId, current, roleKey) {
    this.get({
        url: "/portal-api/posts/"+postId+"/unbindRoles",
        param: {
            page: current,
            size: 10,
            key: roleKey,
        }
    }).then(data => {
        this.send({
            data: data.records,
            current: data.current,
            total: data.total,
        });
    });
});

/**
 * 新增岗位
 */
$RequestMapping("/systemManage/post/save.do", function(data) {
    this.post({
        url: "/portal-api/posts/",
        data: data,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 岗位下新增角色关联
 */
$RequestMapping("/systemManage/post/bindRole.do", function(postId, roleIds) {
    this.put({
        url: "/portal-api/posts/"+postId+"/roles",
        param: {
            roleIds: roleIds
        },
    }).then(data => {
        this.send(data);
    });
});
/**
 * 岗位下删除角色关联
 */
$RequestMapping("/systemManage/post/unbindRole.do", function(postId, roleIds) {
    console.log(roleIds);
    this.delete({
        url: "/portal-api/posts/"+postId+"/bindRoles",
        param: {
            roleIds: roleIds
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 删除岗位
 */
$RequestMapping("/systemManage/post/delete.do", function(postId) {
    this.delete({
        url: "/portal-api/posts/"+postId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 更新岗位
 */
$RequestMapping("/systemManage/post/update.do", function(data) {
    console.log(data);
    this.put({
        url: "/portal-api/posts/"+data.id,
        data: data,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 查询组织下的岗位列表
 * 当不传userId时，返回当前组织所有岗位列表，传入userId时，返回当前组织下当前用户对岗位的选择情况
 */
$RequestMapping("/systemManage/posts/getPosts.do", function(orgId, userId, key, authLevel) {
    this.get({
        url: "/portal-api/posts/" + orgId + "/posts" ,
        param:{
            userId: userId,
            level: authLevel,
            key: key
        }
    }).then(data => {
        data.forEach(function (item, index) {
            data[index].checked = (item.checked == 1 || item.checked == true);
        });
        this.send(data);
    });
});

/**
 * 根据组织ID查询对应的岗位列表和用户数(分页)
 */
$RequestMapping("/systemManage/posts/getOrgPostsByOrgId.do", function(orgId, page, size) {
    this.get({
        url: "/portal-api/posts/getPostsPageByOrgId/" + orgId,
        param:{
            page: page,
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织ID，部门ID，批量设置岗位信息
 */
$RequestMapping("/systemManage/posts/batch/setPost.do", function(data) {
    this.post({
        url: "/portal-api/posts/batchSetPostsByIds",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织ID，岗位ID，批量选择业务人员
 */
$RequestMapping("/systemManage/posts/batch/setUser.do", function(data) {
    this.post({
        url: "/portal-api/posts/batchSetUsersByIds",
        data: data
    }).then(data => {
        this.send(data);
    });
});

