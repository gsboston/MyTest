/**
 * 获取区域列表
 */
$RequestMapping("/systemManage/administrativeMgr/getAreaList.do", function() {
    this.get({
        url:'/portal-api/basedocs/areasTree',
    }).then(data => {
        let tree = [];
        let parentItem = new Object();
        parentItem.title = "全国:100000";
        parentItem.code = "100000";
        parentItem.id = "100000";
        parentItem.selected = true;
        parentItem.expand = true;
        parentItem.loading = false;
        parentItem.children = [];
        for (var index_i=0; index_i<data.length; index_i++) {
            //data[index_i].title = data[index_i].title + ':' + data[index_i].id;
            var item = new Object();
            item.name = data[index_i].title;
            item.code = data[index_i].code;
            item.title = data[index_i].title + ':' + data[index_i].code;
            item.id = data[index_i].id;
            item.children = data[index_i].children;
            item.loading = false;
            parentItem.children.push(item);
        }
        tree.push(parentItem);
        this.send(tree);
    });
});

/**
 * 获取区域列表
 */
$RequestMapping("/systemManage/administrativeMgr/getAreaChildrenList.do", function(code) {
    this.get({
        url:'/portal-api/basedocs/areasTree',
        param: {
            code: code,
        }
    }).then(data => {
        let tree = [];
        for (var index_i=0; index_i<data.length; index_i++) {
            var item = new Object();
            item.name = data[index_i].title;
            item.code = data[index_i].code;
            item.title = data[index_i].title + ':' + data[index_i].code;
            item.id = data[index_i].id;
            if (item.code.substring(4) == '00') {
                item.children = data[index_i].children;
                item.loading = false;
            }
            tree.push(item);
        }
        this.send(tree);
    });
});

/**
 * 保存区域列表removeItem
 */
$RequestMapping("/systemManage/administrativeMgr/saveArea.do", function(data) {
    this.post({
        url:'/portal-api/basedocs/area/save',
        data: data
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存区域列表
 */
$RequestMapping("/systemManage/administrativeMgr/deleteArea.do", function(id) {
    this.delete({
        url:'/portal-api/basedocs/removeItem/' + id,
    }).then(data => {
        this.send(data);
    });
});


