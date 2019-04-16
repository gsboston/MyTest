/**
 * 获取顶部菜单栏各环节统计数
 */
$RequestMapping("/signCloud/navigationView/getCount.do", function() {
    this.get({
        url:'/sign-api/contract/get/count'
    }).then(data => {
        this.send(data);
    });
});