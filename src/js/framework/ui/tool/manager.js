/**
 * 控件类型管理。
 */
define(['jquery', 'core', 'ui-ns', 'ui-tool-cache'], function ($, hsr, ns, CacheUtils) {
    'use strict';

    return $.extend(ns, {
        _controlTypes: new hsr.Dictionary(),
        /**
         * 注册控件类。
         * 
         * @param {object} clazz 控件类型。
         * @param {boolean} isBase 是否基类（基类不登记到控件扫描集合）。
         */
        _regiest: function (clazz, isBase) {
            if (!clazz) {
                throw ('控件类不存在');
            }
            
            // 检查控件名称是否存在。
            var cls = clazz.cssClass, name = clazz.typeName;
            if (hsr.StringUtils.isBlank(name)) {
                throw ('控件类[' + clazz.name + ']类名不存在');
            }

            // 登记控件到扫描集合。
            if (!isBase && !hsr.StringUtils.isBlank(cls)) {
                this._controlTypes.set(cls, clazz);
            }

            // 在命名空间中注册控件。
            return this[name] = clazz;
        },
        /**
         * 注册控件类。
         * 
         * @param {object} clazz 控件类型。
         */
        regiest: function (clazz) {
            this._regiest(clazz, false);
        },
        /**
         * 注册控件基类。
         * 
         * @param {object} clazz 控件类型。
         */
        regiestBaseClass: function (clazz) {
            this._regiest(clazz, true);
        },
        /**
         * 扫描元素的所有子元素并生成控件。
         * 
         * @params {jQuery} element$ 要扫描的元素。
         */
        parse: function (element$) {
            if (!element$) {
                element$ = $('body');
            }

            this._controlTypes.forEach(function (clazz, cls) {
                $('.' + cls, element$).map(function () {
                    var elem$ = $(this);
                    // 已经绑定过的不能再次绑定。
                    if(!CacheUtils.getCache(elem$)) {
                        new clazz(elem$);
                    }
                });
            });
        }
    });
});