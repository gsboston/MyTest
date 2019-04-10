const http = require("http");
const fs = require("fs");

let server = http.createServer((req, res) => {
    console.log("qing qiu lai le");
    fs.writeFile("./aaa.txt", "this is a txt", (err) => {
        if (err) {
            console.log(`失败：${err}`);
        } else {
            res.write("file has changed!");
        }
        fs.readFile("./aaa.txt", (err, data) => {
            res.write(`file content:${data}`);
            res.end();
        })
    })

})

server.listen(8080);