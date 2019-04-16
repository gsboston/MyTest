const qrCode = require("qr-image");

/**
 * 合约详情-合约信息
 */
$RequestMapping('/signCloud/contractDetails/info.do', function (id) {
    this.get({
        url: '/sign-api/contract/get/' + id
    }).then(data => {
        data.thumbnail = 'https://pro.modao.cc/uploads3/images/1212/12123199/raw_1503565846.png';
        data.contractNum = data.code;
        data.subject = data.subjectName;
        data.money = data.price;
        data.statusName = data.statusName;
        this.send(data);
    });
});

/**
 * 获取合同主体信息
 */
$RequestMapping('/signCloud/contractDetails/getSubjects.do', function (id) {
    this.get({
        url: '/sign-api/contract/' + id + '/subjects'
    }).then(data => {
        let returnData = new Array();
        data.forEach(function (item) {
            returnData.push({
                id: item.id,
                name: item.name,
                legalName: item.contactName,
                legalPhone: item.contactPhone,
                signedDate: item.signedDate,
                subjectAlias: item.subjectAlias,
                isSigned: item.isSigned
            });
        });
        this.send(returnData);
    });
});

/**
 * 确定签约
 */
$RequestMapping('/signCloud/contractDetails/sign.do', function (data) {
    this.put({
        url: '/sign-api/contract/signed/' + data.id,
        data: {
            signedType: data.signedType,
            list: data.list,
            attList: data.attList
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 预览合约
 */
$RequestMapping('/signCloud/contractDetails/preview.do', function (id) {
    let url = 'http://oss-boss-avatar-upload.oss-cn-beijing.aliyuncs.com/mybatis-plus.pdf?OSSAccessKeyId=LTAIVyLEIisjhafE&Expires=1509042349&Signature=ZA%2FeiXcVfGZHyp%2FWPbJmLJyCc98%3D';
    this.send(url);
});

/**
 * 发起签约：公司
 * 上传合同，用于签约
 */
$RequestMapping('/signCloud/contractDetails/launchCompany.do', function (contractId) {
    this.get({
        url: '/sign-api/contract/upload/sign',
        param: {
            contractId: contractId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 生成合约签字二维码
 */
$RequestMapping('/signCloud/contractDetails/getQrCode.do', function(id, aliasType) {
    let _host = this.__request.headers.referer;
    let $self = this;
    if (this.__request.host == 'localhost') {
        var os = require('os');
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            var alias = 0;
            ifaces[dev].forEach(function(details){
                if (details.family == 'IPv4') {
                    if (dev == 'en0') {
                        _host = 'http://' + details.address + ':' + $self.__request.headers.host.split(':')[1] + '/';
                    }
                    ++alias;
                }
            });
        }
    }
    let image = qrCode.image(_host + 'static/wechat/signature.html?id=' + id + '&aliasType=' + aliasType);
    image.pipe(this.response.contentType("image/png"));
});

/**
 * 保存个人签字图片
 */
$RequestMapping('/signCloud/contractDetails/saveSignature.do', function(id, aliasType, img) {
    let newImg = img.replace(/\s/g, '+');
    this.post({
        url: '/sign-api/contract/sign/online',
        data: {
            contractId: id,
            alias: aliasType,
            image: newImg
        }
    }).then(data => {
        this.send(data);
    });
}, {
    isAuth: false
});

/**
* 合同电子签约回调
*/
$RequestMapping("/signCloud/contract/signReturn.do", function(data) {
    console.log("**************合同电子签约回调成功，接收数据：" + JSON.stringify(data));
    this.post({
        url: "/sign-api/contract/sign/call",
        data: data
    }).then(data => {
        this.response.send(data);
    });
}, {
    isAuth: false
});

/**
 * 合约取消审核
 */
$RequestMapping("/signCloud/contractView/cancelAgreement.do", function(id,cancelReason) {
    this.post({
        url:'/sign-api/contract/cancel/approve/',
        param:{id:id,reason:cancelReason}
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 获取合同主体、未收款计及签约信息信息
 */
$RequestMapping("/signCloud/contractSubjectChange/subjectsAndSignedInfo.do", function(id) {
    this.get({
        url:'/sign-api/contract/' + id + '/subjectsAndSignedInfo/'
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 保存变更协议主体信息
 */
$RequestMapping("/signCloud/contractSubjectChange/save.do", function(data) {
    data.alertType = data.alertType ? data.alertType : 'SUBJECT';
    this.post({
        url:'/sign-api/agreement/subject',
        data: data
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 查询变更协议
 */
$RequestMapping("/signCloud/contractSubjectChange/agreementInfo.do", function(id) {
    this.get({
        url:'/sign-api/agreement/' + id
    }).then((data) => {
        this.send(data);
    });
});
/**
 * 根据Id获取合约变更列表
 */
$RequestMapping("/signCloud/contractDetails/getContractChangeById.do", function(id,changeType) {
    let url = "";
    if(changeType == "NRBG"){//内容变更
        url = "/sign-api/agreement/agreementContent"
    }else{//主体变更
        url = "/sign-api/agreement/agreementSubject"
    }
    this.get({
        url:url,
        param:{
            contractId: id
        }
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});
/**
 * 合约变更签署
 */
$RequestMapping("/signCloud/contractDetails/changeContractSign.do", function(id) {
    this.put({
        url: "/sign-api/agreement/"+id+"/signed"
    }).then(data => {
        this.send();
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});
/**
 * 根据变更合约id获取变更协议内容
 */
$RequestMapping("/signCloud/contractDetails/getChangeInfoById.do", function(id) {
    this.get({
        url: "/sign-api/agreement/"+id
    }).then(data => {
        this.send(data);
    }, error => {
        console.log('--------------error');
        this.send(error);
    });
});
