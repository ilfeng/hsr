/**
 * 面板控件。
 *
 * @type {class}
 * 
 * @remark 面板包括三部分：头、体、脚。
 */
define(['jquery', 'core', 'ui-container', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function PanelClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(PanelClass, _super);
    
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
        cssClass: '@CSS_PREFIX@panel',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Panel'
    };

    $.extend(PanelClass, metedata);

    // 注册组件。
    ToolUtils.regiest(PanelClass);

    /***********公共(及特权)方法***********/
    $.extend(PanelClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        //_createOptionProperties: function () {
        //    return [
        //    ];
        //},
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

            // 获取容器头、体、尾。
            var cssClass = self._getRootStyleClass();
            self._head$ = element$.children('.' + cssClass + '-head');
            self._body$ = element$.children('.' + cssClass + '-body');
            self._foot$ = element$.children('.' + cssClass + '-foot');
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;

            self._head$ = null;
            self._body$ = null;
            self._foot$ = null;

            _superMethods._destroy.call(self);
        },
        /**
         * 获取根样式类。
         */
        _getRootStyleClass: function () {
            return PanelClass.cssClass;
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

            // 体高度限制。
            //if (!isNaN(options.height)) {
            var eHeight = element$.height(),
                hHeight = self._head$.outerHeight(),
                tHeight = self._foot$.outerHeight(),
                bHeight = eHeight - hHeight - tHeight;
            self._body$.css('height', bHeight);
            //}
        }
    });

    /***********私有方法***********/

    return PanelClass;
});
