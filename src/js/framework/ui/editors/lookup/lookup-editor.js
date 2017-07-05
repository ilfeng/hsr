/**
 * 带下拉的编辑组件。
 *
 * @type {class}
 * 
 * @remark
 *     包含下拉面板、清除按钮、下拉按钮。
 */
define(['jquery', 'core', 'ui-editor-dropdown', 'ui-tool-manager', 'jsrender'], function ($, hsr, _super, ToolUtils) {
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
    function LookupEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._dataParams = {};  // 数据参数。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(LookupEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-lookup',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'LookupEditor'
    };

    $.extend(LookupEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(LookupEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(LookupEditorClass.prototype, metedata, {
        /**
         * 加载数据。
         */
        reload: function (data) {
            var self = this;
            
            // 关闭下拉面板。
            self._closeDropdownPanel();
            
            // 重置参数。
            $.extend(self._dataParams, data);
            
            // 清空选择。
            self._clear();
            
            // 加载内容数据。
            self._loadContent();
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
            
            // 添加样式。
            element$.addClass(LookupEditorClass.cssClass);


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
         * 初始化下拉面板。
         * 
         * @param {jQuery} 内容元素。
         * 
         * @protected
         */
        _initializeDropdownPanel: function (content$) {
            var self = this;

            self._lookupContent$ = $('<ul />').on('click', 'li', function () {
                // 查找并填充数据。
                var li$ = $(this), o = li$.data('original');
                if(o) {
                    self._setValue(o);
                    self._setDisplay(o);
                }
                
                // 关闭面板。
                self._closeDropdownPanel();
            }).addClass(this.cssClass + '-content').appendTo(content$);

            // 加载数据。
            self._loadContent();
        },
        /**
         * 打开下拉面板前判断。
         * 
         * @return {boolean} true -- 继续打开；false -- 停止打开。
         */
        _beforeOpenDropdownPanel: function () {
            return true;
        },
        /**
         * 异步加载数据。
         */
        _loadContent: function () {
            var self = this,
                opts = self._options,
                url = opts.url,
                content$ = self._lookupContent$;

            if (hsr.StringUtils.isBlank(url)) return;

            $.ajax({
                url: url,
                type: opts.method,
                data: self._dataParams
            }).done(function (result) {
                if (result.status != "000000") return;

                // 清空容器。
                content$.empty();

                // 依次处理项。
                result.data.forEach(function (o) {
                    // 预处理数据。
                    self._formatItem(o);
                    // 渲染项 HTML, 并添加项到容器。
                    $('<li />').html(self._renderItem(o) || '')
                        .data('original', o)
                        .appendTo(content$);
                });

                // 保留原始值。
                self._originalItems = result.data;
                
                // 恢复选择。
                self._restoreSelected();
            });
        },
        /**
         * 数据预处理（格式化）。
         * 
         * @param {object} 要处理的数据。
         * 
         * @return {object} 处理好的数据。
         */
        _formatItem: function (o) {
            return o;
        },
        /**
         * （使用模板）渲染下拉项。
         * 
         * @param {object} 数据。
         * 
         * @return {string} HTML 字符串。
         */
        _renderItem: function (o) {
            var self = this, tmplItem$O = $.templates(self._options.tmplItem), html;

            // 通过模板渲染。
            if (tmplItem$O) {
                html = tmplItem$O.render(o);
            }

            if(hsr.StringUtils.isBlank(html)) {
                html = self._extractDisplay(o);
            }

            return html;
        },
        /**
         * 恢复选择。
         * 
         * @remark
         *     如果有值，恢复选择的值（查找失败，直接放弃）。
         *     如果无值，但是必选，默认选择第一项。
         */
        _restoreSelected: function () {
            var self = this,
                opts = self._options,
                value = self._getValue(),
                content$ = self._lookupContent$;

            if (hsr.StringUtils.isBlank(value) && opts.required) {
                var o = content$.find('li').eq(0).data('original');
                if (o) {
                    self._setValue(o);
                    self._setDisplay(o);
                }
            } else if (self._originalItems) {
                self._originalItems.forEach(function (o) {
                    if (value == self._extractValue(o)) {
                        self._setDisplay(o);
                        return false;
                    }
                });
            }
        }
    });

    /***********私有方法***********/

    return LookupEditorClass;
});