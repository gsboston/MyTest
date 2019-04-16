/**
 * 获取区域列表
 */
$RequestMapping("/systemManage/zoneMgr/getAreaList.do", function() {
    this.get({
        url:'/portal-api/basedocs/areaWarZones'
    }).then(data => {
        this.send(data);
    });
});
/**
 * 获取战区的区域列表
 */
$RequestMapping("/systemManage/zoneMgr/getZoneAreaList.do", function(id) {
    this.get({
        url:'/portal-api/basedocs/warZoneAreas?warZoneId='+id
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取战区列表
 */
$RequestMapping("/systemManage/zoneMgr/getZoneList.do", function(code) {
    this.get({
        url:'/portal-api/basedocs/items/bd_war_zone'
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存战区区域关系
 */
$RequestMapping("/systemManage/zoneMgr/changeZoneAreaList.do", function(data) {
    this.post({
        url:'/portal-api/basedocs/saveAreaItemList',
        param:{
            warZoneId:data.zoneId,
            ids:data.areaList
        }
    }).then(data => {
        this.send();
    });
});

/**
 * 保存战区
 */
$RequestMapping("/systemManage/zoneMgr/saveZone.do", function(data) {
    this.post({
        url:'/portal-api/basedocs/warzone/save',
        data:data
    }).then(data => {
        this.send();
    });
});

/**
 * 删除战区
 */
$RequestMapping("/systemManage/zoneMgr/removeZone.do", function(id) {
    this.delete({
        url:'/portal-api/basedocs/warzone/remove?id='+id
    }).then(data => {
        this.send();
    });
});

