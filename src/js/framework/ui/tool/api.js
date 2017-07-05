/**
 * 扩展 jQuery 插件。
 */
define(['jquery', 'ui-tool-cache'], function ($, CacheUtils) {
    'use strict';

    $.fn.api = function () {
        //var element$ = this;
        //if (element$.length > 1) {
        //    throw ('存在多个元素，无法获取相应的控件实例');
        //}
        //return ns.getCache(element$);
        var controls = this.map(function () {
            return CacheUtils.getCache($(this));
        }).get();

        if (controls.length == 0) {
            return null;
        } else if (controls.length == 1) {
            return controls[0];
        } else {
            return controls;
        }
    };
});