/**
 * 服务单列表
 */
$RequestMapping("/systemManage/service/list.do", function() {
    this.get({
        url: '/serve-api/billdef/get',
        param: {
            enable: true
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务商列表
 */
$RequestMapping("/systemManage/serviceProvider/list.do", function(serviceId, page) {
    this.get({
        url: '/serve-api/billBusiness/getBuinessPage',
        param: {
            billDefId: serviceId,
            page: page,
            size: 10
        }
    }).then(data => {
        if (data) {
            if (data.records) {
                data.records.forEach((item, index) => {
                    if (item.isView == 1) {
                        data.records[index]['isViewFlag'] = true;
                    }else {
                        data.records[index]['isViewFlag'] = false;
                    }
                });
            }
        }
        this.send(data);
    });
});

/**
 * 服务商 -- 保存
 */
$RequestMapping("/systemManage/serviceProvider/save.do", function(data) {
    if (data.isViewFlag) {
        data.isView = 1;
    }else {
        data.isView = 0;
    }
    this.post({
        url: '/serve-api/billBusiness/save',
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 服务商 -- 更新
 */
$RequestMapping("/systemManage/serviceProvider/update.do", function(data) {
    if (data.isViewFlag) {
        data.isView = 1;
    }else {
        data.isView = 0;
    }
    this.put({
        url: '/serve-api/billBusiness/' + data.id,
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 服务商 -- 删除
 */
$RequestMapping("/systemManage/serviceProvider/delete.do", function(id) {
    this.delete({
        url: '/serve-api/billBusiness/' + id,
    }).then(() => {
        this.send();
    });
});

/**
 * 服务商 -- 详情
 */
$RequestMapping("/systemManage/serviceProvider/info.do", function(id) {
    this.get({
        url: '/serve-api/billBusiness/' + id,
    }).then(data => {
        if (data) {
            if (data.isView == 1) {
                data['isViewFlag'] = true;
            }else {
                data['isViewFlag'] = false;
            }
        }
        this.send(data);
    });
});

/**
 * 服务商 -- 获取最大优先级
 */
$RequestMapping("/systemManage/serviceProvider/levelHighest.do", function(serviceId) {
    this.get({
        url: '/serve-api/billBusiness/highest',
        param: {
            billDefId: serviceId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 系统管理员用户管理组织树查询接口
 */
$RequestMapping("/systemManage/serviceProvider/searchOrgTree.do", function() {
    this.get({
        url: "/portal-api/org/getOutOrg",
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取生效的组织体系下的所有组织
 */
$RequestMapping("/systemManage/serviceProvider/searchInOrgTree.do", function() {
    this.get({
        url: "/portal-api/orgsystems/effective"
    }).then(data => {
        if (data && data.length > 0) {
            this.get({
                url: "/portal-api/orgsystems/" + data[0].id + "/orgsystem_org"
            }).then(orgData => {
                let orgId = this.getCurrentOrganization().id;
                this.send(buildOrgTree(orgData, orgId));
            });
        }
    });
});

let buildTree = function (data,orgId) {
    if(!data){
        return [];
    }
    let treeArray = (function (treeTemp){
        for (var i in treeTemp) {
            treeTemp[i].title = treeTemp[i].name;
            treeTemp[i].children = [];
            treeTemp[i].expand = false;
            if (orgId && treeTemp[i].id == orgId) {
                treeTemp[i].selected = true;
            }
            delete treeTemp[i].name;
            delete treeTemp[i].deps;

            for(var j in treeTemp[i].children){
                treeTemp[i].children[j].title = treeTemp[i].children[j].name;
                treeTemp[i].children[j].parent_name = treeTemp[i].title
                treeTemp[i].children[j].expand = false;
                treeTemp[i].children[j].expand = false;
                delete treeTemp[i].children[j].name;
            }
        }
        return treeTemp;
    })(data)

    return treeArray;
}

/**
 * 组织体系成员树-操作接口并统一树结构字段，以便前端页面渲染
 * @param {Object} data 后台接口返回的组织体系成员树的树结构，如果值为 null 则返回空数组
 */
let buildOrgTree = function (data, orgId) {
    if(!data){
        return [];
    }
    let tree = Object.assign({}, data);
    let treeArray = (function build(treeTemp) {
        for (var i in treeTemp) {
            treeTemp[i].title = treeTemp[i].name;
            treeTemp[i].children = treeTemp[i].childList;
            treeTemp[i].expand = true;
            if (treeTemp[i].id == orgId) {
                treeTemp[i].disabled = true;
            }

            delete treeTemp[i].name;
            delete treeTemp[i].childList;

            if(treeTemp[i].children && treeTemp[i].children.length){
                build(treeTemp[i].children);
            }
        }
        return treeTemp;
    })([tree])
    return treeArray;
}


