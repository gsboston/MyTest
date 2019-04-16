/*天眼查接口*/
$RequestMapping('/crm/dispatch/searchLBS.do', function (name) {
    let url = '/crm-api/hintCompany/searchLBSByName'
    this.post({
        url: url,
        data: {
            name: name
        },
        param: {
            name: name
        }
    }).then(data => {
        this.send(data)
    })
})


/*获取商机类型*/
$RequestMapping('/crm/dispatch/serviceList.do', function () {
    let url =  '/crm-api/item/bd_service/getItem'
    this.get({
        url: url
    }).then(data => {
        this.send(data);
    })
})


/*添加400派单-企业*/
$RequestMapping("/crm/dispatch/addEnterprise.do", function(data) {
    let url = '/crm-api/hints/dispatch/add'
    let company = data.enterprise;
    let clue = {
        hint: {}
    };
    clue.hint.basic = {
        typeId: 2,
        channelId: 400//手工录入
    };

    clue.hint.basic.provinceCode = company.provinceCode;
    clue.hint.basic.cityCode = company.cityCode;
    clue.hint.basic.districtCode = company.districtCode;
    clue.hint.company = company;

    //备注
    clue.comments = data.comments;
    //组织id
    clue.orgId = data.orgId;
    //用户id
    clue.userIds = data.userIds;
    //服务
    clue.codes = data.codes;

    this.post({
        url: url,
        data: clue
    }).then(data => {
        this.send(data)
    })
})

/*添加400派单-个人*/
$RequestMapping("/crm/dispatch/addPersonal.do", function(data) {
    let url = '/crm-api/hints/dispatch/add'
    let personal = data.personal;
    let clue = {
        hint: {}
    };
    clue.hint.basic = {
        typeId: 1,
        channelId: 400//手工录入
    };

    clue.hint.basic.provinceCode = personal.provinceCode;
    clue.hint.basic.cityCode = personal.cityCode;
    clue.hint.basic.districtCode = personal.districtCode;
    clue.hint.personal = personal;

    //备注
    clue.comments = data.comments;
    //组织id
    clue.orgId = data.orgId;
    //用户id
    clue.userIds = data.userIds;
    //服务
    clue.codes = data.codes;

    this.post({
        url: url,
        data: clue
    }).then(data => {
        this.send(data)
    })
})
