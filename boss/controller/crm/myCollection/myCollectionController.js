/**
 * 服务类型数据列表
 */
$RequestMapping('/crm/myCollection/serviceTypeList.do', function () {
    let url = '/crm-api/intentionTag/list';

    this.get({
        url: url
    }).then(serviceTypeList => {
        // console.log(serviceTypeList);
        this.send(serviceTypeList);
    });
    // let serviceTypeList = [
    //     {
    //         id: '1',
    //         name: '会计服务',
    //         select: false,//是否选择
    //         edit: false//是否可以删除
    //     }
    // ];
    //
    // this.send(serviceTypeList);
});
/**
 * 意向度数据列表
 */
$RequestMapping('/crm/myCollection/intentionalityList.do', function () {
    let url = '/crm-api/opportunity/intentionality';

    this.get({
        url: url
    }).then(intentionalityList => {
        this.send(intentionalityList);
    });
});
/**
 * 请求行业分类列表数据
 */
$RequestMapping('/crm/myCollection/industryTypeList.do', function () {
    let url = '/crm-api/item/getIndustry';

    this.get({
        url: url
    }).then(industryTypeList => {
        this.send(industryTypeList);
    });
});
/**
 * 请求企业状态列表数据
 */
$RequestMapping('/crm/myCollection/enterpriseStatusList.do', function () {
    let url = '/crm-api/item/getEnterpriseOperState';

    this.get({
        url: url
    }).then(enterpriseStatusList => {
        this.send(enterpriseStatusList);
    });
});
/**
 * 请求用户所在组织区域信息
 */
$RequestMapping('/crm/myCollection/userRegionInfo.do', function () {
    let orgId = this.getCurrentOrganization().id;
    let url = `/portal-api/basedocs/orgArea/${orgId}`;

    this.get({
        url: url
    }).then(data => {
        if(data && data.code)data.code = data.code.splice(1, 1);
        if(data && data.name)data.name = data.name.splice(1, 1);
        // console.log(data);
        this.send(data);
    });
    // let temp = {
    //     code:['100000','110000','110100','110102'],
    //     name:['全国', '北京市', '北京市市辖区', '西城区']
    // };
});
/**
 * 获取组织联系地址
 */
$RequestMapping('/crm/myCollection/getOrgAddress.do', function () {
    let orgId = this.getCurrentOrganization().id;
    let url = `/portal-api/org/${orgId}`;
    this.get({
        url: url
    }).then(data => {
        let orgAddress = '';
        if(data.orgSubjectVo)orgAddress = data.orgSubjectVo.address;
        if(data.areaName)orgAddress = data.areaName;
        this.send(orgAddress);
    });
});
/**
 * 区域数据列表
 */
$RequestMapping('/crm/myCollection/regionList.do', function () {
    let url = '/portal-api/basedocs/areas';

    this.get({
        url: url
    }).then(data => {
        // console.log(data)
        this.send(data);
    });
});
/**
 * 请求下级区域列表数据
 */
$RequestMapping('/crm/myCollection/loadInferior.do', function (code) {
    let url = '/portal-api/basedocs/areas';

    this.get({
        url: url,
        param: {
            code: code
        }
    }).then(data => {
        // console.log(data)
        this.send(data);
    });
});
/**
 * 查询结果
 */
$RequestMapping('/crm/myCollection/searchResult.do', function (data) {
    let searchCriteria = data.searchCriteria;

    let tempObj = {};
    //区域
    let tempRegion = searchCriteria.region;
    for(let i=0; i<tempRegion.length; i++){
        if(i == 0)tempObj.provinceCode = tempRegion[i];
        if(i == 1)tempObj.cityCode = tempRegion[i];
        if(i == 2)tempObj.districtCode = tempRegion[i];
    }
    //线索名称
    if(searchCriteria.name) tempObj.name = searchCriteria.name;
    //服务类型
    let tempServiceType = searchCriteria.serviceType.map((item) => {
        return item.name
    });
    if(tempServiceType.length !== 0) tempObj.serviceTag = tempServiceType;
    //意向度 （高、中、低）
    if(searchCriteria.intentionality) tempObj.intentionalityLevel = searchCriteria.intentionality;
    //地址
    if(searchCriteria.address) tempObj.address = searchCriteria.address;
    // 收藏时间
    if(searchCriteria.collectionTime){
        let isTempCollectionTime = true;
        let tempCollectionTime = searchCriteria.collectionTime.map((item,index) => {
            if(item == '' || item == null) isTempCollectionTime = false;
            let tempDateObj =  new Date(item);
            let tempDateStr = tempDateObj.getFullYear()+"-"+(tempDateObj.getMonth()+1)+"-"+tempDateObj.getDate();
            tempDateStr += index == 0 ? ' 00:00:00' : ' 23:59:59';
            return new Date(tempDateStr).getTime();
        });
        if(isTempCollectionTime) {
            tempObj.collectionMinTime = tempCollectionTime[0];
            tempObj.collectionMaxTime = tempCollectionTime[1];
        }
    }
    // 拜访执行
    if(searchCriteria.visitExecution){
        let isVisitExecution = true;
        let tempVisitExecution = searchCriteria.visitExecution.map((item,index) => {
            if(item == '' || item == null) isVisitExecution = false;
            let tempDateObj =  new Date(item);
            let tempDateStr = tempDateObj.getFullYear()+"-"+(tempDateObj.getMonth()+1)+"-"+tempDateObj.getDate();
            tempDateStr += index == 0 ? ' 00:00:00' : ' 23:59:59';
            return new Date(tempDateStr).getTime();
        });
        if(isVisitExecution) {
            tempObj.visite_min_time = tempVisitExecution[0];
            tempObj.visite_max_time = tempVisitExecution[1];
        }
    }
    // 下次拜访
    if(searchCriteria.nextVisit){
        let isNextVisit = true;
        let tempNextVisit = searchCriteria.nextVisit.map((item,index) => {
            if(item == '' || item == null) isNextVisit = false;
            let tempDateObj =  new Date(item);
            let tempDateStr = tempDateObj.getFullYear()+"-"+(tempDateObj.getMonth()+1)+"-"+tempDateObj.getDate();
            tempDateStr += index == 0 ? ' 00:00:00' : ' 23:59:59';
            return new Date(tempDateStr).getTime();
        });
        if(isNextVisit) {
            tempObj.next_visite_min_time = tempNextVisit[0];
            tempObj.next_visite_max_time = tempNextVisit[1];
        }
    }
    // console.log(tempObj);
    let url = '/crm-api/hintCollection/search';

    let userId = this.getCurrentUser().id;

    this.post({
        url: url,
        data: tempObj,
        param: {
            from: data.page,
            size: data.pageSize
        }
    }).then(data => {
        // console.log(data);

        data.page = parseInt(data.from);
        delete data.from;

        data.hints.forEach((item, index) => {
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

            if(item.isEnterprise){
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
 * 业务往来-查询
 */
$RequestMapping('/crm/myCollection/dealingsList.do', function (id,page,size) {
    let url = `/crm-api/hintContract/${id}/trades`;

    this.get({
        url: url,
        param: {
            page: page,
            size: size
        }
    }).then(data => {
        let records = data.records || [];
        data.list = records.map((item) => {
            return {
                date: DateFormat.dateToString(new Date(item.signDate), 'yyyy-MM-dd'),
                serviceField: '与该企业签单【' + item.businessName + '】'
            };
        });
        this.send(data);
    });

    // let list = tempList.map((item) => {
    //     return {
    //         date: item.date,
    //         serviceField: '与该企业签单【' + item.name + '】'
    //     };
    // });
    // this.send(list);
});

/**
 * 信息评价-列表
 */
$RequestMapping('/crm/myCollection/evaluationList.do', function (hxId,page,size) {
    let url = `/crm-api/hintEvaluate/evaluatesPage/${hxId}`;

    this.get({
        url: url,
        param: {
            page: page,
            size: size
        }
    }).then(data => {
        // console.log(data);
        this.send(data);
    });
});
/**
 * 点赞与点踩接口
 */
$RequestMapping('/crm/myCollection/badPraiseEvaluate.do', function (evaluateId,type) {
    let userId = this.getCurrentUser().id;
    let url = `/crm-api/hintReview/evaluateReview/${evaluateId}/${userId}/${type}`;
    this.put({
        url: url
    }).then(data => {
        // console.log(data);
        this.send(data);
    });
});

/**
 * 保存添加其他服务类型
 */
$RequestMapping("/crm/myCollection/saveServiceType.do", function(name) {
    let url = '/crm-api/intentionTag/create';

    this.post({
        url: url,
        data: {
            name : name
        }
    }).then(data => {
        // item = {
        //     id: 1,
        //     name: name,
        //     isEdit: true,
        //     isSelect: false
        // }
        this.send(data);
    });
});

/**
 * 删除添加其他服务类型
 */
$RequestMapping("/crm/myCollection/delServiceType.do", function(id) {
    let url = `/crm-api/intentionTag/remove/${id}`;

    this.delete({
        url: url
    }).then(data => {
        this.send();
    });
});

/**
 * 根据输入的公司名称向后台查找相关公司
 */
$RequestMapping('/crm/myCollection/companyNameList.do', function (name) {
    let url = `/crm-api/hintCompany/${encodeURIComponent(name)}`;
    let userId = this.getCurrentUser().id;
    this.get({
        url: url
    }).then(data => {
        data.forEach((item, index) => {
            if (item.creator === userId) {
                item.isCreateYouself = true;
            }else {
                item.isCreateYouself = false;
            }
        });
        // console.log(data);
        this.send(data);
    });
});

/**
 * 根据线索id查找相关线索
 */
$RequestMapping('/crm/myCollection/enterprise.do', function (hxId) {
    let url = `/crm-api/hints/detail/${hxId}`;

    this.get({
        url: url
    }).then(data => {
        // console.log(data);
        if(data.company.foundingTime)data.company.foundingTime = DateFormat.dateToString(data.company.foundingTime);
        this.send(data);
    });
});

/**
 * 信息评价分数
 */
$RequestMapping('/crm/myCollection/evaluationScore.do', function (id) {
    let url = `/crm-api/hintEvaluate/evaluates/${id}`;

    this.get({
        url: url
    }).then(data => {
        this.send(data);
    });
});
/**
 * 请求公司类型列表数据
 */
$RequestMapping('/crm/myCollection/companyTypeList.do', function () {
    let url = '/crm-api/item/getBusinessEnterprise';

    this.get({
        url: url
    }).then(companyTypeList => {
        this.send(companyTypeList);
    });
});

/**
 * 添加线索-企业
 */
$RequestMapping("/crm/myCollection/saveEnterprise.do", function(data, addType) {
    let url = '/crm-api/hints/0/0';
    if(data.addType && data.addType == 'collection') url = '/crm-api/hints/addHintAndCollect/0/0';
    let company = data.enterprise;
    if(company.foundingTime)company.foundingTime = new Date(company.foundingTime).getTime();
    if(company.registeredCapital)company.registeredCapital = Number(company.registeredCapital) * 10000;
    let clue = {};
    clue.basic = {
        typeId: 2,
        channelId: 100//手工录入
    };

    //如果组织信用号为空注册社会统一码
    if(company.taxCode==""){
        company.taxCode = company.socialCreditCode;
    }
    //如果注册号为空注册社会统一码
    if(company.registerCode==""){
        company.registerCode = company.socialCreditCode;
    }

    clue.basic.provinceCode = company.provinceCode;
    clue.basic.cityCode = company.cityCode;
    clue.basic.districtCode = company.districtCode;
    clue.company = company;

    // console.log(clue);
    this.post({
        url: url,
        data: clue
    }).then(data => {
        // console.log(data);
        if(data.company.foundingTime)data.company.foundingTime = DateFormat.dateToString(data.company.foundingTime);
        this.send(data);
    });
});
/**
 * 修改添加线索-企业
 */
$RequestMapping("/crm/myCollection/modifyEnterprise.do", function(data) {
    let url = '/crm-api/hintCompany/update';
    let clue = data.clue;
    let company = data.enterprise;
    if(company.foundingTime)company.foundingTime = new Date(company.foundingTime).getTime();
    if(company.registeredCapital)company.registeredCapital = Number(company.registeredCapital) * 10000;

    /*//如果组织信用号为空注册社会统一码
    if(company.taxCode==""){
        company.taxCode = company.socialCreditCode;
    }
    //如果注册号为空注册社会统一码
    if(company.registerCode==""){
        company.registerCode = company.socialCreditCode;
    }*/

    clue.company = company;
    clue.basic.provinceCode = company.provinceCode;
    clue.basic.cityCode = company.cityCode;
    clue.basic.districtCode = company.districtCode;
    // console.log(clue);




    this.post({
        url: url,
        data: clue
    }).then(data => {
        if(data.company.foundingTime)data.company.foundingTime = DateFormat.dateToString(data.company.foundingTime);
        this.send(data);
    });
});
/**
 * 根据企业线索查询详情
 */
$RequestMapping('/crm/myCollection/enterpriseClueDetails.do', function (id) {
    let url = `/crm-api/hints/detail/${id}`;

    let number = 0;
    let timer = () => {
        number++;
        this.get({
            url: url
        }).then(data => {
            // console.log(data);
            if(!data && number < 3){
                timer();
            }else {
                this.send(data);
            }
        });
    };
    timer();
});
/**
 * 添加线索企业线索-基本信息保存
 */
$RequestMapping("/crm/myCollection/saveEnterpriseBasicInformation.do", function(data) {
    let url = '/crm-api/hintCompany/update';
    // console.log(data);
    let base = data.base;
    let company = data.company;
    // 营业期限
    let isTempBusinessTerm = true;
    let tempBusinessTerm = base.businessTerm.map((item) => {
        if(item == '' || item == null) isTempBusinessTerm = false;
        return new Date(item).getTime();
    });
    if(isTempBusinessTerm) {
        company.startTime = tempBusinessTerm[0];
        company.endTime = tempBusinessTerm[1];
    }
    company.foundingTime = new Date(base.foundingTime).getTime();
    company.authortyDate = new Date(base.authortyDate).getTime();
    // console.log(company);
    this.post({
        url: url,
        data: company
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据输入的手机号查找相关线索信息
 */
$RequestMapping('/crm/myCollection/mobileList.do', function (mobile) {
    let url = `/crm-api/hintPersonal/searchmobile/${encodeURIComponent(mobile)}`;
    let userId = this.getCurrentUser().id;
    this.get({
        url: url
    }).then(data => {
        data.forEach((item, index) => {
            if (item.creator === userId) {
                item.isCreateYouself = true;
            }else {
                item.isCreateYouself = false;
            }
        });
        // console.log(data);
        this.send(data);
    });
});
/**
 * 添加线索-个人
 */
$RequestMapping("/crm/myCollection/savePersonal.do", function(data, addType) {
    let url = '/crm-api/hints/0/0';
    if(data.addType && data.addType == 'collection') url = '/crm-api/hints/addHintAndCollect/0/0';
    let personal = data.personal;
    let tags = data.interestList;
    if(personal.birthday)personal.birthday = new Date(personal.birthday).getTime();
    let clue = {};
    clue.basic = {
        typeId: 1,
        channelId: 100//手工录入
    };
    clue.basic.provinceCode = personal.provinceCode;
    clue.basic.cityCode = personal.cityCode;
    clue.basic.districtCode = personal.districtCode;
    clue.personal = personal;
    clue.tags = tags;

    // console.log(clue);
    this.post({
        url: url,
        data: clue
    }).then(data => {
        if(data.personal.birthday)data.personal.birthday = DateFormat.dateToString(data.personal.birthday);
        this.send(data);
    });
});
/**
 * 修改添加线索-个人
 */
$RequestMapping("/crm/myCollection/modifyPersonal.do", function(data) {
    let url = '/crm-api/hintPersonal/update';

    let clue = data.clue;
    let personal = data.personal;
    let tags = data.interestList;
    if(personal.birthday)personal.birthday = new Date(personal.birthday).getTime();
    clue.personal = personal;
    clue.basic.provinceCode = personal.provinceCode;
    clue.basic.cityCode = personal.cityCode;
    clue.basic.districtCode = personal.districtCode;
    clue.tags = tags;
    // console.log(clue);

    this.post({
        url: url,
        data: clue
    }).then(data => {
        if(data.personal.birthday)data.personal.birthday = DateFormat.dateToString(data.personal.birthday);
        this.send(data);
    });
});
/**
 * 添加线索个人线索-基本信息保存
 */
$RequestMapping("/crm/myCollection/savePersonalBasicInformation.do", function(data) {
    let url = '/crm-api/hintPersonal/updatePersonalAndHobbyTags';
    // console.log(data);
    let base = data.base;
    let tags = data.interestList;
    let personalInfo = data.personalInfo;
    personalInfo.birthday = new Date(base.birthday).getTime();
    // console.log(personalInfo);
    this.post({
        url: url,
        data: {
            hobbyTags: {
                tags: tags
            },
            personal: personalInfo
        }
    }).then(data => {
        this.send(data);
    });
});
/**
 * 发表评论
 */
$RequestMapping("/crm/myCollection/commentOn.do", function(data) {
    let url = '/crm-api/hintEvaluate/';
    let userId = this.getCurrentUser().id;
    let commentOn = data.commentOn;
    commentOn.labels = data.choiceTagList.map((item) => {
        return {
            name: item.name,
            type: item.type,
            hxId: commentOn.hxId,
        };
    });
    commentOn.creator = userId;
    commentOn.modifier = userId;
    commentOn.type = 1;

    // console.log(commentOn);
    this.post({
        url: url,
        data: commentOn
    }).then(data => {
        this.send(data);
    });
});
/**
 * 标签列表
 */
$RequestMapping('/crm/myCollection/tagList.do', function (hxId) {
    let url = `/crm-api/hints/${hxId}/tags`;

    this.get({
        url: url
    }).then(data => {
        let tagList = [];
        if(data && data.tags){
            for(let i=0; i<data.tags.length; i++){
                if(data.tags[i].type == 4) tagList.push(data.tags[i]);
            }
        }
        this.send(tagList);
    });
});
/**
 * 是否已评价
 */
$RequestMapping('/crm/myCollection/isEvaluation.do', function (hxId) {
    let userId = this.getCurrentUser().id;
    let url = `/crm-api/hintEvaluate/evaluates/${hxId}/${userId}`;

    this.get({
        url: url
    }).then(data => {
        this.send(data);
    });
});
/**
 * 请求性别列表数据
 */
$RequestMapping('/crm/myCollection/getSexList.do', function () {
    let url = '/crm-api/item/getSex';

    this.get({
        url: url
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据输入的手机号查找相关线索信息(主要人员)
 */
$RequestMapping('/crm/myCollection/mobilePersonnelList.do', function (mobile, companyId) {
    let url = `/crm-api/hintPersonal/searchByMobileAndCompanyId/${encodeURIComponent(mobile)}/${encodeURIComponent(companyId)}`;
    let userId = this.getCurrentUser().id;
    this.get({
        url: url
    }).then(data => {
        data.forEach((item, index) => {
            if (item.creator === userId) {
                item.isCreateYouself = true;
            }else {
                item.isCreateYouself = false;
            }
        });
        // console.log(data);
        this.send(data);
    });
});

/**
 * 关联线索个人和公司关联关系
 */
$RequestMapping("/crm/myCollection/relationClue.do", function(data) {
    let url = '/crm-api/personalCompany/create';

    this.post({
        url: url,
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据公司名称和用户Id获取未与该个人关联并且公司名称与参数相同的公司线索信息(他的企业)
 */
$RequestMapping('/crm/myCollection/nameAndPersonalId.do', function (name, personalId) {
    let url = `/crm-api/hintCompany/searchByNameAndPersonalId/${encodeURIComponent(name)}/${encodeURIComponent(personalId)}`;
    let userId = this.getCurrentUser().id;
    this.get({
        url: url
    }).then(data => {
        data.forEach((item, index) => {
            if (item.creator === userId) {
                item.isCreateYouself = true;
            }else {
                item.isCreateYouself = false;
            }
            if(item.foundingTime)item.foundingTime = DateFormat.dateToString(item.foundingTime);
            if(item.registeredCapital)item.registeredCapital = item.registeredCapital / 10000;
        });
        // console.log(data);
        this.send(data);
    });
});

/**
 * 批量上传Excel
 */
$RequestMapping("/crm/myCollection/saveBatchAddition.do", function(userId,realName,orgId,orgName,phone,data) {
    let url = '/crm-api/excel/importCompanyOpportunityOssByParam';
    console.log('1111111111111111111111111111111111111')
    console.log(data)
    this.post({
        url: url,
        data: data,
        param: {
            userId: userId,
            realName: realName,
            orgId: orgId,
            orgName: orgName,
            phone: phone
        }
    }).then(data => {
        this.send(data);
    });
},{
    headers: {'Content-Type': 'multipart/form-data'}
});

/**
 * 批量上传Excel(oss)
 */
$RequestMapping("/crm/myCollection/saveBatchAdditionOss.do", function(data) {
    let url = '/crm-api/excel/importFromOssCompanyOpportunityOssByParam';
    console.log(data)
    this.post({
        url: url,
        param: data,
    }).then(data => {
        this.send(data);
    });
});