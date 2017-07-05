/**
 * 颜色编辑组件。
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
    function ColorPickerClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._panelInited = false;   // 指示下拉面板是否初始化过。
        self._panelOpened = false;   // 指示下拉面板是否被打开。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(ColorPickerClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-color',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'ColorPicker'
    };

    $.extend(ColorPickerClass, metedata);

    // 注册组件。
    ToolUtils.regiest(ColorPickerClass);

    /***********公共(及特权)方法***********/
    $.extend(ColorPickerClass.prototype, metedata, {
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
            
            // 颜色指示器。
            self._indicater$ = $('.@CSS_PREFIX@indicater-color', element$);
            // 颜色指示器显示input的value
            self._setColor(self._display$.val());
            
            // 显示值：点击改变颜色。
            self._display$.on('keyup', function () {
                // 输入改变，同步改变指示器的颜色。
                self._setColor($(this).val());
            }).on('keypress', function (e) {
                var c = e.which;
                // Firefox 会接收控制键，必须被移除。
                if (c == 0 || c == 8) {  // 0 - Delete; 8 - Backspace。
                    return true;
                }
                // 检验长度。
                var v = $(this).val();
                if (v.length >= 6) {
                    return false;
                }
                // 检验输入值是否正确（0-9,a-z,A-Z）。
                if ((c >= 48 && c <= 57) || (c >= 65 && c <= 70) || (c >= 97 && c <= 102)) {
                    return true;
                }
                return false;
            }).attr('color', true);
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
            var self = this;
            
            // 清除颜色。
            self._clearColor()
        },
        _setColor: function (color) {
            if (color.length > 0) {
                this._indicater$.css('backgroundColor', '#' + color);
            } else {
                this._clearColor();
            }
        },
        _clearColor: function () {
            this._indicater$.css('backgroundColor', 'transparent');
        }
    });

    /***********私有方法***********/

    return ColorPickerClass;
});