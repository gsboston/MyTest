/**
 * 获取合约定义列表
 */
$RequestMapping("/systemManage/contractDefine/contractDefine.do", function(pageNum) {
    // this.get({
    //     url:'/sign-api/contractDef/list'
    // }).then(data => {
    //     this.send(data);
    // }, error => {
    //     console.log('---------------------获取合约定义列表失败');
    //     this.send(error);
    // });
    this.get({
        url:'/sign-api/contractDef/page',
        param: {
            page: pageNum,
            size: 10,
        },
    }).then(data => {
        this.send({
            data: data.records,
            current: data.current,
            total: data.total,
        });
    }, error => {
        console.log('---------------------获取合约定义列表失败');
        this.send(error);
    });
});
/**
 * 删除合约定义
 */
$RequestMapping("/systemManage/contractDefine/contractDefineDelete.do", function(id) {
    this.delete({
        url:'/sign-api/contractDef/' + id
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------合约定义项删除失败');
        this.send(error);
    });
});
/**
 * 获取对应服务的列表
 */
$RequestMapping("/systemManage/addContractDefine/getServer.do", function() {
    this.get({
        url:'/portal-api/basedocs/items/bd_service'
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取对应服务的列表失败');
        this.send(error);
    });
});
/**
 * 新建合同定义信息
 */
$RequestMapping("/systemManage/addContractDefine/saveContractDefine.do", function(data) {
    if(data.isFreeDist==null){
        data.isFreeDist = "fixedSubject";
    }else{
        data.isFreeDist =data.isFreeDist == "selfSubject"?true:false;
    }
    this.post({
        url:'/sign-api/contractDef',
        data: data
    }).then(data => {
        this.send(data);
    });
});
/**
 * 获取使用范围列表
 */
$RequestMapping("/systemManage/contractDefine/getUseRangeList.do", function(id,current) {
    this.get({
        url:'/sign-api/contractDefArea/page',
        param: {
            contractDefId: id,
            current: current
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取使用范围列表失败');
        this.send(error);
    });
});
/**
 * 获取签约主体列表
 */
$RequestMapping("/systemManage/contractDefine/getContractSubjectList.do", function(id,current) {
    this.get({
        url:'/sign-api/contractDefSubject/page',
        param: {
            contractDefId: id,
            page: current
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取签约主体列表失败');
        this.send(error);
    });
});
/**
 * 获取服务单列表
 */
$RequestMapping("/systemManage/contractDefine/getServerList.do", function(id,current) {
    this.get({
        url:'/sign-api/contractDefService/page',
        param: {
            contractDefId: id,
            page: current
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取服务单列表失败');
        this.send(error);
    });
});
/**
 * 根据合同定义id获取合同定义信息
 */
$RequestMapping("/systemManage/addContractDefine/getContractDefineInfoById.do", function(id) {
    this.get({
        url:'/sign-api/contractDef/' + id
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------根据合同定义id获取合同定义信息失败');
        this.send(error);
    });
});
/**
 * 获取全部区域及其选中状态
 */
$RequestMapping("/systemManage/allotmentPage/getAllAreas.do", function(contractDefId) {
    this.get({
        url:'/portal-api/basedocs/provinceTree',
        param: {
            contractDefId:contractDefId
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取全部区域及其选中状态失败');
        this.send(error);
    });
});
/**
 * 获取全部组织
 */
$RequestMapping("/systemManage/allotmentPage/getAllOrgs.do", function(areaArray) {
    this.get({
        url:'/portal-api/orgsystems/orgInfoList',
        param:{
            areaCodes:areaArray
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取全部组织失败');
        this.send(error);
    });
});
/**
 * 获取选中的组织
 */
$RequestMapping("/systemManage/allotmentPage/getSelectedOrgs.do", function(contractDefId,areaArray) {
    this.get({
        url:'/sign-api/contractDefArea/list/org',
        param:{
            contractDefId:contractDefId,
            areaIds:areaArray
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取选中的组织失败');
        this.send(error);
    });
});
/**
 * 保存合同定义所属区域及组织
 */
$RequestMapping("/systemManage/allotmentPage/saveAreaAndOrg.do", function(data) {
    this.post({
        url:'/sign-api/contractDefArea',
        data: data
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------保存合同定义所属区域及组织失败');
        this.send(error);
    });
});
/**
 * 获取全部签约主体
 */
$RequestMapping("/systemManage/allotmentPage/getAllContractSubject.do", function(contractDefId) {
    this.get({
        // url:'/portal-api/orgsystems/orgInfoLists',
        url:'/sign-api//contractDefSubject/allList',
        param:{
            contractDefId: contractDefId,
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取全部签约主体失败');
        this.send(error);
    });
});
/**
 * 获取选择的签约主体
 */
$RequestMapping("/systemManage/allotmentPage/getSelectedContractSubject.do", function(contractDefId) {
    this.get({
        url:'/sign-api/contractDefSubject/list',
        param: {
            contractDefId:contractDefId
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取选择的签约主体失败');
        this.send(error);
    });
});
/**
 * 保存合约的签约主体
 */
$RequestMapping("/systemManage/allotmentPage/saveContractSubject.do", function(data) {
    this.post({
        url:'/sign-api/contractDefSubject',
        data: data
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------保存合同定义所属区域及组织失败');
        this.send(error);
    });
});
/**
 * 添加或移除合约模板的签约主体
 */
$RequestMapping("/systemManage/allotmentPage/editContractSubject.do", function(data) {
    this.post({
        url:'/sign-api/contractDefSubject/edit',
        param:{
            flag: data.flag,
        },
        data: data
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------编辑合同定义所属区域及组织失败');
        this.send(error);
    });
});
/**
 * 获取该合约全部服务单
 */
$RequestMapping("/systemManage/allotmentPage/loadAllServer.do", function(contractDefId) {
    this.get({
        url:'/sign-api/contractDefService/allot/list',
        param: {
            contractDefId:contractDefId
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------获取该合约全部服务单失败');
        this.send(error);
    });
});
/**
 * 保存合约对应的服务单
 */
$RequestMapping("/systemManage/allotmentPage/serviceSave.do", function(data) {
    this.post({
        url:'/sign-api/contractDefService',
        data: data
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------保存合约对应的服务单失败');
        this.send(error);
    });
});

/**
 * 超级管理员  根据合同定义类型获取对应的自动审核规则列表
 */
$RequestMapping("/systemManage/auditConfigurationPage/getRulesListById.do", function(contractDefId) {
    this.get({
        url:'/sign-api/autoApproveDef/list',
        param: {
            contractDefId: contractDefId
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('---------------------根据合同定义类型获取对应的自动审核规则列表失败');
        this.send(error);
    });
});

/**
 * 超级管理员  根据合同定义类型修改自定义审核规则是否开启
 */
$RequestMapping("/systemManage/auditConfigurationPage/changeOpenSwitch.do", function(contractDefId,status) {
    this.put({
        url:'/sign-api/contractDef/' + contractDefId + "/autoApprove",
        param: {
            isAutoApprove: status
        }
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------根据合同定义类型修改自定义审核规则是否开启失败');
        this.send(error);
    });
});

/**
 * 超级管理员  根据合同定义类型删除审核规则
 */
$RequestMapping("/systemManage/auditConfigurationPage/removeRule.do", function(ruleId) {
    this.delete({
        url:'/sign-api/autoApproveDef/' + ruleId,
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------根据合同定义类型删除审核规则失败');
        this.send(error);
    });
});

/**
 * 超级管理员  根据合同定义类型保存审核规则
 */
$RequestMapping("/systemManage/auditConfigurationPage/saveRule.do", function(data) {
    this.post({
        url:'/sign-api/autoApproveDef/',
        data: data
    }).then(data => {
        this.send();
    }, error => {
        console.log('---------------------根据合同定义类型保存审核规则失败');
        this.send(error);
    });
});

/**
 * 组织结构管理员   获取已经开启的审核规则名称列表
 */
$RequestMapping("/systemManage/auditConfigurationPage/getOpenRulesList.do", function() {
    this.get({
        url: "/sign-api/orgAutoApprove/myAutoApprove",
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织结构管理员   获取自动审核规则列表
 */
$RequestMapping("/systemManage/orgInformationSetting/getRulesList.do", function() {
    this.get({
        url: "/sign-api/orgAutoApprove/autoApprove",
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织结构管理员   组织自动审核规则开关
 */
$RequestMapping("/systemManage/orgInformationSetting/changeOpenSwitch.do", function(contractDefId,check) {
    this.post({
        url: "/sign-api/orgAutoApprove/",
        param: {
            contractDefId: contractDefId,
            check: check
        }
    }).then(data => {
        this.send(data);
    });
});


/**
 * 组织结构管理员   根据合同模板定义获取自动审核规则列表实例
 */
$RequestMapping("/systemManage/orgInformationSetting/getRuleInfoList.do", function(contractDefId) {
    this.get({
        url: "/sign-api/autoApprove/list",
        param: {
            contractDefId: contractDefId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 组织结构管理员   保存自动审核规则实例
 */
$RequestMapping("/systemManage/orgInformationSetting/saveRuleInfoList.do", function(data) {
    var records = [];
    for(var i=0;i<data.ruleInfoList.length;i++){
        if(data.ruleInfoList[i].limitCondition && data.ruleInfoList[i].values1 && (data.ruleInfoList[i].limitCondition!="range" || (data.ruleInfoList[i].limitCondition=="range" && data.ruleInfoList[i].values2))){
            var temp = {
                autoApproveDefId: data.ruleInfoList[i].autoApproveDefId,
                contractDefId: data.ruleInfoList[i].contractDefId,
                id: data.ruleInfoList[i].id,
                isEnable: data.ruleInfoList[i].isEnable,
                limitCondition: data.ruleInfoList[i].limitCondition,
                orgId: data.ruleInfoList[i].orgId,
                values1: data.ruleInfoList[i].values1,
                values2: data.ruleInfoList[i].values2,
            };
            records.push(temp);
        }
    }
    let sendData = {records:records};
    console.log(sendData);
    this.post({
        url: "/sign-api/autoApprove/",
        data: sendData
    }).then(data => {
        this.send(data);
    });
});




