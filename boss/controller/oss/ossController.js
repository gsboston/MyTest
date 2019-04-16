var request = require('request');

$RequestMapping("/ossController/oss/signature.do", function() {
    this.get({
        url:'/oss-api/oss/signature'
    }).then(data => {
        this.send(data);
    });
});


$RequestMapping("/ossController/oss/save.do", function(data) {
    console.log(data);
    this.post({
        url:'/oss-api/oss/file',
        data:data
    }).then(data => {
        this.send(data);
    });
});

$RequestMapping("/ossController/oss/file.do", function(id,xOssProcess) {
    if(Object.isNull(id)) {
        this.response.send();
        return;
    }
    var xOssProcess =xOssProcess?'?x-oss-process='+encodeURIComponent(xOssProcess):"";
    this.get({
        url:'/oss-api/oss/file/'+id+xOssProcess
    }).then(data => {
        this.response.redirect(data);
    });
});

$RequestMapping("/ossController/oss/publicFile.do", function(id,xOssProcess) {
    if(Object.isNull(id)) {
        this.response.send();
        return;
    }
    var xOssProcess =xOssProcess?'?x-oss-process='+encodeURIComponent(xOssProcess):"";
    this.get({
        url:'/oss-api/oss/publicFile/'+id+xOssProcess
    }).then(data => {
        this.response.redirect(data);
    });
}, {
    isAuth: false
});

$RequestMapping("/ossController/oss/getOssHost.do", function() {
    this.get({
        url:'/oss-api/oss/signature'
    }).then(data => {
        var oss_host = process.config.OSS_HOST;
        this.send(oss_host);
    });
});

/**
 * 下载OSS文件
 */
$RequestMapping("/ossController/oss/downloadFile.do", function(id, type, isImage, xOssProcess) {
    if(Object.isNull(id)) {
        this.response.send();
        return;
    }
    var xOssProcess =xOssProcess?'?x-oss-process='+encodeURIComponent(xOssProcess):"";
    this.get({
        url:'/oss-api/oss/file/'+id+xOssProcess
    }).then(data => {
        let $self = this;
        if (isImage) {
            this.send(data);
        }else {
            request(data, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    $self.response.setHeader('Content-Disposition', 'attachment;filename=' + id + '.' + type);
                    $self.response.end(body);
                }
            });
        }
    });
});
