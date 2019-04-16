/**
 * Created by xhr on 2018/1/15.
 */

/**
 * 获取当前组织下的门店列表
 */
$RequestMapping("/systemManage/organization/storeGrounding/stores.do", function(searchType,searchName, curPage,pageSize) {
    this.get({
        url: "/ttslb-api/org/getDeptsPage",
        param: {
            page: curPage,
            size: pageSize,
            name: searchName,
            type: searchType
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取当前组织下的门店列表
 */
$RequestMapping("/systemManage/organization/storeGrounding/storesNew.do", function(orgId) {
    this.get({
        url: "/ttslb-api/org/getCompanysByAreaId",
        param: {
          "orgId": orgId,
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取模糊搜索组织列表
 */
$RequestMapping("/systemManage/organization/storeGrounding/searchStores.do", function(orgName) {
    this.get({
        url: "/ttslb-api/org/getOrgsByName",
        param: {
          "orgName": orgName,
        },
    }).then(data => {
        this.send(data);
    });
});

/**
 * 按组织ID获取当前组织本级以及以上节点树形结构
 */
$RequestMapping("/systemManage/organization/storeGrounding/getOrgTree.do", function(orgId) {
    this.get({
        url: "/ttslb-api/org/getCompanysByOrgId",
        param: {
          "orgId": orgId,
        },
    }).then(data => {
        this.send(data);
    });
});



/**
 * 获取当前组织下的门店信息
 */
$RequestMapping("/systemManage/organization/storeGrounding/storeById.do", function(id) {
    this.get({
        url: "/ttslb-api/client/store/detailByOrgId/" + id,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 门店保存
 */
$RequestMapping("/systemManage/organization/storeGrounding/saveStore.do", function(data) {
    this.post({
        url: "/ttslb-api/client/store/shelvesMaintain",
        data: data,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 门店下架
 */
$RequestMapping("/systemManage/organization/storeGrounding/unGrounding.do", function(id) {
    this.put({
        url: "/ttslb-api/client/store/underTheShelf/"+id,
        param: {
            status: 1,
        },
    }).then(data => {
        this.send(data);
    });
});

