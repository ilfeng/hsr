/**
 * 地址辅助类。
 *
 * @type {class}
 * @static
 */
define(['jquery', 'ns', 'util-string'], function ($, ns, StringUtils) {
    'use strict';

    return (ns.UrlUtils = {
        /**
         * 转换字符串地址为对象。
         * 
         * @param {string} url 地址。
         * 
         * @return {object} 地址对象。
         */
        parse: function (url) {
            if (StringUtils.isBlank(url)) return null;

            var local = '', ps = null, obj = {};
            
            // 拆分地址：截取"?"前的部分。
            var indexSplit = url.indexOf('?');
            if (indexSplit != -1) {
                local = url.substring(0, indexSplit);
                ps = url.substring(indexSplit);
            } else if (url.indexOf('&') > 0) {
                ps = url;
            } else {
                local = url;
            }
            
            // 拆分参数。
            if (ps) {
                var params = ps.split("&");

                for (var i = 0; i < params.length; i++) {
                    var param = params[i].split('='), key = param[0], value = param[1], objProp = obj[key];

                    if (objProp) {
                        if (!Array.isArray(objProp)) {
                            obj[key] = [objProp];
                        }
                        obj[key].push(value);
                    } else {
                        obj[key] = value;
                    }
                }
            }

            return { url: local, params: obj };
        },
        /**
         * 生成带参数的地址。
         * 
         * @param {string} url 地址。
         * @param {object} params 参数对象。
         * 
         * @return {string} 转换后的地址。
         */
        join: function (url, params) {
            if (StringUtils.isBlank(url)) return '';

            var p = [];
            var indexSplit = url.lastIndexOf('?');

            if (!params) return url;
            
            var ps = $.param(params);
            
            if (StringUtils.isBlank(ps)) return url;

            // 添加地址。
            p.push(url);
                
            // 添加连接符。
            if (indexSplit == -1) {
                // 不存在连接符。
                p.push('?');
            } else if (indexSplit == 0) {
                // 最后一个字符为连接符。
            } else {
                // 存在连接符。
                p.push('&');
            }
            
            // 添加参数。
            p.push(ps);

            // 拼接地址。
            return p.join('');
        }
    });
});
