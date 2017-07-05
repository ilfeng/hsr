/**
 * 编辑组件基类。
 *
 * @type {class}
 * 
 * @remark
 *   校验：必填、字符、数字、整数、长度范围、数字范围 等。
 *   联动：重新设置配置（参数、地址）、清空、不可用。
 *   格式：日期、数字、辅助字符 等。
 */
define(['jquery', 'core', 'ui-control', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function EditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(EditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Editor'
    };

    $.extend(EditorClass, metedata);

    // 注册组件（基类）。
    ToolUtils.regiestBaseClass(EditorClass);

    /***********公共(及特权)方法***********/
    $.extend(EditorClass.prototype, metedata, {
        /**
         * 清除输入值。
         */
        clear: function () {
            this._clear();
        },
        /**
         * 获取显示值。
         */
        getDisplay: function () {
            return this._getDisplay();
        },
        /**
         * 获取值。
         */
        getValue: function () {
            return this._getValue();
        },
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'required', value: false, kind: 'attr' }, // 是否必填。
                { name: 'fieldValue', value: 'id' },  // 值字段名称。
                { name: 'fieldDisplay', value: 'name' } // 显示字段名称。
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
            element$.addClass(EditorClass.cssClass);
            
            // 显示值。
            self._display$ = $('.' + EditorClass.cssClass + '-display', element$);
            
            // 隐藏值（可能不存在）。
            self._value$ = $('.' + EditorClass.cssClass + '-value', element$);

            // 焦点。
            self._display$.on('focus', function () {
                self._onFocus();
            }).on('blur', function () {
                self._onBlur();
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
        ////////////////////// 焦点 ////////////////////
        /**
         * 获取焦点。
         */
        _onFocus: function () {

        },
        /**
         * 离开焦点。
         */
        _onBlur: function () {

        },
        ////////////////////// 值和显示 ////////////////////
        /**
         * 获取显示值。
         */
        _getDisplay: function () {
            return this._display$.val();
        },
        /**
         * 设置显示值。
         * 
         * @param {string | object} text 要显示的值或对象。
         */
        _setDisplay: function (text) {
            // 设置默认值。
            text = text || '';
            
            // 如果是对象，提取字段。
            if (typeof text == 'object') {
                text = this._extractDisplay(text);
            }

            // 设置。
            this._display$.val(text);
        },
        /**
         * 获取值。
         */
        _getValue: function () {
            return this._value$.val();
        },
        /**
         * 设置值。
         * 
         * @param {string | object} text 要显示的值或对象。
         */
        _setValue: function (value) {
            // 设置默认值。
            value = value || '';

            // 如果是对象，提前字段。
            if (typeof value == 'object') {
                value = this._extractValue(value);
            }

            // 设置。
            var self = this, oldValue = self._value$.val();
            if (oldValue != value) {
                self._value$.val(value);
                self._onChange(value, oldValue);
                self._onValidate();
            }
        },
        /**
         * 当输入值改变时触发。
         * 
         * @param {string} newValue 新值。
         * @param {string} oldValue 旧值。
         */
        _onChange: function (newValue, oldValue) {
            this._fireEvent('change', { newValue: newValue, oldValue: oldValue });
        },
        /**
         * 清除内容。
         */
        _clear: function () {
            this._display$.val('');
            this._value$.val('');
        },
        /**
         * 提取显示值。
         * 
         * @param {object} 要提取的对象。
         * 
         * @return {string} 显示值。
         */
        _extractDisplay: function (item) {
            var displayField = this._options.fieldDisplay, value;
            if (displayField) {
                value = item[displayField];
            }
            return value || '';
        },
        /**
         * 提取值。 
         * 
         * @param {object} 要提取的对象。
         * 
         * @return {string} 显示值。
         */
        _extractValue: function (item) {
            var keyField = this._options.fieldValue, value;
            if (keyField) {
                value = item[keyField];
            }
            return value || '';
        },
        _onValidate: function() {
            if($.fn.validate){
                // 处理检验。
                var validObj = this._element$.parents('form').validate();
                if (validObj && !$.isEmptyObject(validObj.submitted)) {
                    validObj.form();
                }
            }
        }
    });

    /***********私有方法***********/

    return EditorClass;
});