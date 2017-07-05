/**
 * 控件缓存。
 */
define(['jquery'], function ($) {
    'use strict';

    return {
        /**
         * 在元素上缓存控件的实例。
         */
        setCache: function (element$, control) {
            // 如果已经存在，则不再次添加。
            if (element$ && control && !element$.data('@DATA_CACHE_KEY@')) {
                element$.data('@DATA_CACHE_KEY@', control);
            }
        },
        /**
         * 获取元素缓存的控件实例。
         */
        getCache: function (element$) {
            if (element$) {
                return element$.data('@DATA_CACHE_KEY@');
            }
        },
        /**
         * 清除元素缓存的控件实例。
         */
        clearCache: function (element$) {
            if (element$) {
                element$.removeData('@DATA_CACHE_KEY@');
            }
        }
    };
});