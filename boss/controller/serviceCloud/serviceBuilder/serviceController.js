const fs = require("fs");
/**
 * 获取服务单模板
 */
$RequestMapping("/serviceCloud/getServiceTemplate.do", function(typeId) {
    let env = process.env.NODE_ENV;
    // env.toLowerCase() == "development"
    if(env.toLowerCase() == "development") {
        fs.readFile('controller/serviceCloud/serviceBuilder/tpl/'+typeId+'.html', {flag: 'r+', encoding: 'utf8'}, (err, data) =>{
            if(err) {
                console.error(err);
                return;
            }
            this.send(data);
        });
    }else {
        this.get({
            url:'/serve-api/billdef/getInnputTemplateId',
            param: {
                attachmentId: typeId
            }
        }).then(data => {
            this.send(data);
        });
    }
});

