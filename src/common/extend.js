'use strict';

//去前后空格
String.prototype.trim = function () {
    let text = this.replace(/^\s\s*/, ''), ws = /\s/, i = this.length;
    while (ws.test(text.charAt(--i))) {};
    return text.slice(0, i + 1);
};
String.prototype.sub = function (len, ext) {
    ext = ext || '';
    let r = /[^\x00-\xff]/g;
    if (this.replace(r, 'mm').length <= len) return this.substr(0) + '';
    let m = Math.floor(len / 2);
    for (let i = m; i < this.length; i++) { if (this.substr(0, i).replace(r, 'mm'.length >= len)) {return this.substr(0, i) + ext;} }
    return this;
};
//字符串格式化
String.prototype.format = function () {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function () {return args[arguments[1]];});
};
//是否日期时间字符串
String.prototype.isDateTime = function () {
    let r = this.replace(/(^\s*)|(\s*$)/g, '').match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (r == null) return false;
    let d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
};
//是否日期字符串
String.prototype.isDate = function () {
    let r = this.replace(/(^\s*)|(\s*$)/g, '').match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return false;
    let d = new Date(r[1], r[3] - 1, r[4]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
};
//字符串转日期
String.prototype.toDateTime = function () {
    if (!this) return null;
    let val = this.replace(/[-]/g, '/');
    if (val.isDate() || val.isDateTime()) return new Date(Date.parse(val));
    let r = this.match(/(\d+)/);
    if (r) return new Date(parseInt(r)*1000);
    return new Date(val);
};
//是否Email地址
String.prototype.isEmail = function () {
    return this.match(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0,9]{1,3})(\]?)$/ig);
};
//是否手机号
String.prototype.isMobile = function () {
    return this.match(/^(^(1[3-9]\d)\d{8})$/ig);
};
//检查密码格式
String.prototype.checkPassword = function () {
    return this.match(/^(?!\d+$)(?![a-zA-Z]+$)(?![!@#$%^&*,.]+$)([a-zA-Z\d]|[a-zA-Z!@#$%^&*,.]|[\d!@#$%^&*,.]|[a-zA-Z\d!@#$%^&*,.]){8,15}$/);
};
//日期格式化
Date.prototype.format = function (fmt) { //日期format参数 yyyy-MM-dd HH:mm:ss
    let o = {"M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, "H+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S": this.getMilliseconds()};
    let week = {"0": "\u65e5", "1": "\u4e00", "2": "\u4e8c", "3": "\u4e09", "4": "\u56db", "5": "\u4e94", "6": "\u516d"};
    if (/(y+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));};
    if (/(E+)/.test(fmt)) {fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : '') + week[this.getDay() + '']);};
    for (let k in o) { if (new RegExp("(" + k + ")").test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }; };
    return fmt;
};
//转unix time
Date.prototype.toUnixTime = function () { return Math.round(+this/1000); };
