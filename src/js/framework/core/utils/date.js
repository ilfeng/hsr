/**
 * 日期辅助类。
 *
 * @type {class}
 * @static
 */
define(['ns'], function (ns) {
    'use strict';

    return (ns.DateUtils = {
        /**
         * 按照指定的格式转换日期为字符串。
         * 
         * @param {date} date 日期。
         * @param {string} format 格式化字符串。
         * 
         * @returns {string} 格式化后的日期字符串。
         */
        format: function (date, format) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        },
        /**
         * 数字转换为日期。
         *
         * @param {number} time
         *
         * @return {Date} 转换后的日期。
         *
         * @remark 转换失败返回 null 。
         */
        convert: function (time) {
            try {
                var d = new Date();
                d.setTime(time);
                return d;
            } catch (ex) {
                return null;
            }
        }
    });
});
