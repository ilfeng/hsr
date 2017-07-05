/**
 * 带弹出面板的编辑组件。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-editor',
    'ui-tool-manager', 'ui-enum-selectMode', 'ui-dialog'
], function ($, hsr, _super, ToolUtils, SelectModeEnum, DialogClass) {
    'use strict';

    var _superMethods = _super.prototype,
        StringUtils = hsr.StringUtils,
        UrlUtils = hsr.UrlUtils;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function PopupEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(PopupEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-popup',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'PopupEditor'
    };

    $.extend(PopupEditorClass, metedata);
        
    // 注册组件。
    ToolUtils.regiest(PopupEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(PopupEditorClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'url', value: null },
                { name: 'selectMode', value: SelectModeEnum.SINGLE }, // 选项模式：单选、多选，默认单选。
                { name: 'splitChar', value: ',' },
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
            
            // 地址转换。
            self._urlO = UrlUtils.parse(options.url);
            
            // 清除按钮。
            self._clearButton$ = $('.@CSS_PREFIX@editor-button.clear', element$).on('click', function () {
                self.clear();
                return false;
            });
            
            // 弹出按钮。
            self._arrowButton$ = $('.@CSS_PREFIX@editor-button.arrow', element$).on('click', function () {
                if (self._beforeOpenPopupDialog()) {
                    self._openPopupDialog();
                }
                return false;
            });
            
            // 
            self._display$.on('click', function () {
                if (self._beforeOpenPopupDialog()) {
                    self._openPopupDialog();
                }
                return false;
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
         * 打开对话框之前。
         */
        _beforeOpenPopupDialog: function () {
            var self = this,
                opts = self._options;
            if (!StringUtils.isBlank(opts.beforOpen)) {
                eval(opts.beforOpen);
            }
            return true;
        },
        /**
         * 打开对话框。
         */
        _openPopupDialog: function () {
            var self = this,
                opts = self._options,
                value = self._getValue(),
                display = self._getDisplay(),
                params = {  // 传递到弹出对话框内的参数。
                    fieldValue: StringUtils.transformData(opts.fieldValue),
                    fieldDisplay: StringUtils.transformData(opts.fieldDisplay),
                    selectMode: opts.selectMode
                };

            // 生成地址。
            var url = UrlUtils.join(self._urlO.url, $.extend(self._urlO.params, self._dataParams));

            // 当前值。
            if (!StringUtils.isBlank(value)) {
                params.value = value.split(opts.splitChar);
            }

            // 当前显示。
            if (!StringUtils.isBlank(display)) {
                params.display = display.split(opts.splitChar);
            }
            
            // 对话框配置。
            var dlgOptions = {
                id: PopupEditorClass.typeName,
                title: '选择',
                url: url,
                data: params,
                buttons: [{
                    text: '取消'
                }, {
                    text: '确定',
                    handler: function () {
                        var iframe = this.iframeNode;
                        if (iframe) {
                            var pageHandler = iframe.contentWindow['pageHandler'];
                            if (pageHandler && pageHandler.accept) {
                                pageHandler.accept();
                            }
                            return false;
                        }
                    },
                    autofocus: true
                }],
                onClose: function (result) {
                    if (!result) return;

                    if (!Array.isArray(result)) {
                        result = [result];
                    }

                    var displayTexts = [], values = [];

                    result.forEach(function (o) {
                        var value = self._extractValue(o),
                            display = self._extractDisplay(o);

                        if (!StringUtils.isBlank(value) && !StringUtils.isBlank(display)) {
                            displayTexts.push(display);
                            values.push(value);
                        }
                    });

                    self._setDisplay(displayTexts.join(opts.splitChar));
                    self._setValue(values.join(opts.splitChar));
                }
            };

            var d = new DialogClass(dlgOptions);
            d.show();
        }
    });

    /***********私有方法***********/

    return PopupEditorClass;
});