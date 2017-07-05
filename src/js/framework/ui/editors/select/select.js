/**
 * 组件。
 *
 * @type {class}
 * 
 * @remark
 *     
 */
define(['jquery', 'core', 'ui-editor', 'ui-tool-manager', 'select2'], function ($, hsr, _super, ToolUtils, Select2Class) {
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
    function SelectEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(SelectEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-select',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'SelectEditor'
    };

    $.extend(SelectEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(SelectEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(SelectEditorClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
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
            _superMethods._create.call(self, element$, options);
            
            // 添加样式。
            element$.addClass(SelectEditorClass.cssClass);

            // Select2Class
            element$.select2();
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
        }
    });

    /***********私有方法***********/

    return SelectEditorClass;
});