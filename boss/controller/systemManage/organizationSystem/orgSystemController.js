/**
 * 组织体系列表
 */
$RequestMapping("/systemManage/organizationSystem/getOrgSystemList.do", function(data) {
    this.get({
        url: '/portal-api/orgsystems/list',
        param: {
            page: data.page,
            key: data.orgName
        }
    }).then(data => {
        data.records.forEach(function (currentValue) {
            currentValue.effectiveDate = DateFormat.dateToString(currentValue.effective_date, 'yyyy/MM/dd HH:mm:ss');
            delete currentValue.effective_date;
        });
        this.send(data);
    });
});

/**
 * 组织体系成员树
 */
$RequestMapping("/systemManage/organizationSystem/getOrgSystemMember.do", function(id) {
    this.get({
        url: `/portal-api/orgsystems/${id}/orgsystem_org`
    }).then(data => {
        this.send(buildTree(data));
    });
});

/**
 * 不在组织体系里的组织列表
 */
$RequestMapping("/systemManage/organizationSystem/getOrgOuterList.do", function(data) {
    this.get({
        url: '/portal-api/org/notInSysTemlist',
        param: data
    }).then(data => {
        for(let i in data.records){
            data.records[i].orgName = data.records[i].name;
            data.records[i].orgCode = data.records[i].code;
            data.records[i].orgType = data.records[i].systemName;
            data.records[i].orgCreateDate = data.records[i].ts_insert;
            delete data.records[i].name;
            delete data.records[i].code;
            delete data.records[i].systemName;
            delete data.records[i].ts_insert;
        }
        this.send(data);
    });
});

/**
 * 组织体系查询-根据 id 获取组织体系
 */
$RequestMapping("/systemManage/organizationSystem/info.do", function(id) {
    this.get({
        url: "/portal-api/orgsystems/" + id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织体系新增
 */
$RequestMapping("/systemManage/organizationSystem/add.do", function(data) {
    this.post({
        url: "/portal-api/orgsystems/",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织体系修改
 */
$RequestMapping("/systemManage/organizationSystem/update.do", function(data) {
    this.put({
        url: '/portal-api/orgsystems/' + data.id,
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 组织体系删除
 */
$RequestMapping("/systemManage/organizationSystem/orgSystemDel.do", function(orgSystemId) {
    this.delete({
        url: "/portal-api/orgsystems/" + orgSystemId
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织体系树新增组织成员
 */
$RequestMapping("/systemManage/organizationSystem/AddOrgTree.do", function(data) {
    this.post({
        url: "/portal-api/orgsystems/orgsystemOrg",
        data: {
            org_id: data.item.id,
            orgsystem_id: data.id,
            parent_id: data.item.parentId || 0
        }
    }).then(data => {
        this.send(data.id);
    });
});

/**
 * 组织体系树删除组织成员
 */
$RequestMapping("/systemManage/organizationSystem/delOrgTree.do", function(data) {
    this.delete({
        url: "/portal-api/orgsystems/" + data.orgSystemId + "/orgsystemOrg/" + data.orgSystemOrgId,
    }).then(data => {
        this.send(data);
    });
});

let buildTree2 = function (data) {
    console.log('buildTree')
    console.log(data);
    let tree = {};

    tree.id = data.id;
    tree.title = data.name;
    tree.children = data.childList;
    tree.expand = true;

    for(let key in tree.children){
        tree.children[key].title = tree.children[key].name;
        tree.children[key].children = tree.children[key].childList;
        tree.children[key].expand = true;
    }

    return [tree];
}
/**
 * 组织体系成员树-操作接口并统一树结构字段，以便前端页面渲染
 * @param {Object} data 后台接口返回的组织体系成员树的树结构，如果值为 null 则返回空数组
 */
let buildTree = function (data) {
    if(!data){
        return [];
    }
    let tree = Object.assign({}, data);
    let treeArray = (function build(treeTemp) {
        for (var i in treeTemp) {
            treeTemp[i].title = treeTemp[i].name;
            treeTemp[i].children = treeTemp[i].childList;
            treeTemp[i].expand = true;

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