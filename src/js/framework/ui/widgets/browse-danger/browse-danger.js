/**
 * 加载进度控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-panel', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function BrowseDangerClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。
    hsr.inherit(BrowseDangerClass, _super);

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
        cssClass: '@CSS_PREFIX@browse-danger',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'BrowseDanger'
    };

    $.extend(BrowseDangerClass, metedata);

    // 注册组件。
    ToolUtils.regiest(BrowseDangerClass);

    /***********公共(及特权)方法***********/
    $.extend(BrowseDangerClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'fit', value: true }
            ];
        },
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
            //self._setLeft(element$);
            _superMethods._create.call(self, element$, options);
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;
            _superMethods._destroy.call(self);
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
            //self._setLeft(element$);
            _superMethods._refresh.call(self, element$, options);
        },
        /**
         * 设置left属性
         * 设置元素所处的位置
         * 计算方法 父级元素宽-元素宽/2
         * @param {jQuery} element$ 主元素。
         * @protected
         */
        _setLeft: function (element$) {
            var browsedangercontent$ = $('.hsrui-browse-danger-content', element$),body$=$('body');
            browsedangercontent$.css('left', (body$.width()-browsedangercontent$.width())/2);
        }
    });

    /***********私有方法***********/

    return BrowseDangerClass;
});