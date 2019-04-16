const fs = require("fs");
/**
 * 获取合同模板
 */
$RequestMapping("/signCloud/getContractTemplate.do", function(typeId) {

    let env = process.env.NODE_ENV;
    if(env.toLowerCase() == "development") {
        if (typeId == 'FB_TWO' || typeId == 'FB_THREE'){
            typeId += '_SIDES';
        }
        fs.readFile('controller/signCloud/contractBuilder/tpl/'+typeId+'.html', {flag: 'r+', encoding: 'utf8'}, (err, data) =>{
            if(err) {
                console.error(err);
                return;
            }
            this.send(data);
        });
    }else {
        this.get({
            url:'/sign-api/contractDef/code?code='+typeId,
        }).then(data => {
            this.send(data.pageContent);
        });
    }
});

/**
 * 合同保存/更新前验证是否有自动审核功能
 */
$RequestMapping("/signCloud/contractBuilder/saveValidation.do", function(saleOrgId,subjectId,contractDefId) {
    this.get({
        url:'/sign-api/contractDef/isAutoApprove',
        param: {
            saleOrgId: saleOrgId,
            subjectId: subjectId,
            contractDefId: contractDefId,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 合同保存/更新
 */
$RequestMapping("/signCloud/contractBuilder/save.do", function(data) {
    if(data.id&&data.id!=''){
        this.put({
            url:'/sign-api/contract/'+data.id,
            data:data
        }).then(data => {
            this.send(data);
        });
    }else{
        this.post({
            url:'/sign-api/contract',
            data:data
        }).then(data => {
            this.send(data);
        });
    }
});

/**
 * 合同查看详情
 */
$RequestMapping("/signCloud/contractBuilder/view.do", function(id) {
    this.get({
        url:'/sign-api/contract/find/'+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取合约模板列表
 */
$RequestMapping("/signCloud/contractSelector/getContractDef.do", function(serviceItemCode, itemServiceCode, name) {
    this.get({
        url:'/sign-api/contractDef/list/org',
        param: {
            serviceItemCode: serviceItemCode,
            itemServiceCode: itemServiceCode,
            name: name,
            size: 50
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取乙方企业列表
 */
$RequestMapping("/signCloud/contractBuilder/loadCompanyList.do", function(defId) {
    this.get({
        url:'/sign-api/contractDefSubject/list/orgs',
        param:{contractDefId:defId}
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取甲方客户信息列表
 */
$RequestMapping("/signCloud/contractBuilder/getCustomerList.do", function(data) {
    this.get({
        url:'/portal-api/customer/list',
        param:{
            type:data.type,
            name:data.name,
            idno:data.idno
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据code过去合同定义列表
 */
$RequestMapping("/signCloud/contractBuilder/getTypeByDefCode.do", function(code) {
    this.get({
        url: "/sign-api/contractDef/list/" + code,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取全部组织
 */
$RequestMapping("/signCloud/jumpSelectOrg/searchOrgList.do", function(page,name) {
    this.get({
        url: "/portal-api/org/getOrgListPage",
        param: {
            page: page,
            name: name
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织id获取全部用户
 */
$RequestMapping("/signCloud/jumpSelectOrg/searchUserList.do", function(page,name,orgId) {
    this.get({
        url: "/portal-api/users/getGeneralUsersPageByOrgId/" + orgId,
        param: {
            page: page,
            search: name
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 分页查询服务类档案项
 */
$RequestMapping("/systemManage/bd/getServiceItemByGroupId.do", function(groupId) {
    this.get({
        url: "/portal-api/basedocs/service/list",
        param: {
            groupId: groupId
        }
    }).then(data => {
        this.send(data);
    });
});



