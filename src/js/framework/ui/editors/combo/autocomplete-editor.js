/**
 * 带提示的编辑组件。
 *
 * @type {class}
 * 
 * @remark
 *     使用 jQuery UI 的自动完成组件。
 */
define(['jquery', 'core', 'ui-editor', 'ui-tool-manager', 'jqueryui'], function ($, hsr, _super, ToolUtils) {
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
    function AutoCompleteEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._dataParams = {};  // 数据参数。
        
        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(AutoCompleteEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-autocomplate',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'AutoCompleteEditor'
    };

    $.extend(AutoCompleteEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(AutoCompleteEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(AutoCompleteEditorClass.prototype, metedata, {
        setParams: function (data) {
            $.extend(this._dataParams, data);
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
                { name: 'kind', value: 0 },  // 处理方式，0 -- 文本；1 -- 转序号。
                { name: 'url', value: '' },  // 获取数据的地址。
                { name: 'method', value: 'get' },  // 请求方式。
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

            if (options.kind == 0) {
                self._createForDisplay(element$, options);
            } else if (options.kind == 1) {
                self._createForValue(element$, options);
            }
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
        _createForDisplay: function (element$, options) {
            var self = this;

            self._display$.autocomplete({
                source: function (request, response) {
                    $.ajax({
                        type: options.method,
                        url: options.url,
                        data: $.extend({
                            queryItemValue: request.term
                        }, self._dataParams),
                        success: function (result) {
                            if (result.status != "000000") return;
                            if (result.data != null && result.data != '') {
                                response($.map(result.data, function (item) {
                                    return {
                                        value: self._extractValue(item),
                                        label: self._extractDisplay(item)
                                    };
                                }));
                            }
                        }
                    });
                },
                minLength: 1,
                cache: false
            });
        },
        _createForValue: function (element$, options) {
            var self = this;

            self._display$.autocomplete({
                source: function (request, response) {
                    $.ajax({
                        type: options.method,
                        url: options.url,
                        data: $.extend({
                            queryItemValue: request.term
                        }, self._dataParams),
                        success: function (result) {
                            if (result.status != "000000") return;
                            if (result.data != null && result.data != '') {
                                response($.map(result.data, function (item) {
                                    return {
                                        value: self._extractDisplay(item),  // 显示值。
                                        key: self._extractValue(item)       // 索引值。
                                    };
                                }));
                            }
                        }
                    });
                },
                minLength: 1,
                cache: false,
                select: function (event, dropdownList) {
                    // 选择了一项内容，把选择的项赋值到相应的文本框中。
                    if (dropdownList && dropdownList.item) {
                        self._setDisplay(dropdownList.item.value);
                        self._setValue(dropdownList.item.key);
                    } else {
                        self._setValue('');
                    }
                    // 回车过滤。
                    var code = (event.keyCode ? event.keyCode : event.which);
                    if (code == 13) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    return false;
                },
                change: function (event, dropdownList) {
                    // 选择了一项内容，把选择的项赋值到相应的文本框中。
                    if (dropdownList == null || dropdownList.item == null) {
                        self._setValue('');
                    }
                }
            });
        }
    });

    /***********私有方法***********/

    return AutoCompleteEditorClass;
});