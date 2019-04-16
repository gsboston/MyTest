const DateFormat = {};

/**
 * 将日期格式化为指定格式的字符串
 * @param {Object|Number} date - 可以是 Date 类型，可以是时间戳，必选项
 * @param {String} [pattern = yyyy-MM-dd] - 自定义日期格式，可选项，默认格式：年-月-日
 * @example
 * DateFormat.dateToString(1505268971589, 'yyyy-MM-dd EE HH:mm:ss');
 * @example
 * DateFormat.dateToString(new Date(1505268971589), 'yyyy-MM-dd');
 * @returns {String} - 返回格式化后的日期字符串
 */
DateFormat.dateToString = function(date, pattern) {
    if(!date){
        return '';
    }

    date = typeof date === 'number' ? new Date(date) : date;
    pattern = pattern || 'yyyy-MM-dd';

    let obj = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 24小时制
        'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
        "m+": date.getMinutes(), // 分钟
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S+": date.getMilliseconds() // 毫秒
    };
    let week = ["日", "一", "二", "三", "四", "五", "六"];
    if(/(y+)/i.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
    }
    for(let k in obj) {
        if(new RegExp("(" + k + ")").test(pattern)) {
            pattern = pattern.replace(RegExp.$1, RegExp.$1.length == 1 ?
                obj[k] : ("00" + obj[k]).substr(("" + obj[k]).length));
        }
    }

    return pattern;
};

/**
 * 将字符串格式化为日期
 * @param {String} str - 必选项，日期字符串，如：'2017-09-12'
 * @param {String} [pattern = yyyy-MM-dd] - 自定义日期格式，可选项，默认格式：年-月-日，支持如下：y、M、d、H、m、s、S
 * @example
 * DateFormat.stringToDate('2017-09-13 10:33:55', 'yyyy-MM-dd HH:mm:ss');
 * @returns {Object} - 返回 Date 类型日期
 */
DateFormat.stringToDate = function (str, pattern) {
    pattern = pattern || 'yyyy-MM-dd';

    let obj = {
        y: 0,
        M: 1,
        d: 0,
        H: 0,
        h: 0,
        m: 0,
        s: 0,
        S: 0
    };
    pattern.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function(m, $1, $2, $3, $4, idx, old){
        str = str.replace(new RegExp($1+'(\\d{'+$2.length+'})'+$4), function(_m, _$1)
        {
            obj[$3] = parseInt(_$1);
            return '';
        });
        return '';
    });
    obj.M--; // 月份是从0开始的，所以要减去1
    let date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
    if(obj.S !== 0) date.setMilliseconds(obj.S); // 如果设置了毫秒

    return date;
};

module.exports = DateFormat;