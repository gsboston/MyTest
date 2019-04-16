/**
 * Created by xhr on 2018/3/27.
 */
const fs = require("fs");
/**
 * 获取日常服务单模板
 */
$RequestMapping("/serviceCloud/getServiceDailyTemplate.do", function(serviceDefId) {
    let env = process.env.NODE_ENV;
    // env.toLowerCase() == "development"
    if(env.toLowerCase() == "development") {
        this.get({
            url:'/serve-api/billdef/get',
            param:{
                enable: true,
            }
        }).then(data => {
            for(var i=0;i<data.length;i++){
                if(data[i].id == serviceDefId){
                    fs.readFile('controller/serviceCloud/serviceHead/serviceDailyDispatchBuilder/tpl/'+data[i].code+'.html', {flag: 'r+', encoding: 'utf8'}, (err, data) =>{
                        if(err) {
                            console.error(err);
                            return;
                        }
                        this.send(data);
                        return;
                    });
                }
            }
        });
    }else {
        this.get({
            url:'/serve-api/billdef/get',
            param:{
                enable: true,
            }
        }).then(data => {
            for(var i=0;i<data.length;i++){
                if(data[i].id == serviceDefId){
                    this.get({
                        url:'/serve-api/billdef/getInnputTemplateId',
                        param: {
                            attachmentId: data[i].inputTemplateId,
                        }
                    }).then(data => {
                        this.send(data);
                    });
                }
            }
        });
    }
});

/**
 * 获取日常服务单定义列表
 */
$RequestMapping("/serviceCloud/getDailyDefList.do", function() {
    this.get({
        url:'/serve-api/serviceLeader/daily/def/list',
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取组织下的服务岗位列表
 */
$RequestMapping("/serviceCloud/getOrgServePostList.do", function(billDefId) {
    this.get({
        url:'/serve-api/post/orgServePostList',
        param: {
            billDefId: billDefId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 获取岗位下的用户以及工作量统计列表
 */
$RequestMapping("/serviceCloud/getPostUserWorkloadList.do", function(secPostId) {
    this.get({
        url:'/serve-api/post/postUserWorkloadList',
        param: {
            secPostId: secPostId
        }
    }).then(data => {
        this.send(data);
    });
});

/**
 * 保存日常服务单
 */
$RequestMapping("/serviceCloud/saveDailyOrder.do", function(data) {
    this.post({
        url:'/serve-api/serviceLeader/daily/save',
        data: data,
    }).then(data => {
        this.send(data);
    });
});

/**
 * 服务负责人   日常服务单列表
 */
$RequestMapping("/serviceCloud/serviceHead/getDailyServiceList.do", function(state,searchText,billDefId,page,serveUserId) {
    this.get({
        url:"/serve-api/serviceLeader/page",
        param: {
            billType: "DAILY_SHEET",
            state: state,
            searchText: searchText,
            billDefId: billDefId,
            page: page,
            serveUserId: serveUserId,
        }
    }).then((data) => {
        this.send(data);
    });
});

/**
 * 获取日常服务单岗位下人员工作饱和度列表
 */
$RequestMapping("/serviceCloud/serviceHead/postUserWorkTimeList.do", function(secPostId,startTime,endTime) {
    this.get({
        url:"/serve-api/post/postUserWorkTimeList",
        param: {
            secPostId: secPostId,
            startTime: startTime,
            endTime: endTime,
        }
    }).then((data) => {
        this.send(data);
    });
});
