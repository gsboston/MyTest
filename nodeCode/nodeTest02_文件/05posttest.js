const http = require('http');
const util = require('buffer_util');
const fs = require('fs');
const url = require('url');

// 跨域白名单
let allowOrigin = {
    'http://127.0.0.1:5500': true
}

let server = http.createServer((req, response) => {
    let { pathname, query } = url.parse(req.url);
    console.log(pathname, query);
    // 设置允许跨域
    // console.log('orgin headers:', req.headers);
    let { origin } = req.headers;
    if (allowOrigin[origin]) {
        response.setHeader('access-control-allow-origin', '*');
    }

    console.log(req.method, pathname);
    if (req.method == 'POST' && pathname == '/upload') {
        let arr = [];
        // 表单传递的数据通过boundary标识区分，boundary存放在headers中的content-type中
        // ajax post无法使用此种方式解析参数，参数{"name":"qqqq"}
        let boundary = '--' + req.headers['content-type'].split('; ')[1].split('=')[1];
        req.on('data', (buffer) => {
            arr.push(buffer);
        });

        req.on('end', () => {
            // 获取数据的原理通过对buffer的分割截取等操作
            let buffer = Buffer.concat(arr);
            console.log('buffer:', buffer.toString());
            //1.按照分隔符切分
            let res = util.bufferSplit(buffer, boundary);

            res.pop();
            res.shift();

            //2.每一个处理一下
            res.forEach(buffer => {
                buffer = buffer.slice(2, buffer.length - 2);

                let n = buffer.indexOf('\r\n\r\n');

                let info = buffer.slice(0, n).toString();
                let data = buffer.slice(n + 4);

                if (info.indexOf('\r\n') != -1) {
                    //文件
                    let res2 = info.split('\r\n')[0].split('; ');
                    let name = res2[1].split('=')[1];
                    let filename = res2[2].split('=')[1];

                    name = name.substring(1, name.length - 1);
                    filename = filename.substring(1, filename.length - 1);

                    fs.writeFile(`upload/${filename}`, data, err => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('上传成功');
                        }
                    });
                } else {
                    //普通信息
                    let name = info.split('; ')[1].split('=')[1];
                    name = name.substring(1, name.length - 1);

                    console.log('params:' + name + ':' + data.toString());
                }

                // console.log(data.toString());
            });
        });
    } else if (req.method == 'GET') {
        let { pathname, query } = url.parse(req.url, true);
        console.log('getP:', query);

        response.write(JSON.stringify({ error: 0, msg: '请求成功' }));
        response.end();
    }
}).listen(8080);

$.ajax({
    type: 'POST',
    url: 'http://47.110.40.152:8081/permissionManage/psoperprx/v1/configure?userkey=237fc057-16a3-4e8f-b57f-72bff404dd5a',
    async: true,
    data: JSON.stringify({
        configKey : 'abtest',
        config:{filter:[]},
        lastIndex : 3
    }),
    dataType: "json",
    contentType: 'application/json',
    success: function (res) {
        if (res.errCode == 0) {
            if (res.errCode == "0") {
                alert('操作成功');
            } 
        }
    }
});