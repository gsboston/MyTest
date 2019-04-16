/**
 * 账户状态查询
 */
$RequestMapping("/zhzt/page.do", function (data) {
    this.post({
        url: '/ztjf-api/ztjf/free/orgPlus/page',
        param: {
            page: data.page,
            size: data.size
        },
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 账户状态操作日志
 */
$RequestMapping("/zhzt/orgOperPage.do", function (orgId, curPage, pageSize) {
    this.post({
        url: '/ztjf-api/ztjf/free/orgOper/page',
        param: {
            orgId: orgId,
            page: curPage,
            size: pageSize
        }
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping('/getHttpOtherPlatform.do', function (data) {
    let url = '/ztjf-api/ztjf/free/other/httpOtherPlatform?url=' + encodeURI(data.url);
    this.post({
        url: url,
        data: data
    }).then(data => {
        this.send(data);
    })
});

/**
 * 修改账套数量及到期时间
 */
$RequestMapping("/zhzt/modifier.do", function (data) {
    let params = {
        userId: data.userId,
        id: data.id,
        totalNum: data.totalNum,
        packageType: data.packageType
    };
    if (!data.packageType) {
        delete params.packageType;
    }
    this.post({
        url: '/ztjf-api/ztjf/free/orgPlus/modifier',
        param: params,
        data: data
    }).then(data => {
        this.send(data);
    });
});
