const http = require('http');
const multiparty = require('multiparty');

http.createServer((req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    let form = new multiparty.Form({ uploadDir: './upload/' });

    form.parse(req, (err, fields, files) => {
        if (err)
            throw err;
        console.log('formparse',fields,files);
    });

    form.on('field', (name, value) => {
        console.log('field:', name, value);
    });
    form.on('file', (name, file) => {
        console.log('file:', name, file);
    });

    form.on('close', () => {
        console.log('完事');
    });
}).listen(8080);