/**
 * 查询会员卡列表
 */
$RequestMapping("/hykgl/getHykglList.do", function (curPage, pageSize) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCard/queryPage',
        param: {
            pageNo: curPage,
            pageSize: pageSize
        }
    }).then(res => {
        this.send(res);
    });
});

/**
 * 数据字典--根根据类型查询列表
 */
$RequestMapping("/tcgl/getKeyBook.do", function (type) {
    this.get({
        url: '/ztjf-api/ztjf/free/keybook/ztjfKeybook/findListByType',
        param: {
            type: type
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 新建卡保存
 */
$RequestMapping("/hykgl/save.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCard/add',
        data: data
    }).then(res => {
        this.send(res);
    });
});

/**
 * 会员卡生成卡号
 */
$RequestMapping("/hykgl/generate.do", function (data) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/generate',
        param: {
            userId: data.userId,
            cardId: data.cardId,
            total: data.total
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡制卡
 */
$RequestMapping("/hykgl/print.do", function (userId, cardId, total) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/print',
        param: {
            userId: userId,
            cardId: cardId,
            total: total
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡入库
 */
$RequestMapping("/hykgl/putIn.do", function (data) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/putIn',
        param: {
            userId: data.userId,
            cardId: data.cardId,
            minNo: data.minNo,
            maxNo: data.maxNo
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡派卡校验
 */
$RequestMapping("/hykgl/distributesSave.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardDistribute/distributeCheck',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡派卡
 */
$RequestMapping("/hykgl/distributesSave.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardDistribute/distributesSave',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡派卡校验
 */
$RequestMapping("/hykgl/distributeCheck.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardDistribute/distributeCheck',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡启用/停用
 */
$RequestMapping("/hykgl/activate.do", function (cardId, userId) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCard/activate',
        param: {
            cardId: cardId,
            userId: userId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账套套餐操作记录列表
 */
$RequestMapping("/hykgl/getHykglRecordList.do", function (cardId, curPage, pageSize) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardLog/queryPage',
        param: {
            cardId: cardId,
            pageNo: curPage,
            pageSize: pageSize
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡制卡
 */
$RequestMapping("/hykgl/getPrint.do", function (userId, cardId, total) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/print',
        param: {
            userId: userId,
            cardId: cardId,
            total: total
        }
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/hykgl/getHost.do", function () {
    let config = process.config;
    let gatewayHost = config.GATEWAY_HOST;
    this.send(gatewayHost);
});

/**
 * 会员卡查询
 */
$RequestMapping("/hykgl/searchCardsPage.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/searchCardsPage',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡查询统计
 */
$RequestMapping("/hykgl/staticCardRecords.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/staticCardRecords',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡取消制卡
 */
$RequestMapping("/hykgl/cancelPrint.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/cancelPrint',
        data: data.item
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡删除卡号
 */
$RequestMapping("/hykgl/delCardRecords.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/delCardRecords',
        data: data.item
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡派卡收款
 */
$RequestMapping("/hykgl/gathering.do", function (gatherId, data) {
    this.post({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/gathering',
        param: {
            gatherId: gatherId
        },
        data: data.item
    }).then(data => {
        this.send(data);
    });
});

/**
 * 会员卡详情
 */
$RequestMapping("/hykgl/getInfo.do", function (id) {
    this.get({
        url: '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/info/' + id
    }).then(data => {
        this.send(data);
    });
});
