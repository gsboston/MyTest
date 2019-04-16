
$RequestMapping("/organizeManage/userListOrg/getOrgMenuList.do", function() {
    console.log(this.getCurrentOrganization())
    /*this.request({
        url: "/user/get/" + id,
       }).then(data => {
     });*/

});


/**
 * 组织管理员用户管理获取列表接口
 */
$RequestMapping("/organizeManage/user/userlistInfo.do", function(data) {
    let orgId = 1232323232323;
    this.get({
        url: "/portal-api/users/"+orgId+"/list",
        param:{
            userName:data.userName,
            page:data.page,
            deptId:data.deptId
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 组织管理员用户删除用户
 */
$RequestMapping("/organizeManage/user/userDelete.do", function(id) {
    this.delete({
        url: "/portal-api/users/" + id +"/delete",
    }).then(data => {
        this.send();
    });
});


/**
 * 组织管理员用户修改获取用户信息
 */
$RequestMapping("/organizeManage/user/userEdit.do", function(id, orgId) {
    this.request({
        url: "/portal-api/users/" + id ,
        method: $Http.METHOD_GET
    }, {
        url: "/portal-api/posts/" + orgId + "/list",
        method: $Http.METHOD_GET
    }).then((user, posts) => {
        let userPostMap = {};
        if(user.posts != null) {
            for(let post of user.posts) {
                userPostMap[post.id] = true;
            }
        }
        for(let post of posts) {
            post.checked = (userPostMap[post.id] == true ? true : false);
        }
        user = Object.assign(user, {
            posts: posts
        });

        console.log(user)
        this.send(user);
    });
});


/**
 * 组织管理员用户修改保存
 */
$RequestMapping("/organizeManage/user/userEditSave.do", function(data) {
    let arr = [];
    console.log('abcde111111111111111111')
    console.log(data.postIds)
    for (var i in data.postIds) {
        if(data.postIds[i].checked==true){
            arr.push(data.postIds[i].id)
        }
    }
    console.log('abcde111111111111111111')
    console.log(arr)
    this.put({
        url: "/portal-api/users/" + data.id + "/update" ,
        data: {
            orgId:data.orgId,
            deptId:data.deptId,
            id:data.id,
            realName: data.realName,
            password: data.password,
            userName:data.userName,
            sex:data.sex,
            postIds:arr
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 组织管理员新增用户
 */
$RequestMapping("/organizeManage/user/saveUser.do", function(data) {
    console.log(data)
    this.request({
        url: "/portal-api/users/",
        data: data
    }).then(data => {
        this.send(data);
    });
});
