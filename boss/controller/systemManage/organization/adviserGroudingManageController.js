/**
 * Created by xhr on 2018/1/15.
 */
/**
 * 获取当前组织下的顾问列表
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/consultants.do", function(searchType,searchName, curPage,pageSize) {
    this.post({
        url: "/ttslb-api/client/consultant/getConsulatansPage",
        param: {
            page: curPage,
            size: pageSize,
        },
        data: {
            type: searchType,
            name: searchName,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 新增顾问时获取门店列表
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/stores.do", function() {
    this.get({
        url: "/ttslb-api/client/store/getDeptList",
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据门店ID和用户ID查看顾问详情
 */
$RequestMapping("/systemManage/adviser/adviserDetail.do", function(data) {
    this.get({
        url: "/ttslb-api/client/consultant/getDetailByIds/"+data.storeId,
        param: {
            userId: data.userId,
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据门店ID和用户ID查看顾问详情
 */
$RequestMapping("/systemManage/adviser/editAdviser.do", function(data) {
    this.post({
        url: "/ttslb-api/client/consultant/editconsultant",
        data: data
    }).then(data => {
        this.send(data);
    });
});


/**
 * 新增顾问选择门店时获取门店非顾问人员列表
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/isNotAdviser.do", function(id) {
    this.get({
        url: "/ttslb-api/client/store/getUserList/"+id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 新增顾问选择门店时获取门店人员列表
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/getUser.do", function(id) {
    this.get({
        url: "/ttslb-api/client/store/getUserListNew/"+id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 创建顾问
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/saveAdviser.do", function(data) {
    this.post({
        url: "/ttslb-api/client/consultant/addconsultant",
        data: data
    }).then(data => {
        this.send(data);
    });
});


/**
 * 获取当前组织下的服务数组
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/services.do", function() {
    this.get({
        url: "/ttslb-api/client/item/bd_service/getItem",
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取顾问详情
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/adviserDetail.do", function(id) {
    this.get({
        url: "/ttslb-api/client/consultant/detail/"+id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 下架顾问
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/unGrounding.do", function(id) {
    this.put({
        url: "/ttslb-api/client/consultant/changestatus/"+id,
        param: {
            status: 1,
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 更新顾问信息
 */
$RequestMapping("/systemManage/adviser/adviserGrounding/update.do", function(data) {
    this.put({
        url: "/ttslb-api/client/consultant/update/"+data.id,
        data: data
    }).then(data => {
        this.send(data);
    });
});