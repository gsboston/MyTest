/*查询投诉建议列表*/
$RequestMapping('/operate/proposalController/search.do', function(params, page, size) {
    let url = '/ttslb-api/client/complaint/search';
    this.post({
        url: url,
        data: params,
        param:{
            page: page,
            size: size
        }
    }).then(data => {
        this.send(data)
    })
})

/*获取单个投诉建议*/
$RequestMapping('/operate/proposalController/detail.do', function(id){
    let url='/ttslb-api/client/complaint/detail/'+id;
    this.get({
        url: url,
        param: {}
    }).then(data=>{
        this.send(data);
    })
})

/*回复投诉建议*/
$RequestMapping('/operate/proposalController/reply.do', function(params) {
    let url = '/ttslb-api/client/complaint/reply';
    this.post({
        url: url,
        data: params
    }).then(data => {
        this.send(data)
    })
})