/**
 * 查询线索列表
 */
$RequestMapping('/crm/dataManage/list.do', function (data) {
    let url = '/crm-api/hintError/findHintListPage';
    let searchCriteria = data.searchCriteria;
    let tempObj = {};

    //线索名称
    if (searchCriteria.name) tempObj.name = searchCriteria.name;
    //是否精确查找
    if (searchCriteria.isAccurate) tempObj.isAccurate = searchCriteria.isAccurate;
    //联系电话
    if (searchCriteria.mobile) tempObj.mobile = searchCriteria.mobile;
    // 报错日期
    if(searchCriteria.errorTime && searchCriteria.errorTime.length == 2){
        let isTempErrorTime = true;
        let tempErrorTime = searchCriteria.errorTime.map((item,index) => {
            if (item == '' || item == null) isTempErrorTime = false;
            let tempDateObj =  new Date(item);
            let tempDateStr = tempDateObj.getFullYear()+"-"+(tempDateObj.getMonth()+1)+"-"+tempDateObj.getDate();
            tempDateStr += index == 0 ? ' 00:00:00' : ' 23:59:59';
            return new Date(tempDateStr).getTime();
        });
        if (isTempErrorTime) {
            tempObj.errorMinTime = tempErrorTime[0];
            tempObj.errorMaxTime = tempErrorTime[1];
        }
    }
    //报错人
    if (searchCriteria.person) tempObj.person = searchCriteria.person;
    // 报错原因
    if (searchCriteria.errorReasonType.length !== 0) tempObj.errorReason = searchCriteria.errorReasonType;

    let userId = this.getCurrentUser().id;
    this.post({
        url: url,
        data: tempObj,
        param: {
            currentPage: data.page,
            pageSize: data.pageSize
        }
    }).then(data => {
        data.page = parseInt(data.from);
        delete data.from;
        data.hints.forEach((item, index) => {
            item.errorTime = DateFormat.dateToString(item.errorTime, 'yyyy-MM-dd HH:mm:ss');
            // typeId 1 是个人，2 是公司
            item.isEnterprise = item.basic.typeId === 2;
            item.isExtend = false;
            item.isCollected = item.collection;
            item.isError = item.errorReport;
            item.selectedTab = null;
            item.basic.tsUpdate = DateFormat.dateToString(item.basic.tsUpdate, 'yyyy-MM-dd HH:mm:ss');
            item.basic.maxTrackTime = DateFormat.dateToString(item.basic.maxTrackTime, 'yyyy-MM-dd HH:mm:ss');
            if (item.basic.creator === userId) {
                item.basic.isCreateYouself = true;
            }

            delete item.collection;
            delete item.errorReport;

            if (item.isEnterprise) {
                item.personal.company = '';
                item.company.foundingTime = DateFormat.dateToString(item.company.foundingTime);
                item.company.authortyDate = DateFormat.dateToString(item.company.authortyDate);
                item.company.startTime = DateFormat.dateToString(item.company.startTime);
                item.company.endTime = DateFormat.dateToString(item.company.endTime);
                item.company.registeredCapital = item.company.registeredCapital / 10000;
            } else {
                item.personal.birthday = DateFormat.dateToString(item.personal.birthday);
            }
            item.tags.forEach((tag, index) => {
                if (tag.creator === userId) {
                    tag.isCreateYouself = true;
                }
            })
        })
        this.send(data);
    });
});

/**
 * 根据线索id查找要修改的相线索详情(企业)
 */
$RequestMapping('/crm/dataManage/enterpriseDetails.do', function (hxId) {
    let url = `/crm-api/hints/detailpackage/${hxId}`;

    this.get({
        url: url
    }).then(data => {
        let tempData = {};
        let mainClue = data.hint;
        if(mainClue.company.foundingTime)mainClue.company.foundingTime = DateFormat.dateToString(mainClue.company.foundingTime);
        mainClue.company.registeredCapital = Number(mainClue.company.registeredCapital) / 10000;
        mainClue.company.oldName = mainClue.company.name;
        tempData.mainClue = mainClue;
        let relatedHints = data.relatedHints;
        let relatedHintsList = [];

        for(let i=0; i<relatedHints.length; i++){
            if(relatedHints[i].personal.birthday)relatedHints[i].personal.birthday = DateFormat.dateToString(relatedHints[i].personal.birthday);
            relatedHints[i].personal.oldMobile = relatedHints[i].personal.mobile;
            relatedHintsList.push({
                id: i,
                name: relatedHints[i].personal.name,
                value: relatedHints[i]
            })
        }
        tempData.relatedHintsList = relatedHintsList;

        this.send(tempData);
    });
});

/**
 * 保存修改线索(企业)
 */
$RequestMapping('/crm/dataManage/saveEnterprise.do', function (data) {
    let url = '/crm-api/hintError/updateErrorFrom';
    let mainClue = data.mainClue;
    let company = data.company;
    let relatedHintsList = data.relatedHintsList;
    let tempObj = {};
    // 处理企业线索
    delete company.oldName;
    if(company.foundingTime)company.foundingTime = new Date(company.foundingTime).getTime();
    if(company.registeredCapital)company.registeredCapital = Number(company.registeredCapital) * 10000;
    mainClue.basic.provinceCode = company.provinceCode;
    mainClue.basic.cityCode = company.cityCode;
    mainClue.basic.districtCode = company.districtCode;
    mainClue.company = company;
    // 处理关联线索(个人)
    let relatedHints = [];
    for(let i=0; i<relatedHintsList.length; i++){
        let tempRelatedHints = relatedHintsList[i].value;
        let personal = tempRelatedHints.personal;
        delete personal.oldMobile;
        if(personal.birthday)personal.birthday = new Date(personal.birthday).getTime();
        tempRelatedHints.basic.provinceCode = personal.provinceCode;
        tempRelatedHints.basic.cityCode = personal.cityCode;
        tempRelatedHints.basic.districtCode = personal.districtCode;
        tempRelatedHints.personal = personal;
        relatedHints.push(tempRelatedHints);
    }
    tempObj.hint = mainClue;
    tempObj.relatedHints = relatedHints;

    this.post({
        url: url,
        data: tempObj
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据线索id查找要修改的相线索详情(个人)
 */
$RequestMapping('/crm/dataManage/personalDetails.do', function (hxId) {
    let url = `/crm-api/hints/detailpackage/${hxId}`;

    this.get({
        url: url
    }).then(data => {
        let tempData = {};
        let mainClue = data.hint;
        mainClue.personal.oldMobile = mainClue.personal.mobile;
        if(mainClue.personal.birthday)mainClue.personal.birthday = DateFormat.dateToString(mainClue.personal.birthday);
        tempData.mainClue = mainClue;
        let relatedHints = data.relatedHints;
        let relatedHintsList = [];

        for(let i=0; i<relatedHints.length; i++){
            if(relatedHints[i].company.foundingTime)relatedHints[i].company.foundingTime = DateFormat.dateToString(relatedHints[i].company.foundingTime);
            relatedHints[i].company.registeredCapital = Number(relatedHints[i].company.registeredCapital) / 10000;
            relatedHints[i].company.oldName = relatedHints[i].company.name;
            relatedHintsList.push({
                id: i,
                name: relatedHints[i].company.name,
                value: relatedHints[i]
            })
        }
        tempData.relatedHintsList = relatedHintsList;

        this.send(tempData);
    });
});

/**
 * 保存修改线索(个人)
 */
$RequestMapping('/crm/dataManage/savePersonal.do', function (data) {
    let url = '/crm-api/hintError/updateErrorFrom';
    let mainClue = data.mainClue;
    let personal = data.personal;
    let relatedHintsList = data.relatedHintsList;
    let tempObj = {};
    // 处理个人线索
    delete personal.oldMobile;
    if(personal.birthday)personal.birthday = new Date(personal.birthday).getTime();
    mainClue.basic.provinceCode = personal.provinceCode;
    mainClue.basic.cityCode = personal.cityCode;
    mainClue.basic.districtCode = personal.districtCode;
    mainClue.personal = personal;
    // 处理关联线索(企业)
    let relatedHints = [];
    for(let i=0; i<relatedHintsList.length; i++){
        let tempRelatedHints = relatedHintsList[i].value;
        let company = tempRelatedHints.company;
        delete company.oldName;
        if(company.foundingTime)company.foundingTime = new Date(company.foundingTime).getTime();
        if(company.registeredCapital)company.registeredCapital = Number(company.registeredCapital) * 10000;
        tempRelatedHints.basic.provinceCode = company.provinceCode;
        tempRelatedHints.basic.cityCode = company.cityCode;
        tempRelatedHints.basic.districtCode = company.districtCode;
        tempRelatedHints.company = company;
        relatedHints.push(tempRelatedHints);
    }
    tempObj.hint = mainClue;
    tempObj.relatedHints = relatedHints;

    this.post({
        url: url,
        data: tempObj
    }).then(data => {
        this.send(data);
    });
});

/**
 * 查询错误信息列表
 */
$RequestMapping('/crm/dataManage/findHintErrorListPage.do', function(hxid, page, size) {
    let url = `/crm-api/hintError/findHintErrorListPage`;

    this.get({
        url: url,
        param: {
            hxid: hxid,
            currentPage: page,
            pageSize: size
        }
    }).then(data => {
        this.send(data);
    });

});

/**
 * 更正报错线索状态
 */
$RequestMapping('/crm/dataManage/updateHintErrorStatus.do', function(HintErrorVos) {
    let url = `/crm-api/hintError/updateHintErrorStatus`;
    // console.log(HintErrorVos)
    this.post({
        url: url,
        data: HintErrorVos
    }).then(data => {
        this.send(data);
    });

});

/**
 * 根据企业名称判断线索是否存在
 */
$RequestMapping('/crm/dataManage/isRepeatEnterpriseName.do', function (id, name) {
    let url = '/crm-api/hintCompany/selectByNameAndCompanyIdExists';

    this.post({
        url: url,
        param: {
            companyId: id,
            name: name
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据个人手机号判断线索是否存在
 */
$RequestMapping('/crm/dataManage/isRepeatPersonalMobile.do', function (id, mobile) {
    let url = '/crm-api/hintPersonal/selectByMobileAndPersonalIdExists';

    this.post({
        url: url,
        param: {
            personalId: id,
            mobile: mobile
        }
    }).then(data => {
        this.send(data);
    });
});