/**
 * 图片预览控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-control', 'ui-tool-manager', 'fancybox'], function ($, hsr, _super, ToolUtils) {
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
    function FancyBoxClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。
    hsr.inherit(FancyBoxClass, _super);

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
        cssClass: '@CSS_PREFIX@fancybox',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'FancyBox'
    };

    $.extend(FancyBoxClass, metedata);

    // 注册组件。
    ToolUtils.regiest(FancyBoxClass);

    /***********公共(及特权)方法***********/
    $.extend(FancyBoxClass.prototype, metedata, {
        /**
         * 创建控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _create: function (element$, options) {
            var self = this;
            _superMethods._create.call(self, element$, options);

            // 设置显示位置。
            var parent$;
            if(window != window.top && window.top.$.fancybox) {
                parent$ = window.top.$('body');
            } else {
                parent$ = $('body');
            }

            // 使用第三方控件进行展示。
            element$.fancybox({
                parent: parent$
            });
        }
    });

    /***********私有方法***********/

    return FancyBoxClass;
});