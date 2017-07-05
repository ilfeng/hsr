/**
 * 容器控件。
 * 
 * @remark 刷新、销毁时，处理子控件。
 *  子控件获取方式：查找控件下第一层样式类为“@CSS_PREFIX@container”的控件（不一定为直接子控件）。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-control',
    'ui-tool-manager', 'ui-tool-cache'
], function ($, hsr, _super, ToolUtils, CacheUtils) {
    'use strict';

    var _superMethods = _super.prototype;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function ContainerClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。 
    hsr.inherit(ContainerClass, _super);

    /***********元数据***********/
    var metedata = {
        /**
         * 版本。
         * @type {string}
         * @readonly
         */
        version: '@VERSION@',
        /**
         * 样式类。
         * @type {string}
         * @readonly
         */
        cssClass: '@CSS_PREFIX@container',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Container'
    };

    $.extend(ContainerClass, metedata);

    // 注册组件。
    ToolUtils.regiestBaseClass(ContainerClass);

    /***********公共(及特权)方法***********/
    $.extend(ContainerClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [{ name: 'fit', value: true }];
        },
        /**
         * 销毁子控件。
         * 
         * @protected
         */
        _destroyChildren: function () {
            // 依次调用子控件销毁方法。
            this._getChildren().forEach(function (o) {
                o.destroy();
            });
        },
        /**
         * 刷新控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _refresh: function (element$, options) {
            var self = this;
            _superMethods._refresh.call(self, element$, options);

            // 填充父容器。
            if (options.fit === true) {
                // 获取父容器可用区域的大小。
                var parent$ = element$.parent();

                if (parent$.is('form')) {
                    // form 没有高度和宽度。
                    parent$ = parent$.parent();
                }

                var parentHeight = parent$.height();
                var parentWidth = parent$.width();

                if (parent$.is('body')) {
                    parentHeight = $(window).height();
                    parentWidth = $(window).width();
                }

                element$.css({
                    height: parentHeight + 'px',
                    width: parentWidth + 'px'
                });
            }
        },
        /**
         * 刷新子控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _refreshChildren: function (element$, options) {
            this._getChildren().forEach(function (o) {
                o.refresh();
            });
        }
    });

    /***********私有方法***********/

    return ContainerClass;
});
