/**
 * 带下拉的编辑组件。
 *
 * @type {class}
 * 
 * @remark
 *     包含下拉面板、清除按钮、下拉按钮。
 *     数据源：通过 ajax 远程获取。
 *     操作：
 *         1. 下拉选择。
 *         2. 手工输入字符，打开下拉面板过滤。回车选择过滤的第一项。点击选择项。
 *         3. 粘贴的字符，打开下拉面板过滤。
 *     限制：当离开焦点时，如果没有选择项，清空数据；如果存在显示字符且可以匹配唯一项，自动填入。
 */
define(['jquery', 'core', 'ui-editor', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function ComboEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        
        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(ComboEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-combo',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'ComboEditor'
    };

    $.extend(ComboEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(ComboEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(ComboEditorClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'url', value: '' },  // 获取数据的地址。
                { name: 'method', value: 'post' },  // 请求方式。
                { name: 'tmplItem', value: '' }  // 数据项模板，比如“#tmpl-item-xxxx”。
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
            
            // 输入感应。
            // oninput: HTML5, IE9+ 。
            // onpropertychange: IE8 。
            self._display$.on('input propertychange', function() {
                var textbox$ = $(this);
                //console.log(textbox$.val());
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
        },
        /**
         * 打开下拉面板前判断。
         * 
         * @return {boolean} true -- 继续打开；false -- 停止打开。
         */
        _beforeOpenDropDownPanel: function(){
            return true;
        }
    });

    /***********私有方法***********/

    return ComboEditorClass;
});