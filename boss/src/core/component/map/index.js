export default function Map() {
    return new Promise(function (resolve, reject) {
        window.init = function () {
            resolve(BMap);
            delete window.init;
        };
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://api.map.baidu.com/api?v=2.0&ak=aIR2TeZpZBmeIuVQQxG6xaCH&callback=init&s=1";
        script.onerror = reject;
        document.head.appendChild(script);
    });
};