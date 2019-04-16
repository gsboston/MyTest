var crypto = require('crypto');
exports.aes_algorithm = "aes-128-ecb";


exports.encrypt = function (text) {
    var cipher = crypto.createCipher(this.aes_algorithm, this.aes_secrect)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};

exports.decrypt = function (text) {
    var decipher = crypto.createDecipher(this.aes_algorithm, this.aes_secrect)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};

/**
 * 保存组织和组织体系成员
 */
$RequestMapping("/systemManage/orgRelation/save1.do", function(data) {
    var hw = exports.encrypt("fsadfsdafsdafsdafsadfsadfsadf");
    console.log(hw);
    console.log(exports.decrypt(hw));
});

/**
 * 组织列表
 */
$RequestMapping("/systemManage/organization/list.do", function(curPage, pageSize, searchName) {
    this.get({
        url: "/portal-api/org/getOrgListPage",
        param: {
            page: curPage,
            name: searchName,
            size: pageSize
        }
    }).then((data)=>{
        this.send(data);
    });

    // this.request({
    //     url: "/portal-api/org/pagelist",
    //     param: {
    //         page: curPage,
    //         size: pageSize,
    //         name: searchName
    //     },
    //     method: $Http.METHOD_GET
    // }, {
    //     url: "/portal-api/org/getOrgSignSubject",
    //     method: $Http.METHOD_GET
    // }).then((data,list) => {
    //
    //     for(var i in data.records){
    //         for(var j in list){
    //             if(data.records[i].id==list[j].id){
    //                 data.records[i].signSubject=list[j].signSubject;
    //                 if(list[j].areaMap){
    //                     if(list[j].areaMap.name){
    //                         if(list[j].areaMap.name.length==1){
    //                             data.records[i].province = list[j].areaMap.name[0];
    //                         }
    //                         if(list[j].areaMap.name.length==2){
    //                             data.records[i].province = list[j].areaMap.name[1];
    //                         }
    //                         if(list[j].areaMap.name.length==3){
    //                             data.records[i].province = list[j].areaMap.name[1]+'-'+ list[j].areaMap.name[2];
    //                         }
    //                         if(list[j].areaMap.name.length==4){
    //                             data.records[i].province = list[j].areaMap.name[1] +'-'+ list[j].areaMap.name[2] +'-'+list[j].areaMap.name[3]
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     this.send({
    //         total: data.total,
    //         records: data.records
    //     });
    // });
});

/**
 * 组织新增保存
 */
$RequestMapping("/systemManage/organization/save.do", function(data) {
    if (data.subjectInfo) {
        data.orgSubjectVo = data.subjectInfo;
        delete data.subjectInfo;
    }
    this.post({
        url: "/portal-api/org/",
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 保存组织和组织体系成员
 */
$RequestMapping("/systemManage/orgRelation/save.do", function(data) {
    this.post({
        url: "/portal-api/org/save",
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 组织修改保存
 */
$RequestMapping("/systemManage/organization/update.do", function(data) {
    let subjectInfo = Object.assign({}, data.subjectInfo);
    if (subjectInfo) {
        delete data.subjectInfo;
    }
    if (data.code == data.oldCode){
        delete data.code;
        delete data.oldCode;
    }

    delete data.supportMobileSign;
    this.put({
        url: "/portal-api/org/" + data.id,
        data: data
    }).then(() => {
        if (data.signSubject) {
            if (Object.notEmpty(subjectInfo)) {
                //AES加密阿里、微信支付Key
                exports.aes_secrect = data.id;
                if (!String.isNullOrBlank(subjectInfo.ailiKey)) {
                    subjectInfo.ailiKey = exports.encrypt(subjectInfo.ailiKey);
                }
                if (!String.isNullOrBlank(subjectInfo.wxKey)) {
                    subjectInfo.wxKey = exports.encrypt(subjectInfo.wxKey);
                }

                if (subjectInfo.id) {
                    this.put({
                        url: "/portal-api/orgSubject/" + subjectInfo.id,
                        data: subjectInfo
                    }).then(updateData => {
                        this.send(updateData);
                    });
                }else {
                    subjectInfo.orgId = data.id;
                    this.post({
                        url: "/portal-api/orgSubject/",
                        data: subjectInfo
                    }).then(saveData => {
                        this.send(saveData);
                    });
                }
            }else {
                this.send();
            }
        }else {
            this.delete({
                url: "/portal-api/orgSubject/" + data.id,
                param: {
                    id: data.id
                }
            }).then(() => {
                this.send();
            });
        }
    });
});

/**
 * 根据ID获取组织信息
 */
$RequestMapping("/systemManage/organization/info.do", function(id) {
    this.get({
        url: "/portal-api/org/" + id,
    }).then(data => {
        if (data) {
            if (data.orgSubjectVo) {
                exports.aes_secrect = data.id;
                if (!String.isNullOrBlank(data.orgSubjectVo.wxKey)) {
                    data.orgSubjectVo.wxKey = exports.decrypt(data.orgSubjectVo.wxKey);
                }
                if (!String.isNullOrBlank(data.orgSubjectVo.ailiKey)) {
                    data.orgSubjectVo.ailiKey = exports.decrypt(data.orgSubjectVo.ailiKey);
                }
            }
        }
        this.send(data);
    });
});

/**
 * 组织删除
 */
$RequestMapping("/systemManage/organization/delete.do", function(id) {
    this.delete({
        url: "/portal-api/org/" + id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织删除--机构管理
 */
$RequestMapping("/systemManage/orgRelation/delete.do", function(id) {
    this.delete({
        url: "/portal-api/org/delete/" + id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前登录用户的组织信息
 */
$RequestMapping("/systemManage/organization/currentOrgInfo.do", function() {
    let id = this.getCurrentOrganization().id;
    this.get({
        url: "/portal-api/org/" + id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 返回组织下所有的部门列表
 */
$RequestMapping("/systemManage/organization/getDeptByOrg.do", function() {
    this.get({
        url: "/portal-api/org/getDeptByOrg",
    }).then(data => {
        data.forEach(function (item, index) {
            data[index].title = data[index].name;
            data[index].children = data[index].deps;
            data[index].disabled = true;
            data[index].expand =  true;
            data[index].deps.forEach(function (item1, index1) {
                data[index].deps[index1].title = data[index].deps[index1].name;
            })
        });
        this.send(data);
    });
});

/**
 * 根据ID获取组织下所有部门
 */
$RequestMapping("/systemManage/organization/getDeptByOrg.do", function(orgID, searchText) {
    this.get({
        url: "/portal-api/org/getDeptByOrgId/" + orgID,
        param: {
            name: searchText
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前登录用户所在组织下所有部门
 */
$RequestMapping("/systemManage/organization/getDeptByCurOrg.do", function() {
    let orgID;
    if (this.getCurrentOrganization()) {
        orgID = this.getCurrentOrganization().id;
    }
    this.get({
        url: "/portal-api/org/getDeptByOrg",
    }).then(data => {
        let returnData = {};
        if (null !== orgID && undefined !== orgID && '' !== orgID){
            data.forEach(function (item) {
                if (item.id == orgID){
                    item.title = item.name + '(当前组织)';
                    item.expand = true;
                    item.checked = false;
                    item.disabled = true;
                    returnData = item;
                    var temp = [], lev = 0;
                    forFn(item.deps, null, lev, temp);
                    returnData['children'] = temp;
                }
            });
        }else {
            returnData = data;
        }
        this.send(returnData);
    });
});

/**
 * 部门列表--全部部门树
 */
$RequestMapping("/systemManage/dept/list.do", function() {
    this.get({
        url: "/portal-api/dept",
    }).then(data => {
        var temp = [], lev = 0;
        forFn(data, null, lev, temp);
        this.send(temp);
    });
});

/**
 * 部门新增保存
 */
$RequestMapping("/systemManage/dept/save.do", function(data) {
    this.post({
        url: "/portal-api/dept/",
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 部门修改保存
 */
$RequestMapping("/systemManage/dept/update.do", function(data) {
    this.put({
        url: "/portal-api/dept/" + data.id,
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 部门删除
 */
$RequestMapping("/systemManage/dept/delete.do", function(deptId) {
    this.delete({
        url: "/portal-api/dept/" + deptId,
    }).then(() => {
        this.send();
    });
});

/**
 * 根据ID获取部门
 */
$RequestMapping("/systemManage/dept/info.do", function(deptId) {
    this.get({
        url: "/portal-api/dept/" + deptId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织类型列表
 */
$RequestMapping("/systemManage/organizationType/list.do", function(curPage, pageSize, searchName) {
    this.get({
        url: "/portal-api/orgtypes/pagelist",
        param: {
            page: curPage,
            size: pageSize,
            name: searchName
        }
    }).then(data => {
        this.send({
            total: data.total,
            records: data.records
        });
    });
});

/**
 * 获取组织类型全部数据
 */
$RequestMapping("/systemManage/organizationType/getAll.do", function() {
    this.get({
        url: "/portal-api/orgtypes/",
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织类型新增保存
 */
$RequestMapping("/systemManage/organizationType/save.do", function(data) {
    this.post({
        url: "/portal-api/orgtypes/",
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织类型修改保存
 */
$RequestMapping("/systemManage/organizationType/update.do", function(data) {
    this.put({
        url: "/portal-api/orgtypes/" + data.id,
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织类型删除
 */
$RequestMapping("/systemManage/organizationType/delete.do", function(orgTypeId) {
    this.delete({
        url: "/portal-api/orgtypes/" + orgTypeId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据ID获取组织类型
 */
$RequestMapping("/systemManage/organizationType/info.do", function(orgTypeId) {
    this.get({
        url: "/portal-api/orgtypes/" + orgTypeId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 验证code编码是否唯一
 */
$RequestMapping("/systemManage/organizationType/checkCode.do", function(id, code) {
    this.get({
        url: "/portal-api/orgtypes/getCode/" + code,
    }).then(data => {
        if (data) {
            if (id && id == data.id) {
                this.send(true);
            }else {
                this.send(false);
            }
        }else {
            this.send(true);
        }
    });
});

/**
 * 获取行政区域档案项级联结构
 */
$RequestMapping("/systemManage/bd/getAreaTree.do", function(areaId) {
    this.get({
        url: "/portal-api/basedocs/areaCascade/",
    }).then(data => {
        let returnData = {
            treeData: Object.assign([], data),
            checkedData: null
        };
        forSearchFn(returnData.treeData, areaId, returnData);
        this.send(returnData);
    });
});

/**
 * 获取行政区域档案项级联结构  登陆情况下
 */
$RequestMapping("/systemManage/bd/getAreaDataByCode.do", function(areaId, code) {
    this.get({
        url: "/portal-api/basedocs/areasNew/",
        param: {
            code: code
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取行政区域档案项级联结构  未登录情况下
 */
$RequestMapping("/systemManage/bd/getAreaDataByCodeForNoLogin.do", function(areaId, code) {
    this.get({
        url: "/portal-api/basedocs/areasNew",
        param: {
            code: code
        }
    }).then(data => {
        this.send(data);
    });
},{
    isAuth: false
});

/**
 * 获取组织机构所属区域
 */
$RequestMapping("/systemManage/bd/getOrgArea.do", function(orgId, areaId) {
    this.get({
        url: "/portal-api/basedocs/orgArea/" + orgId,
    }).then(data => {
        if (data) {
            data.code.forEach(function (item, index) {
                if (item == areaId) {
                    data.level = index;
                }
            });
        }
        this.send(data);
    });
});

/**
 * 根据组织ID获取组织主体信息
 */
$RequestMapping("/systemManage/orgSubject/info.do", function(orgId) {
    this.get({
        url: "/portal-api/orgSubject/org/" + orgId
    }).then(data => {
        if (data) {
            exports.aes_secrect = data.orgId;
            if (!String.isNullOrBlank(data.wxKey)) {
                data.wxKey = exports.decrypt(data.wxKey);
            }
            if (!String.isNullOrBlank(data.ailiKey)) {
                data.ailiKey = exports.decrypt(data.ailiKey);
            }
        }
        this.send(data);
    });
});

/**
 * 根据组织ID获取对应的组织体系成员树
 */
$RequestMapping("/systemManage/orgSystems/getCurOrgSysTree.do", function(orgID, defaultOrgId) {
    if (!orgID) {
        if (this.getCurrentOrganization()) {
            orgID = this.getCurrentOrganization().id;
        }
    }
    this.get({
        url: "/portal-api/orgsystems/org/" + orgID + "/orgsystem_org"
    }).then(data => {
        if (data) {
            data.id = orgID;
            data.name = data.name + '（当前组织）';
        }
        this.send(buildTree(data, defaultOrgId));
    });
});

/**
 * 获取当前登录组织
 */
$RequestMapping("/systemManage/orgSystems/getCurOrg.do", function() {
    this.get({
        url: "/portal-api/org/info"
    }).then(data => {
        if (data) {
            data.name = data.name + '（当前组织）';
        }
        this.send(buildTree(data));
    });
});

/**
 * 常用工具类--生成无限级树形结构
 * @param arr old数据集合
 * @param id 根节点
 * @param lev 起始级别
 * @param tempData new数据集合
 */
var forFn = function(arr, id, lev, tempData){
    for (var i = 0; i < arr.length; i++) {
        var item = arr[i];
        item.title = item.name;
        item.expand = true;
        if (item.parent_id==id) {
            item.lev=lev;
            if (lev == 0){
                tempData.push(item);
            }else {
                if (!tempData.children){
                    tempData.children = [];
                }
                tempData.children.push(item);
            }
            forFn(arr, item.id, lev+1, item);
        }
    }
};

/**
 * 常用工具类--树形结构数据查找匹配
 * @param arr old数据集合
 * @param searchId 需要匹配的ID
 * @param returnData 当前匹配的数据
 */
var forSearchFn = function(arr, searchId, returnData){
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        if (arr[i]) {
            arr[i]['title'] = item.label;
            arr[i]['expand'] = true;
            arr[i]['id'] = item.value;
            if (item.value == searchId) {
                arr[i]['checked'] = true;
                arr[i]['selected'] = true;
                returnData.checkedData = arr[i];
            }else {
                arr[i]['checked'] = false;
                arr[i]['selected'] = false;
            }
            forSearchFn(arr[i].children, searchId, returnData);
        }
    }
};

/**
 * 组织体系成员树-操作接口并统一树结构字段，以便前端页面渲染
 * @param {Object} data 后台接口返回的组织体系成员树的树结构，如果值为 null 则返回空数组
 */
let buildTree = function (data, defaultOrgId) {
    if(!data){
        return [];
    }

    let tree = Object.assign({}, data);

    let treeArray = (function build(treeTemp) {
        for (var i in treeTemp) {
            treeTemp[i].title = treeTemp[i].name;
            treeTemp[i].children = treeTemp[i].childList;
            treeTemp[i].expand = true;
            if (defaultOrgId == treeTemp[i].id) {
                treeTemp[i].selected = true;
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

/**
 * 新增机构管理员
 */
$RequestMapping("/systemManage/organization/orgSave.do", function(data) {
    this.post({
        url: "/portal-api/users/orgAdminUser/",
        data: data
    }).then(() => {
        this.send();
    });
});

/**
 * 根據組織ID獲取组织下所有的机构管理员
 */
$RequestMapping("/systemManage/organization/getOrgManager.do", function(orgID) {
    this.get({
        url: "/portal-api/users/getOrgAdminUser/"+orgID,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 机构管理员删除
 */
$RequestMapping("/systemManage/orgManager/delete.do", function(orgId, id) {
    this.delete({
        url: "/portal-api/users/deleteOrgUser/" + orgId,
        param: {
            userId: id
        }
    }).then(() => {
        this.send();
    });
});

/**
 * 获取机构管理员
 */
$RequestMapping("/systemManage/orgManager/orgList.do", function() {
    var list = [
        {
            value: 'ORGANIZATION_LEVEL',
            label: '机构管理员'
        }
    ]
    this.send(list)
});

/**
 * 机构管理中人员启用停用
 */
$RequestMapping("/systemManage/organization/startUp.do", function(id,startUp) {
    this.put({
        url: "/portal-api/users/startUp/"+id+"/",
        param: {
            startUp: startUp,
        },
    }).then(() => {
        this.send();
    });
});

/**
 * 企业开通审核  获取企业申请列表
 */
$RequestMapping("/systemManage/companyOpenAudit/getCompanyOpenApplyList.do", function(page,name,state,startTime,endTime) {
    this.get({
        url: "/portal-api/org/regist/page",
        param: {
            page: page,
            name: name,
            state: state,
            startTime: startTime,
            endTime: endTime,
        },
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 企业开通审核  根据id获取企业开通详情
 */
$RequestMapping("/systemManage/companyOpenAudit/getCompanyInfoById.do", function(id) {
    this.get({
        url: "/portal-api/org/regist/info/" + id,
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 企业开通审核  根据地区id获取地区编码
 */
$RequestMapping("/systemManage/companyOpenAudit/getAreaCodeById.do", function(areaId) {
    this.get({
        url: "/portal-api/basedocs/service/" + areaId,
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 企业开通审核  审核通过
 */
$RequestMapping("/systemManage/companyOpenAudit/auditSuccess.do", function(parentId,id) {
    this.put({
        url: "/portal-api/org/regist/audit/" + id,
        param:{
            parentId: parentId
        }
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 企业开通审核  审核拒绝
 */
$RequestMapping("/systemManage/companyOpenAudit/auditFailure.do", function(id,nullifyReason) {
    this.put({
        url: "/portal-api/org/regist/reject/" + id,
        param: {
            remark: nullifyReason
        }
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 根据组织ID获取对应的组织体系
 */
$RequestMapping("/systemManage/orgSystems/getCurOrgSys.do", function(orgID) {
    if (!orgID) {
        if (this.getCurrentOrganization()) {
            orgID = this.getCurrentOrganization().id;
        }
    }
    this.get({
        url: "/portal-api/orgsystems/org/" + orgID + "/orgsystem_org"
    }).then(data => {
        this.send(buildSubjectList(data));
    });
});

/**
 * 查询当前登录用户所属组织的已上架顾问列表
 */
$RequestMapping("/systemManage/consultant/getConsulatanList.do", function() {
    this.get({
        url: "/ttslb-api/client/consultant/getConsulatanListByOrgId"
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织体系成员 -- 获取当前组织下的所有签约主体
 * @param {Object} data 后台接口返回的组织体系成员树的树结构，如果值为 null 则返回空数组
 */
let buildSubjectList = function (data) {
    if(!data){
        return [];
    }

    let tree = Object.assign({}, data);
    tree.subjectChild = new Array();

    let treeArray = (function build(treeTemp) {
        for (var i in treeTemp) {
            if(treeTemp[i].childList && treeTemp[i].childList.length){
                for (var item in treeTemp[i].childList) {
                    if (item.signSubject) {
                        tree.subjectChild.push(item);
                    }
                }
                build(treeTemp[i].childList);
            }
        }
        return treeTemp;
    })([tree])
    return treeArray;
};

/**
 * 获取组织下的派单岗位人员列表
 */
$RequestMapping("/systemManage/post/getSendPostList.do", function(size) {
    this.get({
        url: "/serve-api/post/user/sendPost/list",
        param: {
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取组织下的接单岗位人员列表
 */
$RequestMapping("/systemManage/post/getRecevPostList.do", function(size) {
    this.get({
        url: "/serve-api/post/user/recevPost/list",
        param: {
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取组织下的服务岗位人员列表
 */
$RequestMapping("/systemManage/post/getServePostList.do", function(size) {
    this.get({
        url: "/serve-api/post/user/servePost/list",
        param: {
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据分页信息查询服务商
 */
$RequestMapping("/systemManage/business/getBillBusinessList.do", function(size) {
    this.get({
        url: "/serve-api/billBusiness/list",
        param: {
            page: 1,
            size: size
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取组织派单和接单权限
 */
$RequestMapping("/systemManage/organization/getPermissionState.do", function(orgId, type) {
    this.get({
        url: '/portal-api/org/profile/serveDataPermissions/get',
        param: {
            orgId: orgId,
            type: type
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织派单、接单权限修改
 */
$RequestMapping("/systemManage/organization/updatePermission.do", function(data) {
    this.post({
        url: '/portal-api/org/profile/serveDataPermissions',
        param: {
            orgId: data.orgId,
            type: data.type,
            value: data.value,
        }
    }).then(() => {
        this.send();
    });
});

/**
 * 根据key获取用户级业务常量配置
 * 获取当前用户是否第一次访问某模块页面
 */
$RequestMapping("/systemManage/organization/checkUserVisitInfo.do", function(key) {
    this.get({
        url: "/portal-api/user/profile/get",
        param: {
            userId: this.getCurrentUser().id,
            key: key
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据key获取用户级业务常量配置
 * 保存用户访问状态
 */
$RequestMapping("/systemManage/organization/saveUserVisitInfo.do", function(key) {
    this.post({
        url: "/portal-api/user/profile/save",
        data: {
            userId: this.getCurrentUser().id,
            key: key
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织是否支持移动端签约状态管理
 */
$RequestMapping("/systemManage/organization/supportMobileSign.do", function(orgId, state) {
    this.post({
        url: "/portal-api/org/supportMobileSign",
        param: {
            orgId: orgId,
            supportMobileSign: state
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 生成签章
 */
$RequestMapping("/systemManage/organization/createSignature.do", function(orgId, companyName, certificateNo) {
    this.post({
        url: "/portal-api/org/createSignature",
        param: {
            orgId: orgId,
            companyName: companyName,
            certificateNo: certificateNo
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织信息管理功能：根据组织ID获取对应的组织体系成员树
 */
$RequestMapping("/systemManage/orgInfoManage/getCurOrgSysTree.do", function(orgID, defaultOrgId, startUp, searchText) {
    if (!orgID) {
        if (this.getCurrentOrganization()) {
            orgID = this.getCurrentOrganization().id;
        }
    }
    this.get({
        url: "/portal-api/orgsystems/org/" + orgID + "/orgsystem_org",
        param: {
            startUp: startUp,
        }
    }).then(data => {
        if (data) {
            data.id = orgID;
            data.name = data.name + '（当前组织）';
        }
        this.send(buildOrgInfoManageTree(data, defaultOrgId, searchText));
    });
});

/**
 * 组织启用停用接口
 */
$RequestMapping("/systemManage/organization/startOrStop.do", function(orgId, type) {
    this.put({
        url: "/portal-api/org/startUp/" + orgId + '?startUp=' + type,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织信息管理功能-操作接口并统一树结构字段，以便前端页面渲染
 * @param {Object} data 后台接口返回的组织体系成员树的树结构，如果值为 null 则返回空数组
 */
let buildOrgInfoManageTree = function (data, defaultOrgId, searchText) {
    if(!data){
        return [];
    }

    let tree = Object.assign({}, data);

    let treeArray = (function build(treeTemp) {
        for (var i in treeTemp) {
            if ((treeTemp[i].code.indexOf(searchText) > -1) || treeTemp[i].name.indexOf(searchText) > -1) {
                treeTemp[i].isSearchResult = true;
            }else {
                treeTemp[i].isSearchResult = false;
            }
            treeTemp[i].title = '【' + treeTemp[i].code + '】' + treeTemp[i].name;
            treeTemp[i].children = treeTemp[i].childList;
            treeTemp[i].expand = true;
            if (treeTemp[i].startUp == '0') {
                treeTemp[i].disabled = true;
            }else {
                treeTemp[i].disabled = false;
            }
            if (defaultOrgId == treeTemp[i].id) {
                treeTemp[i].selected = true;
            }else {
                treeTemp[i].selected = false;
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
