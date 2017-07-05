/**
 * 登陆页。
 *
 * @type {class}
 *
 * @remark
 *     包含：固定的顶部、左侧菜单、中心选项卡式视图。
 */
define([
    'jquery', 'core', 'base', 'jquery-backstretch', 'bootstrap3'
], function ($, hsr, base) {
    'use strict';

    var _super = base.BasePage,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     *
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     *
     * @constructor
     */
    function ShellClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(ShellClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(ShellClass.prototype, {
        start: function () {
            var self = this;
        },
        /**
         * 创建配置属性。
         *
         * @returns {array} 配置属性信息。
         *
         * @protected
         */
        _createOptionProperties: function () {
            return [];
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
            _superMethods._create.call(self, element$, options);
            // 菜单项目。
            self._initBackGround(element$);
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
            _superMethods._refresh.call(self, element$, options);
        },
        /**
         * 加载完成事件。
         */
        _onComplete: function () {
            this.refresh();
            _superMethods._onComplete.call(this);
        },
        _initBackGround: function (element$) {
            var self = this;

            // 背景。
            element$.backstretch();
        }
    });

    /***********私有方法***********/

    return ShellClass;
});