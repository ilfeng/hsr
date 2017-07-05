/**
 * 字体编辑组件。
 *
 * @type {class}
 * 
 * @remark
 *     包含颜色指示器。
 */
define(['jquery', 'core', 'ui-editor-picker', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function FontEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._panelInited = false;   // 指示下拉面板是否初始化过。
        self._panelOpened = false;   // 指示下拉面板是否被打开。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(FontEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-font',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'FontEditor'
    };

    $.extend(FontEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(FontEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(FontEditorClass.prototype, metedata, {
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
         * 当输入值改变时触发。
         */
        _onChange: function () {

        },
        /**
         * 清除内容。
         */
        _clear: function () {
            
        }
    });

    /***********私有方法***********/

    return FontEditorClass;
});