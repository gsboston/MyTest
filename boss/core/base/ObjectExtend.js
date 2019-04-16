/**
 * 判断对象是否不为空
 * @param expression
 * @returns {boolean}
 */
Object.notNull = function(expression) {
    return expression != null;
};

/**
 * 判断对象是否为空
 * @param expression
 * @returns {boolean}
 */
Object.isNull = function(expression) {
    return expression == null;
};

/**
 * 判断对象是否有成员属性（不包括原型属性）
 * @param expression
 * @returns {boolean}
 */
Object.notEmpty = function(expression) {
    return Object.notNull(expression) && Array.notEmpty(Object.keys(expression));
};

/**
 * 判断对象是否没有成员属性（不包括原型属性）
 * @param expression
 * @returns {boolean}
 */
Object.isEmpty = function(expression) {
    return Object.notNull(expression) && Array.isEmpty(Object.keys(expression));
};

/**
 * 判断字符串是否不为空字符串
 * @param expression
 * @returns {boolean}
 */
String.notBlank = function(expression) {
    return Object.notNull(expression) && expression !== "";
};

/**
 * 判断字符串是否为空字符串
 * @param expression
 * @returns {boolean}
 */
String.isBlank = function(expression) {
    return Object.notNull(expression) && expression === "";
};

/**
 * 判断字符串是否为空或空字符串
 * @param expression
 * @returns {boolean}
 */
String.isNullOrBlank = function(expression) {
    return Object.isNull(expression) || expression === "";
};

String.transformPay = function (currency) {
    let negative = "";
    if(Number(currency) < 0) {
        negative = "负";
        currency = (currency + "").substr(1);
    }
    let strOutput = "";
    let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
    currency += "00";
    let intPos = currency.indexOf('.');
    if (intPos >= 0)
        currency = currency.substring(0, intPos) + currency.substr(intPos + 1, 2);
    strUnit = strUnit.substr(strUnit.length - currency.length);
    for (let i=0; i < currency.length; i++)
        strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(currency.substr(i,1),1) + strUnit.substr(i,1);
    return negative + strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
};

/**
 * 将字符串转变为驼峰规则
 * @param str
 * @returns {string}
 */
String.transform2TF = function(text) {
    if(Object.isNull(text) || String.isBlank(text) || text.indexOf("-") == -1) {
        return "";
    }
    text = text.replace(/\-(\w)/g, _test => {
        return _test.slice(1).toUpperCase();
    });
    return text;
};

/**
 * 将字符串转转变为-规则
 * @param str
 * @returns {string}
 */
String.transformFromTF = function(text) {
    if(Object.isNull(text) || String.isBlank(text) || !/([A-Z])/g.test(text)) {
        return "";
    }
    text = text.replace(/([A-Z])/g, "-$1").toLowerCase();
    return text;
};

/**
 * 判断数组是否不为空
 * @param expression
 * @returns {boolean}
 */
Array.notEmpty = function(expression) {
    return Object.notNull(expression) && expression.length > 0;
};

/**
 * 判断数组是否为空数组
 * @param expression
 * @returns {boolean}
 */
Array.isEmpty = function(expression) {
    return Object.notNull(expression) && expression.length == 0;
};

/**
 * 格式化浮点型运算结果
 * @param expression 运算表达式
 * @param precision 需要格式化的精度
 */
Math.format = function(expression, precision) {
    let multi = Math.pow(10, precision);
    let result = Number(expression * multi).toFixed(precision);
    return Number(result) / multi;
};

Number.prototype.getPrecision = function() {
    let value = this;
    let precision = 0;
    if(isNaN(value)) {
        return 0;
    }
    if(String(value).indexOf(".") > -1) {
        precision = String(value).split(".")[1].length;
    }
    return precision;
};


Date.prototype.format = function (formatter) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(formatter))
        formatter = formatter.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o){
        if (new RegExp("(" + k + ")").test(formatter)) {
            formatter = formatter.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatter;
};