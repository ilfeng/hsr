/**
 * 字符串辅助（静态）类。
 *
 * @type {class}
 * @static
 */
define(['ns'], function (ns) {
    'use strict';

    return (ns.StringUtils = {
        /**
         * 判断给定字符串是否为空或空字符。
         *
         * @param {string} s 要判断的字符串。
         *
         * @returns {boolean} true -- 字符串为空；false -- 字符串不为空。
         */
        isBlank: function (s) {
            var ss = s;
            
            // 数字类型先转为字符类型。
            if (ss && typeof (ss) == 'number') {
                ss = ss.toString();
            }

            // 字符判断其长度。
            if (ss && typeof (ss) == 'string') {
                return ss.trim().length == 0;
            }

            return true;
        },
        /**
         * 格式化字符串。
         *  input:aaaaaa({a1}),({a2}),({a3}), {'a1':'aaa','a2':'bbb','a3':'ccc'}
         *  output:aaaaaa(aaa),(bbb),(ccc)
         * @param {string} s 字符串格式化模板。
         * @param {array[string]} args 格式化参数。
         */
        format: function (s, args) {
            if (arguments.length > 1) {
                var result = s;

                if (arguments.length == 2 && typeof (args) == 'object') {
                    for (var key in args) {
                        var reg = new RegExp('({' + key + '})', 'g');
                        result = result.replace(reg, args[key]);
                    }
                } else {
                    for (var i = 1; i < arguments.length; i++) {
                        if (arguments[i] == undefined) {
                            return '';
                        } else {
                            var reg = new RegExp('({[' + (i - 1) + ']})', 'g');
                            result = result.replace(reg, arguments[i]);
                        }
                    }
                }

                return result;
            }
        },
        /**
         *  output true,false
         */
        startWith: function (s, str) {
            if (s.startWith) {
                return s.startWith(str);
            } else {
                var reg = new RegExp("^" + str);
                return reg.test(s)
            }
        },
        /**
         * output true,false
         */
        endWith: function (s, str) {
            if (s.endWith) {
                return s.endWith(str);
            } else {
                var reg = new RegExp(str + "$");
                return reg.test(s);
            }
        },
        /**
         * 将data-数据进行反转
         * 例如xxxId转化为xxx-id
         */
        transformData: function (str) {
            var arr = str.split("");
            for (var i = 1; i < arr.length; i++) {
                if (arr[i] > 'A' && arr[i] < 'Z') {
                    arr[i] = "-" + arr[i].toLowerCase();
                }
            }
            return arr.join("");
        }
    });
});
