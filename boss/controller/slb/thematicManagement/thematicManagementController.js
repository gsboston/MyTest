/**
 * Created by zhengwc on 2018/03/12.
 */

/**
 * 获取专题列表
 */
$RequestMapping("/thematicManagement/getThematicList.do", function (curPage, pageSize) {
    this.get({
        url: '/slb-api/special/list',
        param: {
            page: curPage,
            size: pageSize
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 专题上线
 */
$RequestMapping("/thematicManagement/online.do", function (id) {
    this.get({
        url: '/slb-api/special/online',
        param: {
            id: id
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 专题下线
 */
$RequestMapping("/thematicManagement/offset.do", function (id) {
    this.get({
        url: '/slb-api/special/offset',
        param: {
            id: id
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 专题保存
 */
$RequestMapping("/thematicManagement/save.do", function (data) {
    this.post({
        url: '/slb-api/special/save',
        data: data
    }).then(data => {
        this.send(data);
    });
});

