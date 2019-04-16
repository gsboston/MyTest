exports.dataTime = function (date, fmt) {
    if (date == '') {
        return '';
    }
    let dates = new Date(date);
    if (/(y+)/.test(fmt)) {

        fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': dates.getMonth() + 1,
        'd+': dates.getDate(),
        'h+': dates.getHours(),
        'm+': dates.getMinutes(),
        's+': dates.getSeconds()
    };

    // 遍历这个对象
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

