/**
 * Created by zhengwc on 2018/03/12.
 */

/**
 * 获取服务标识或客服管理列表
 */
$RequestMapping("/serviceIcon/getServiceIconList.do", function () {
    this.get({
        url: '/slb-api/slbItemInfo/bd_service_group/getSlbServiceGroup'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务标识或客服管理更新
 */
$RequestMapping("/serviceIcon/updateInfo.do", function (data) {
    this.put({
        url: '/slb-api/slbItemInfo/updateInfo',
        data: data
    }).then(data => {
        this.send(data);
    });
});

