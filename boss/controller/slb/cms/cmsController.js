/**
 * 获取文章和百城千店
 */
$RequestMapping("/cms/getCmsUrl.do", function (type) {
    this.get({
        url: '/slb-api/url/getUrl',
        param: {
            type: type
        }
    }).then(data => {
        this.send(data);
    });
});