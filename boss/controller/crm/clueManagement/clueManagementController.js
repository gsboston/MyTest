/**
 * 查询线索列表
 */
$RequestMapping('/crm/clueManagement/list.do', function (data) {
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
    if (searchCriteria.name) tempObj.name = searchCriteria.name;
    //是否精确查找
    if (searchCriteria.isAccurate) tempObj.isAccurate = searchCriteria.isAccurate;
    //服务类型
    let tempServiceType = searchCriteria.serviceType.map((item) => {
        return item.name
    });
    if (tempServiceType.length !== 0) tempObj.intentionTags = tempServiceType;
    // 行业分类
    if (searchCriteria.industryType.length !== 0) tempObj.industryTags = searchCriteria.industryType;
    // 企业状态
    if (searchCriteria.enterpriseStatus) tempObj.state = searchCriteria.enterpriseStatus;
    // 注册资本
    if (searchCriteria.registeredCapital) {
        let tempRegisteredCapital = searchCriteria.registeredCapital.split("—");
        tempObj.registeredMincapital = Number(tempRegisteredCapital[0]);
        tempObj.registeredMaxcapital = Number(tempRegisteredCapital[1]);
    }
    // 人员规模
    if (searchCriteria.personnelScale) {
        let tempPersonnelScale = searchCriteria.personnelScale.split("—");
        tempObj.staffMinSize = Number(tempPersonnelScale[0]);
        tempObj.staffMaxSize = Number(tempPersonnelScale[1]);
    }
    //民事主体
    if (searchCriteria.civilBody) tempObj.typeId = searchCriteria.civilBody;
    //地址
    if (searchCriteria.address) tempObj.address = searchCriteria.address;
    // 注册时间
    if(searchCriteria.registerTime){
        let isTempRegisterTime = true;
        let tempRegisterTime = searchCriteria.registerTime.map((item,index) => {
            if (item == '' || item == null) isTempRegisterTime = false;
            let tempDateObj =  new Date(item);
            let tempDateStr = tempDateObj.getFullYear()+"-"+(tempDateObj.getMonth()+1)+"-"+tempDateObj.getDate();
            tempDateStr += index == 0 ? ' 00:00:00' : ' 23:59:59';
            return new Date(tempDateStr).getTime();
        });
        if (isTempRegisterTime) {
            tempObj.foundingMinTime = tempRegisterTime[0];
            tempObj.foundingMaxTime = tempRegisterTime[1];
        }
    }

    let userId = this.getCurrentUser().id;

    this.post({
        url: '/crm-api/hints/search',
        data: tempObj,
        param: {
            from: data.page,
            size: data.pageSize
        }
    }).then(data => {
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
 * 查询线索列表-天眼查
 */
$RequestMapping('/crm/clueManagement/lbs.do', function (data) {
    let searchCriteria = data.searchCriteria;
    let tempObj = {};

    // 经度
    if (searchCriteria.lng) tempObj.longtitude = searchCriteria.lng;
    // 纬度
    if (searchCriteria.lat) tempObj.latitude = searchCriteria.lat;
    // 范围
    if (searchCriteria.range) tempObj.distance = searchCriteria.range;
    // 行业
    if (searchCriteria.twoIndustry){
        tempObj.industryCode = searchCriteria.twoIndustry;
    } else {
        tempObj.industryCode = searchCriteria.oneIndustry === '不限' ? '' : searchCriteria.oneIndustry;
    }
    // 注册资本
    if (searchCriteria.registeredCapital) {
        let tempRegisteredCapital = searchCriteria.registeredCapital.split("—");
        tempObj.registeredMincapital = Number(tempRegisteredCapital[0]);
        tempObj.registeredMaxcapital = Number(tempRegisteredCapital[1]);
    }
    // 注册时间
    if(searchCriteria.registerTime){
        let isTempRegisterTime = true;
        let tempRegisterTime = searchCriteria.registerTime.map((item,index) => {
            if (item == '' || item == null) isTempRegisterTime = false;
            let tempDateObj =  new Date(item);
            let tempDateStr = tempDateObj.getFullYear()+"-"+(tempDateObj.getMonth()+1)+"-"+tempDateObj.getDate();
            tempDateStr += index == 0 ? ' 00:00:00' : ' 23:59:59';
            return new Date(tempDateStr).getTime();
        });
        if (isTempRegisterTime) {
            tempObj.foundingMinTime = tempRegisterTime[0];
            tempObj.foundingMaxTime = tempRegisterTime[1];
        }
    }

    this.post({
        url: '/crm-api/hints/lbs/search',
        data: tempObj,
        param: {
            from: data.page,
            size: data.pageSize
        }
    }).then(data => {
        data.page = parseInt(data.current);
        delete data.from;

        data.records.forEach((item, index) => {
            // typeId 1 是个人，2 是公司
            item.isEnterprise = item.basic.typeId === 2;
            item.isExtend = false;
            item.isCollected = item.collection;
            item.isError = item.errorReport;
            item.basic.tsUpdate = DateFormat.dateToString(item.basic.tsUpdate);
            item.basic.maxTrackTime = DateFormat.dateToString(item.basic.maxTrackTime);

            delete item.collection;
            delete item.errorReport;

            if (item.isEnterprise) {
                item.company.foundingTime = DateFormat.dateToString(item.company.foundingTime);
                item.company.authortyDate = DateFormat.dateToString(item.company.authortyDate);
                item.company.startTime = DateFormat.dateToString(item.company.startTime);
                item.company.endTime = DateFormat.dateToString(item.company.endTime);
                item.company.registeredCapital = item.company.registeredCapital / 10000;
            } else {
                item.personal.birthday = DateFormat.dateToString(item.personal.birthday);
            }
        })

        this.send(data);
    });
});

/**
 * 查询基本信息-公司
 */
$RequestMapping('/crm/clueManagement/baseinfoCompany.do', function (id) {
    let baseinfo = {
        creditCode: '325325325325326', // 统一社会信用代码
        orgCode: 64364364, // 组织结构代码
        registerNum: 325325325325326, // 注册号
        managementStatus: '存续', // 经营状态
        industry: '电器行业', // 所属行业
        createDate: '2011年1月1日', //成立日期
        companyType: '股份有限公司', // 公司类型
        bizTerm: '2011年1月1日-2011年1月1日', // 营业期限
        corporation: '夏立博', // 法定代表人
        licenseDate: '2011年1月1日', // 发照日期
        capital: '500万人民币', // 注册资本
        registerAuthority: '上海市工商管理局', // 登记机关
        address: '上海市工商管理局上海市工商管理局上海市工商管理局',
        bizScope: '上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局', // 经商范围
    };

    this.send(baseinfo);
})

/**
 * 查询基本信息-个人
 */
$RequestMapping('/crm/clueManagement/baseinfoPersonal.do', function (id) {
    let baseinfo = {
        name: '喜羊羊',
        sex: '男',
        birthday: '2011年1月1日',
        tel: '010-8812366',
        phone: 15688812366,
        wx: 'grrrgr',
        email: 'xxx@12366.com',
        interest: '吃饭睡觉打豆豆', // 兴趣
        remark: '上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局', // 备注
    };

    this.send(baseinfo);
})

/**
 * 新增线索
 */
$RequestMapping('/crm/clueManagement/clueAdd.do', function (data) {
    this.send();
})

/**
 * 主要人员-查询
 */
$RequestMapping('/crm/clueManagement/personnelList.do', function (id, page, size) {
    this.request({
        url: '/crm-api/personalCompany/company/' + id,
        method: $Http.METHOD_GET,
        param: {
            page: page,
            size: size
        }
    }, {
        url: "/crm-api/item/getSex",
        method: $Http.METHOD_GET
    }).then((data, sexs) => {
        if(!data){
            this.send({records: []});
            return;
        }

        if(!data.records){
            this.send({records: []});
            return;
        }

        data.records.forEach(item => {
            sexs.forEach(sex => {
                if(item.sex === sex.code){
                    item.sex = sex.name;
                }
            })
        })

        this.send(data);
    });
})

/**
 * 主要人员-新增
 */
$RequestMapping('/crm/clueManagement/personnelAdd.do', function (data) {
    this.post({
        url: '/crm-api/hints/1/' + encodeURIComponent(data.form.relationship),
        data: {
            basic: {
                typeId: 1,
                channelId: 100,
                provinceCode: data.provinceCode,
                cityCode: data.cityCode,
                districtCode: data.districtCode
            },
            company: {
                id: data.companyId
            },
            personal: {
                name: data.form.name,
                sex: data.form.sex,
                mobile: data.form.mobile,
                wechat: data.form.wechat,
                telephone: data.form.telephone,
                email: data.form.email,
                logo: data.url,
                provinceCode: data.provinceCode,
                cityCode: data.cityCode,
                districtCode: data.districtCode
            }
        }
    }).then(data => {
        this.send(data);
    });
})

/**
 * 他的企业-查询
 */
$RequestMapping('/crm/clueManagement/companyList.do', function (id, page, size) {
    this.get({
        url: '/crm-api/personalCompany/personal/' + id,
        param: {
            page: page,
            size: size
        }
    }).then(data => {
        if(!data){
            this.send({records: []});
            return;
        }

        if(!data.records){
            this.send({records: []});
            return;
        }

        data.records.forEach(item => {
            item.registered_capital = item.registered_capital == 0 ? '-' : item.registered_capital / 10000;
            if (item.founding_time) {
                item.founding_time = DateFormat.dateToString(new Date(item.founding_time));
            }
        })

        this.send(data);
    });
})

/**
 * 他的企业-新增
 */
$RequestMapping('/crm/clueManagement/companyAdd.do', function (data) {
    this.post({
        url: '/crm-api/hints/2/' + encodeURIComponent(data.form.relationship),
        data: {
            basic: {
                typeId: 2,
                channelId: 100,
                provinceCode: data.provinceCode,
                cityCode: data.cityCode,
                districtCode: data.districtCode
            },
            company: {
                name: data.form.name,
                companyAddress: data.form.company_address,
                foundingTime: data.form.founding_time ? new Date(data.form.founding_time).getTime() : '',
                registeredCapital: data.form.registered_capital * 10000,
                state: data.form.state,
                legalRepresentative: data.personalName,
                companyContactsMobile: data.personalMobile,
                provinceCode: data.provinceCode,
                cityCode: data.cityCode,
                districtCode: data.districtCode
            },
            personal: {
                id: data.personalId
            }
        }
    }).then(data => {
        // this.send({
        //     name: data.company.name,
        //     company_address: data.company.name,
        //     founding_time: data.company.name,
        //     registered_capital: data.company.name,
        //     state: data.company.name,
        //     relationship: data.company.name,
        // });
        this.send(data);
    });
})

/**
 * 标签-查询
 * 线索标签：标记标签 1, 评价标签 4
 */
$RequestMapping('/crm/clueManagement/tagsList.do', function (clueId) {
    this.get({
        url: '/crm-api/hints/' + clueId + '/tags'
    }).then(data => {
        if(!data){
            this.send([]);
            return;
        }

        let userId = this.getCurrentUser().id;

        data.tags.forEach((tag) => {
            if(tag.creator === userId){
                tag.isCreateYouself = true;
            }
        })

        this.send(data.tags);
    });
})

/**
 * 标签-新增
 */
$RequestMapping('/crm/clueManagement/tagsAdd.do', function (data) {
    this.post({
        url: '/crm-api/hints/' + data.id + '/tags',
        data: {
            "tags": [
                {
                    "name": data.tagAddValue,
                    "type": 1
                }
            ]
            // tagAddValue: data.tagAddValue,
            // isAnonymous: data.isAnonymous
        }
    }).then(data => {
        if(!data){
            this.send([]);
            return;
        }

        let userId = this.getCurrentUser().id;

        data.tags.forEach((tag, index) => {
            if(tag.creator === userId){
                tag.isCreateYouself = true;
            }
        })

        this.send(data.tags);
    });
})

/**
 * 标签-删除
 */
$RequestMapping('/crm/clueManagement/tagsDel.do', function (clueId, tagId) {
    this.delete({
        url: '/crm-api/hints/' + clueId + '/tags/' + tagId
    }).then(data => {
        this.send();
    });
})

/**
 * 线索-收藏-取消收藏
 */
$RequestMapping('/crm/clueManagement/clueCollect.do', function (id) {
    this.get({
        url: '/crm-api/hintCollection/' + id + '/collection'
    }).then(data => {
        this.send();
    });
})

/**
 * 线索-全部收藏
 */
$RequestMapping('/crm/clueManagement/clueCollectAll.do', function (ids) {
    this.post({
        url: '/crm-api/hintCollection/batchCollection',
        data: {
            ids: ids
        }
    }).then(data => {
        this.send();
    });
})

/**
 * 线索-全部取消收藏
 */
$RequestMapping('/crm/clueManagement/clueCollectAllCancel.do', function (ids) {
    this.post({
        url: '/crm-api/hintCollection/batchRemove',
        data: {
            ids: ids
        }
    }).then(data => {
        this.send();
    });
})

/**
 * 线索-纠错
 */
$RequestMapping('/crm/clueManagement/clueError.do', function (data) {
    this.post({
        url: '/crm-api/hintError/' + data.id + '/reports',
        data: {
            errorCodes: data.reason.join(','),
            errorContent: data.description
        }
    }).then(data => {
        this.send(data);
    });
})

/**
 * 线索-纠错-错误原因
 */
$RequestMapping('/crm/clueManagement/clueErrorReason.do', function () {
    this.get({
        url: '/crm-api/hintError/errorType',
    }).then(data => {
        this.send(data);
    });
})

/**
 * 商机-查询
 */
$RequestMapping('/crm/clueManagement/opportunityList.do', function (id, from, page, size) {
    this.post({
        url: '/crm-api/opportunity/' + id + '/listPage',
        data: {
            from: from
        },
        param: {
            page: page,
            size: size
        }
    }).then(data => {
        if(!data.records){
            this.send([]);
            return;
        }

        data.records.forEach((item, index) => {
            item.tsInsert = DateFormat.dateToString(item.tsInsert, 'yyyy/MM/dd');
            item.isDocumentary = item.track; // 是否已跟单
            item.isCollected = item.collection; // 是否已收藏
            item.isCreateYouself = item.creator === this.getCurrentUser().id;
        })

        this.send(data);
    });
})

/**
 * 商机-新增
 */
$RequestMapping('/crm/clueManagement/opportunityAdd.do', function (data) {
    console.log(data)
    let businessCode = [];
    if(data.item.businessCode.length<=0){
        businessCode = data.item.businessSigleCode
    }else{
        businessCode = data.item.businessCode.join(',')
    }
    this.post({
        url: '/crm-api/opportunity/' + data.id + '/createBusinesses',
        data: {
            "businessCode": businessCode,
            "comments": data.item.comments,
            "type": data.item.type,
            "from": data.from,
            "orginalOrganizationId": data.item.orginalOrganizationId,
            "orginalCreator": data.item.orginalCreator,
            "fromFlag":data.item.fromFlag,
            "orginalProviderOrgName":data.item.orginalProviderOrgName,
            "orginalProviderName":data.item.orginalProviderName,
            "cooperationUserList":data.item.cooperationUserList
        }
    }).then(data => {
        this.send(data);
    });
})

/**
 * 商机-删除
 */
$RequestMapping('/crm/clueManagement/opportunityDel.do', function (clueId, oppoId) {
    this.delete({
        url: '/crm-api/opportunity/' + clueId + '/businesses/' + oppoId
    }).then(data => {
        this.send();
    });
})

/**
 * 商机-收藏
 */
$RequestMapping('/crm/clueManagement/opportunityCollection.do', function (clueId, oppoId) {
    this.get({
        url: '/crm-api/opportunityCollection/' + clueId + '/' + oppoId + '/collection',
        data: {}
    }).then(data => {
        this.send(data);
    });
})

/**
 * 商机-私有转公共
 */
$RequestMapping('/crm/clueManagement/opportunityConvert.do', function (oppoId) {
    this.get({
        url: '/crm-api/opportunity/' + oppoId + '/convert'
    }).then(data => {
        this.send(data);
    });
})

/**
 * 商机-我要跟单
 */
$RequestMapping('/crm/clueManagement/documentary.do', function (clueId, oppoId) {
    this.post({
        url: '/crm-api/opportunityTrack/' + clueId + '/' + oppoId + '/traces',
        data: {}
    }).then(data => {
        this.send(data);
    });
})

/**
 * 商机-取消跟单
 */
$RequestMapping('/crm/clueManagement/documentaryCancel.do', function (oppoId) {
    this.get({
        url: '/crm-api/opportunityTrack/' + oppoId + '/cancelTraces'
    }).then(data => {
        this.send();
    });
})

/**
 * 商机-签约完成
 */
$RequestMapping('/crm/clueManagement/oppoSignComplete.do', function (clueId, oppoId) {
    this.get({
        url: '/crm-api/opportunity/' + clueId + '/' + oppoId + '/sign'
    }).then(data => {
        this.send(data);
    });
})

/**
 * 商机-判断该商机是否关联过有效合约
 */
$RequestMapping('/crm/clueManagement/oppoSignCheck.do', function (oppoId) {
    this.get({
        url: '/sign-api/contract/opporunity/check/' + oppoId
    }).then(data => {
        this.send(data);
    });
})

/**
 * 跟单记录-查询
 * 当前跟单的商机列表、跟单记录报表、跟单记录列表
 */
$RequestMapping('/crm/clueManagement/documentaryList.do', function (data) {
    let clueId = data.clueId,
        oppoId = data.oppoId,
        clue = data.clue,
        page = data.page,
        size = data.size;

    this.get({
        url: '/crm-api/opportunityTrack/' + clueId + '/getTracks'
    }).then((data) => {
        this.request({
            url: '/crm-api/opportunityTrack/' + oppoId + '/trackBase',
            method: $Http.METHOD_GET
        }, {
            url: '/crm-api/opportunityTrackDetail/'  + clueId + '/' + oppoId + '/trackDetail',
            method: $Http.METHOD_GET,
            param: {
                page: page,
                size: size
            }
        }).then((base, detail) => {
            let clueName = clue.isEnterprise ? clue.company.name : clue.personal.name;

            detail && detail.records.forEach(item => {
                item.visitTime = DateFormat.dateToString(item.visitTime);
                item.nextVisitTime = DateFormat.dateToString(item.nextVisitTime);
            })

            let documentary = {
                clueName: clueName,
                documentaryList: data,
                base: {
                    oppoId: oppoId,
                    recordNum: base.historyNum,
                    visit: base.finishNum,
                    humanNum: base.historyUsers.length,
                    human: base.historyUsers[0],
                    days: base.trackDay,
                    daysTransformed: base.opportunityDay,
                    level: base.intentionalityName
                },
                detail: [{
                    oppoId: oppoId,
                    data: detail
                }],
            };
            this.send(documentary);
        })
    });
})

/**
 * 跟单记录-查询
 * 跟单记录报表、跟单记录列表
 */
$RequestMapping('/crm/clueManagement/documentaryListTab.do', function (clueId, oppoId) {
    this.request({
        url: '/crm-api/opportunityTrack/' + oppoId + '/trackBase',
        method: $Http.METHOD_GET
    }, {
        url: '/crm-api/opportunityTrackDetail/'  + clueId + '/' + oppoId + '/trackDetail',
        method: $Http.METHOD_GET
    }).then((base, detail) => {
        let documentary = {
            base: {
                oppoId: oppoId,
                recordNum: base.historyNum,
                visit: base.finishNum,
                humanNum: base.historyUsers.length,
                human: base.historyUsers[0],
                days: base.trackDay,
                daysTransformed: base.opportunityDay,
                level: base.intentionalityName
            },
            detail: [{
                oppoId: oppoId,
                data: detail || []
            }],
        };
        // console.log(documentary);
        this.send(documentary);
    })
})

/**
 * 跟单记录-查询-历史跟进记录列表
 */
$RequestMapping('/crm/clueManagement/documentaryHistory.do', function (data) {
    let clueId = data.clueId,
        oppoId = data.oppoId,
        clue = data.clue,
        page = data.page,
        size = data.size;

    this.request({
        url: '/crm-api/opportunityTrack/' + oppoId + '/trackBase',
        method: $Http.METHOD_GET
    }, {
        url: '/crm-api/opportunityTrackDetail/'  + clueId + '/' + oppoId + '/historyPage',
        method: $Http.METHOD_GET,
        param: {
            page: page,
            size: size
        }
    }).then((base, detail) => {
        detail.records && detail.records.forEach(item => {
            item.visitTime = DateFormat.dateToString(item.visitTime);
            item.nextVisitTime = DateFormat.dateToString(item.nextVisitTime);
        })

        let documentary = {
            base: {
                oppoId: oppoId,
                recordNum: base.historyNum,
                visit: base.finishNum,
                humanNum: base.historyUsers.length,
                human: base.historyUsers[0],
                days: base.trackDay,
                daysTransformed: base.opportunityDay,
                level: base.intentionalityName
            },
            detail: [{
                oppoId: oppoId,
                // data: detail.records || []
                data: detail
            }],
        };
        this.send(documentary);
    })
})

/**
 * 跟单记录-新增
 */
$RequestMapping('/crm/clueManagement/documentaryAdd.do', function (data) {
    this.post({
        url: '/crm-api/opportunityTrackDetail/' + data.clueId + '/' + data.oppoId + '/create',
        data: {
            target: data.item.purpose,
            intentionality: data.item.intent,
            visitTime: data.item.executeDate,
            nextVisitTime: data.item.nextDate,
            result: data.item.result,
            attachment: {
                storeKey: data.url,
                fileType: data.type
            }
        }
    }).then(data => {
        data.visitTime = DateFormat.dateToString(data.visitTime);
        data.nextVisitTime = DateFormat.dateToString(data.nextVisitTime);

        this.send(data);
    });
})

/**
 * 档案-沟通目的
 */
$RequestMapping('/crm/clueManagement/purpose.do', function () {
    this.get({
        url: '/crm-api/item/getTrackTarget'
    }).then(data => {
        let purpose = {
            id: data.id,
            name: data.name
        }

        this.send(data || []);
    });
})

/**
 * 档案-意向度
 */
$RequestMapping('/crm/clueManagement/intent.do', function () {
    this.get({
        url: '/crm-api/item/getIntention'
    }).then(data => {
        if(!data){
            this.send([]);
            return;
        }

        data.forEach(item => {
            item.code = item.code.toString();
        })

        this.send(data);
    });
})

/**
 * 档案-性别
 */
$RequestMapping('/crm/clueManagement/sex.do', function () {
    this.get({
        url: '/crm-api/item/getSex'
    }).then(data => {
        // if(!data){
        //     this.send([]);
        //     return;
        // }
        //
        // data.forEach(item => {
        //     item.code = item.code.toString();
        // })

        this.send(data);
    });
})

/**
 * 档案-通过编码获取档案数据-添加服务列表
 * 只查询返回自己能创建的服务
 */
$RequestMapping('/crm/clueManagement/serviceList.do', function (clueId) {
    this.request({
        url: '/crm-api/item/bd_service/getItem',
        method: $Http.METHOD_GET
    }, {
        url: '/crm-api/opportunity/' + clueId + '/existsCode',
        method: $Http.METHOD_GET
    }).then((services, existsCode) => {
        services = services || [];
        existsCode = existsCode || [];

        let arr = [];

        services.forEach((service, index) => {
            let flag = true;
            existsCode.forEach(code => {
                if(service.code === code){
                    flag = false;
                    // services.splice(index, 1);
                }
            })
            if(flag){
                arr.push(service);
            }
        })

        this.send(arr);
    });
})

/**
 * 根据组织ID查询本组织和所有上级组织 - 用于通过组织名称查询时使用
 */
$RequestMapping("/crm/clueManagement/dispatch/orgsByOrgId.do", function (orgId) {
    this.get({
        url: '/ttslb-api/org/getCrmCompanysByOrgId',
        param: {
            'orgId': orgId,
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织ID查询分公司, 子公司树列表
 */
$RequestMapping("/crm/clueManagement/dispatch/orgsByArea.do", function (orgId) {
    this.get({
        url: '/ttslb-api/org/getCrmCompanysByAreaId',
        param: {
            'orgId': orgId,
        },
    }).then(data => {

        for(var i in data){
            data[i].selected = true;
        }
        this.send(data);
    });
});

/**
 * 根据组织ID查询本组织信息和派单量
 */
$RequestMapping("/crm/clueManagement/dispatch/currentOrgsByOrgId.do", function (orgId) {
    this.post({
        url: '/ttslb-api/org/getCrmOrgByOrgIds',
        data: [orgId]
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织名称模糊搜索组织列表
 */
$RequestMapping("/crm/clueManagement/dispatch/orgsByName.do", function (orgName) {
    this.get({
        url: '/ttslb-api/org/getCrmOrgsByName',
        param: {
            'orgName': orgName,
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织查询组织下的人员列表
 */
$RequestMapping("/crm/clueManagement/dispatch/personsByOrg.do", function (orgId) {
    this.post({
        url: '/ttslb-api/hints/salesList/searchAll',
        param: {
            'orgId': orgId,
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 内部派单 - 将商机派单
 */
$RequestMapping("/crm/clueManagement/dispatch/dispatchOppo.do", function(data) {
    this.post({
        url: '/crm-api/opportunity/dispatcher',
        data: {
            hxId: data.clueId,
            bid: data.oppoId,
            orgId: data.orgId,
            userIds: [data.userId]
        }
    }).then(data => {
        this.send(data)
    })
});

/**
 * 添加商机协作人
 */
$RequestMapping("/crm/clueManagement/cooperation/addcooperation.do", function(data) {
    this.post({
        url: '/crm-api/opportunity/'+data.oppoId+'/addCooperation',
        data:{
            saveList:data.saveList,
            delOrgIdList:data.delOrgIdList
        }
    }).then(data => {
        this.send(data)
    })
});


/**
 * 获取协作人列表
 */
$RequestMapping("/crm/clueManagement/cooperation/getCooperation.do", function(oppoId) {
    this.get({
        url: '/crm-api/opportunity/'+ oppoId +'/cooperationList',
    }).then(data => {
        this.send(data)
    })
});

/**
 * 派单历史记录组织信息
 */
$RequestMapping("/crm/clueManagement/dispatch/orgHistory.do", function() {
    this.post({
        url: '/crm-api/hint/hintDispatchLog/findHintDispatchLogSumList'
    }).then(data => {
        this.send(data)
    })
});


/**
 * 获取商机来源
 */
$RequestMapping("/crm/clueManagement/getOpportuityFrom.do", function () {
    let code = 'crm_busi_source_type';
    this.get({
        url: '/crm-api/item/'+ code +'/getItem',
    }).then(data => {
        if (!data) {
            data = [];
        }
        let obj = data.filter(item => {
            if (item.code !== '400' && item.code !== '600') {
                return item;
            }
        });

        this.send(obj);
    });
   /* let obj = {
        "code": "200",
        "data": [
            {
                "categoryId": "1009345191151806465",
                "code": "100",
                "creator": "945593626094280705",
                "describe": "",
                "dr": 0,
                "id": "1009348291178670081",
                "modifier": null,
                "name": "个人",
                "parentId": null,
                "tsInsert": 1529482360000,
                "tsUpdate": 1529482360000
            },
            {
                "categoryId": "1009345191151806465",
                "code": "200",
                "creator": "945593626094280705",
                "describe": "",
                "dr": 0,
                "id": "1009348347835328513",
                "modifier": null,
                "name": "合伙人",
                "parentId": null,
                "tsInsert": 1529482374000,
                "tsUpdate": 1529482374000
            },
            {
                "categoryId": "1009345191151806465",
                "code": "300",
                "creator": "945593626094280705",
                "describe": "",
                "dr": 0,
                "id": "1009348529788430337",
                "modifier": null,
                "name": "总部渠道",
                "parentId": null,
                "tsInsert": 1529482417000,
                "tsUpdate": 1529482417000
            },
            {
                "categoryId": "1009345191151806465",
                "code": "400",
                "creator": "945593626094280705",
                "describe": "",
                "dr": 0,
                "id": "1009348608419047426",
                "modifier": null,
                "name": "商机派单",
                "parentId": null,
                "tsInsert": 1529482436000,
                "tsUpdate": 1529482436000
            },
            {
                "categoryId": "1009345191151806465",
                "code": "500",
                "creator": "945593626094280705",
                "describe": "",
                "dr": 0,
                "id": "1009348672730310658",
                "modifier": null,
                "name": "其他",
                "parentId": null,
                "tsInsert": 1529482451000,
                "tsUpdate": 1529482451000
            },
            {
                "categoryId": "1009345191151806465",
                "code": "600",
                "creator": "945593626094280705",
                "describe": "",
                "dr": 0,
                "id": "1009348723024209921",
                "modifier": null,
                "name": "内部转派",
                "parentId": null,
                "tsInsert": 1529482463000,
                "tsUpdate": 1529482463000
            }
        ],
        "errorStack": "",
        "message": ""
    }
    this.send(obj.data);
*/
});



/**
 * 获取 GATEWAY_HOST
 */
$RequestMapping("/crm/clueManagement/gatewayHost.do", function() {
    this.send(process.config.GATEWAY_HOST);
});