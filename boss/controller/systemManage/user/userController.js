/**
 * 系统管理员用户管理组织树查询接口
 */
$RequestMapping("/systemManage/user/searchTreeUser.do", function(orgId,deptId) {
   this.get({
        url: "/portal-api/org/getDeptByOrg"
    }).then(data => {
        this.send(buildTree(data,orgId,deptId));
    });

});

let buildTree = function (data,orgId,deptId) {

    if(!data){
        return [];
    }
    let treeArray = (function (treeTemp){
        for (var i in treeTemp) {
            treeTemp[i].title = treeTemp[i].name;
            treeTemp[i].children = treeTemp[i].deps;
/*
            if(treeTemp[i].id==orgId||treeTemp[i].id==deptId){
                treeTemp[i].selected = true;
             }*/
            treeTemp[i].expand = false;
            delete treeTemp[i].name;
            delete treeTemp[i].deps;

            for(var j in treeTemp[i].children){
                treeTemp[i].children[j].title = treeTemp[i].children[j].name;
                treeTemp[i].children[j].parent_name = treeTemp[i].title
                treeTemp[i].children[j].expand = false;
                delete treeTemp[i].children[j].name;
            }
        }
        return treeTemp;
    })(data)

    return treeArray;
}




/**
 * 系统管理员用户管理获取列表接口
 */
$RequestMapping("/systemManage/user/userlistInfo.do", function(orgId, deptId, searchText, current, key) {
    this.get({
        url: "/portal-api/users/" + orgId + "/list",
        param:{
            deptId: deptId,
            userName: searchText,
            page: current,
            key: 'yes'
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 根据用户ID获取已分配组织
 */
$RequestMapping("/systemManage/user/userAccessToOrg.do", function(id) {
    this.get({
        url: "/portal-api/org/getOrgByUserId/" + id
    }).then(data => {
        for (var i in data) {
           data[i].title = data[i].name;
        }
        this.send(data);
    });
});

/**
 * 根据用户ID获取未分配组织
 */
$RequestMapping("/systemManage/user/userNoAccessToOrg.do", function(userId, current, name) {
    this.get({
        url: "/portal-api/org/getNotInOrgByUserId/" + userId,
        param: {
            page: current,
            name: name
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 根据用户ID获取已经分配的组织和部门
 */
$RequestMapping("/systemManage/user/userAccessToOrgAanDep.do", function(userId) {
    this.get({
        url: "/portal-api/org/getOrgDeptByUserId/" + userId
    }).then(data => {
        for(var i in data){
            for(var j in data[i].deps){
                data[i].depName = data[i].deps[j].name
                data[i].deptId = data[i].deps[j].id
                data[i].tagPost = [];
                data[i].isActive = false;
            }
        }
        this.send(data);
    });
});

/**
 * 根据组织ID获取部门
 */
$RequestMapping("/systemManage/user/userAccessToDep.do", function(orgId) {
    this.get({
        url: "/portal-api/org/getDeptByOrgId/" + orgId
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取权限级别
 */

$RequestMapping("/systemManage/user/accessPowerLevel.do", function(key) {
    this.get({
        url: "/portal-api/auths/level",
        param: {
            key: key ? key : null
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 重置密码
 */
$RequestMapping("/systemManage/user/resetPassword.do", function(userId) {
    this.put({
        url: "/portal-api/users/reset/"+userId
    }).then(data => {
        this.send(data);
    });
});


/**
 * 根据用户ID、组织ID获取岗位
 */
$RequestMapping("/systemManage/user/userAccessToPost.do", function(data) {
    this.get({
        url: "/portal-api/posts/"+data.orgId+"/posts",
        param: {
            userId: data.userId
        }
    }).then(data => {
        var dataArr = [];
        for(var i in data){
            if(data[i].checked ==1){
                dataArr.push(data[i])
            }
            data[i].isShow = true;
        }
        this.send(dataArr);
    });
});

/**
 * 删除岗位
 */
$RequestMapping("/systemManage/user/postDelete.do", function(data) {
    this.delete({
        url: "/portal-api/users/"+data.userId+"/removeUserPostRelation",
        param: {
            orgId: data.orgId,
            postId: data.postId,
        }
    }).then(data => {
        this.send()
    });
});

/**
 * 根据组织ID、用户ID获取未关联岗位列表
 */
$RequestMapping("/systemManage/user/userAccessPost.do", function(data, key, level) {
    this.get({
        url: "/portal-api/posts/"+data.orgId+"/posts",
        param: {
            userId: data.userId,
            level: level,
            key: key
        }
    }).then(data => {
        var dataArr = [];
        for(var i in data){
            data[i].postList = data[i].name
            if(data[i].checked ==0){
                dataArr.push(data[i])
            }
        }
        this.send(dataArr);
    });
});





/**
 * 系统管理员用户删除用户
 */
$RequestMapping("/systemManage/user/userDelete.do", function(id) {
    this.delete({
        url: "/portal-api/users/" + id +"/delete",
    }).then(() => {
        this.send();
    });
});



/**
 * 新增用户
 */
$RequestMapping("/systemManage/user/saveUser.do", function(data) {
    this.request({
        url: "/portal-api/users/",
        data: data
    }).then(() => {
      /*  throw new BaseError(100,"此用户或名称已经存在");*/
       this.send();
    });
});

/**
 * 岗位获取
 */
$RequestMapping("/systemManage/user/userPost.do", function(orgId) {
    this.get({
        url: "/portal-api/posts/"+orgId+"/list"
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取未绑定岗位接口
 */
$RequestMapping("/systemManage/user/noBindUserPost.do", function(data) {
    this.get({
        url: "/portal-api/posts/"+data.orgId+"/noBindPosts",
        param:{
            userId:data.userId,
            deptId:data.deptId
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 系统管理员用户修改获取用户信息
 */
$RequestMapping("/systemManage/user/userEdit.do", function(id, orgId) {
    this.request({
        url: "/portal-api/users/" + id ,
        method: $Http.METHOD_GET
    }).then((user) => {
        this.send(user);
    });
});

/**
 * 機構管理員獲取用戶信息
 */
$RequestMapping("/systemManage/org/orgEdit.do", function(id) {
    this.request({
        url: "/portal-api/users/" + id ,
        method: $Http.METHOD_GET
    }).then((user) => {
        user.userVo.postLevel =  user.userVo.permissionLevel
        this.send(user);
    });
});

 /** 编辑页面获取权限级别列表

$RequestMapping("/systemManage/user/accessPowerLevelEdit.do", function(id, orgId) {
    this.request({
        url: "/portal-api/users/" + id ,
        method: $Http.METHOD_GET
    }, {
        url:  "/portal-api/auths/level",
        method: $Http.METHOD_GET
    }).then((user, powerLevel) => {
        if(user.userVo.permissionLevel =='SYSTEM_LEVEL'){
            this.send(powerLevel);
        }
        if(user.userVo.permissionLevel =='ORGANIZATION_LEVEL'){
            powerLevel = [{ label: '机构管理员', value: 'ORGANIZATION_LEVEL' },{label: '普通用户', value: 'GENERAL_USER_LEVEL' }]
            this.send(powerLevel);
        }
        if(user.userVo.permissionLevel =='GENERAL_USER_LEVEL'){
            powerLevel = [{label: '普通用户', value: 'GENERAL_USER_LEVEL' }]
            this.send(powerLevel);
        }
    });
});*/

/*
let removeValue = function(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i] == val) {
            arr.splice(i, 1);
            break;
        }
    }
}*/

/**
 * 系统管理员用户修改保存
 */
$RequestMapping("/systemManage/user/userEditSave.do", function(data) {
    this.put({
        url: "/portal-api/users/" + data.id + "/update" ,
        data: {
            realName: data.realName,
            password: data.password,
            userName:data.userName,
            sex:data.sex,
            phone: data.phone,
            permissionLevel:data.permissionLevel
        }
    }).then(() => {
        this.send();
    });
});

$RequestMapping("/systemManage/user/getUserPost.do", function(userId) {
    this.get({
        url: "/portal-api/users/getUserPost/" + userId
    }).then(items => {
        this.send(items);
    });
});

$RequestMapping("/systemManage/user/unbindOrg.do", function(userId, orgId, deptId) {
    this.delete({
        url: "/portal-api/users/" + userId + "/user",
        param: {
            orgId: orgId,
            deptId: deptId
        }
    }).then(() => {
        this.send();
    });
});

$RequestMapping("/systemManage/user/unbindPost.do", function(userId, orgId, postId) {
    this.delete({
        url: "/portal-api/users/" + userId + "/removeUserPostRelation",
        param: {
            orgId: orgId,
            postId: postId
        }
    }).then(() => {
        this.send();
    });
});

/**
 * 关联用户、组织、部门
 */
$RequestMapping("/systemManage/user/saveUserOrgAndDep.do", function(data) {
    this.put({
        url: "/portal-api/users/" + data.userId + "/dept" ,
        param: {
            orgId:data.orgId,
            deptId:data.deptId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 关联用户、组织、岗位
 */
$RequestMapping("/systemManage/user/saveUserOrgAndPost.do", function(data) {
    this.post({
        url: "/portal-api/users/" + data.userId + "/userPostRelation" ,
        param: {
            orgId:data.orgId,
            postId:data.postId
        }
    }).then(data => {
        this.send(data);
    });
});




/**
 * 系统管理员用户管理点击列表详情获取岗位信息接口
 */
$RequestMapping("/systemManage/user/getUserDetailInfo.do", function(id) {
    this.get({
        url: "/portal-api/users/"+id+"/posts"
    }).then(data => {
       /*let arr = []
        for(var i in data){
           arr.push(data[i].postName)
            data[i].postName = arr;
        }*/

        this.send(data);
    });
});


/**
 * 保存岗位接口
 */
$RequestMapping("/systemManage/userPost/save.do", function(data) {
    this.put({
        url: "/portal-api/users/" + data.id + "/update" ,
        data: data
    }).then(data => {
        this.send(data);
    });
});


/**
 * 关联岗位接口
 */
$RequestMapping("/systemManage/userBindPosts/save.do", function(data) {
    this.post({
        url: "/portal-api/users/" + data.orgId + "/bindPosts" ,
        param:{
            orgId:data.orgId,
            deptId:data.deptId,
            userId:data.userId,
            postIds:data.postIds
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 关联接口
 */
$RequestMapping("/systemManage/userBindPosts/save.do", function(data) {
    this.post({
        url: "/portal-api/users/" + data.orgId + "/bindPosts" ,
        param:{
            orgId:data.orgId,
            deptId:data.deptId,
            userId:data.userId,
            postIds:data.postIds
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存用户信息(机构管理)
 */
$RequestMapping("/systemManage/userOrgManage/save.do", function(data) {
    this.post({
        url: "/portal-api/users/" + data.orgId + "/userPost" ,
        param:{
            deptId:data.deptId,
        },
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据手机号查询用户
 */
$RequestMapping("/systemManage/userOrgManage/validation.do", function(phone) {
    this.get({
        url: "/portal-api/users/validation" ,
        param: {
            phone: phone,
        }
    }).then(data => {
        if (data) {
            this.get({
                url: '/portal-api/users/' + data.id,
            }).then(user => {
                this.send(user);
            });
        }else {
            this.send(data);
        }
    });
});

/**
 * 根据用户名查询用户
 */
$RequestMapping("/systemManage/userOrgManage/checkUserName.do", function(userName) {
    this.get({
        url: "/portal-api/users/check" ,
        param: {
            userName: userName,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 关联用户与部门
 */
$RequestMapping("/systemManage/userOrgManage/userOrgRef.do", function(data) {
    this.put({
        url: "/portal-api/users/" + data.userId + "/dept" ,
        param: {
            orgId: data.orgId,
            deptId: data.deptId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 机构管理员用户删除用户
 */
$RequestMapping("/systemManage/userOrgManage/delete.do", function(id, orgId, deptId) {
    this.delete({
        url: "/portal-api/users/" + id +"/user",
        param: {
            orgId: orgId,
            deptId: deptId
        }
    }).then(() => {
        this.send();
    });
});

/**
 * 关联岗位
 * 根据组织ID,部门ID,用户ID,岗位ID关联岗位
 */
$RequestMapping("/systemManage/userOrgManage/userPostRelation.do", function(data) {
    this.post({
        url: "/portal-api/users/" + data.userId +"/userPostRelation",
        param: {
            id: data.userId,
            orgId: data.orgId,
            postId: data.postId
        }
    }).then(data => {
        this.send();
    });
});

/**
 * 删除用户岗位关联关系(机构管理)
 * 用于机构管理员根据用户岗位关联表主键ID删除用户岗位关联表
 */
$RequestMapping("/systemManage/userOrgManage/removeUserPostRelation.do", function(data) {
    this.delete({
        url: "/portal-api/users/" + data.userId +"/removeUserPostRelation",
        param: {
            id: data.userId,
            orgId: data.orgId,
            postId: data.postId
        }
    }).then(data => {
        this.send();
    });
});




/**
 * 新增用户(超级管理员)
 */
$RequestMapping("/systemManage/superUser/saveUser.do", function(data) {
    this.post({
        url: "/portal-api/users/adminUser/",
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 根据岗位ID查询用户列表
 */
$RequestMapping("/systemManage/userOrgManage/getUsersByPostId.do", function(postId, permissionLevel, orgId) {
    this.get({
        url: "/portal-api/users/getUsersByPostId/" + postId,
        param: {
            orgId: orgId,
            permissionLevel: permissionLevel
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织ID，岗位ID查询对应的用户(分页)
 * flag: 【1:待选,2:已选】
 */
$RequestMapping("/systemManage/userOrgManage/getUsersByFlag.do", function(orgId, postId, search, permissionLevel) {
    this.request({
        url: "/portal-api/users/getUsersByIdsPage/" + orgId,
        method: $Http.METHOD_GET,
        param: {
            postId: postId,
            page: 1,
            size: 10000,
            search: search,
            flag: 1,
            permissionLevel: permissionLevel
        }
    }, {
        url: "/portal-api/users/getUsersByIdsPage/" + orgId,
        method: $Http.METHOD_GET,
        param: {
            postId: postId,
            page: 1,
            size: 10000,
            search: search,
            flag: 2,
            permissionLevel: permissionLevel
        }
    }).then((data1, data2) => {
        let returnData = {
            chosenUserData: [],
            unChosenUserData: [],
            allData: [],
            chosenUserDataKeys: []
        };
        if (data1 && data2) {
            returnData.unChosenUserData = Object.assign([], data1.records);
            returnData.chosenUserData = Object.assign([], data2.records);
            returnData.allData = [...returnData.chosenUserData, ...returnData.unChosenUserData];
            returnData.chosenUserData.forEach(item => {
                returnData.chosenUserDataKeys.push(item.id);
            });
            returnData.allData.forEach(item => {
                item.key = item.id;
                item.label = item.realName;
            });
        }
        this.send(returnData);
    });
});









