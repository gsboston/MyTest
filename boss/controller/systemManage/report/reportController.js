/**
 * 根据组织ID查询组织信息(子公司/家、分公司/家、门店/家)
 * @orgId 组织ID
 */
$RequestMapping("/systemManage/report/orgTreeCount/info.do", function(orgId) {
    this.get({
        url: "/portal-api/org/getOrgTreeCountById/" + orgId,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 根据组织ID，组织类型查询组织信息(子公司、分公司、门店)列表分页
 * @orgId     组织ID
 * @page      当前页数
 * @size      每页数量
 * @orgLevel  组织等级 【 下级组织：SUBORDINATE 三级组织: THREELEVEL 】
 * @orgType   组织类型 【 分公司:03 子公司:04 门店:07 】
 * @searchKey 公司/门店名称、公司/门店简称、加盟类型、公司负责人、授权牌编码
 */
$RequestMapping("/systemManage/report/orgTreeCount/list.do", function(orgId, page, size, orgLevel, orgType, searchKey) {
    this.get({
        url: "/portal-api/org/getOrgTreePageById/" + orgId,
        param: {
            page: page,
            size: size,
            orgLevel: orgLevel,
            orgType: orgType,
            searchKey: searchKey,
        }
    }).then(data => {
        this.send(data);
    });
});