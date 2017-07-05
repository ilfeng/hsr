/**
 * 对话框控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-control', 'ui-tool-manager', 'ui-enum-dialogResult', 'art-dialog'], function ($, hsr, _super, ToolUtils, DialogResultEnum) {
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
    function DialogClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        
        // 参数判断。
        if ($.isPlainObject(element)) {
            options = element;
            element = null;
        }

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(DialogClass, _super);

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
        cssClass: '@CSS_PREFIX@dialog',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Dialog'
    };

    $.extend(DialogClass, metedata);

    // 注册组件。
    ToolUtils.regiest(DialogClass);

    /***********公共(及特权)方法***********/
    $.extend(DialogClass.prototype, metedata, {
        /**
         * 显示对话框。
         */
        show: function () {
            var self = this;
            if (self._dlgOriginal) {
                self._dlgOriginal.showModal();
            }
            return self;
        },
        /**
         * 隐藏对话框。
         */
        hide: function () {
            var dlg = this._dlgOriginal;
            if (dlg) {
                dlg.close();
            }
            return self;
        },
        /**
         * 关闭对话框，并传达参数。
         * 
         * @param {object} result 对话框返回结果。
         */
        close: function (result) {
            var dlg = this._dlgOriginal;
            if (dlg) {
                dlg.close(result).remove();
            }
            return this;
        },
        /**
         * 设置标题。
         * 
         * @param {string} title 标题。
         */
        setTitle: function (title) {
            var dlg = this._dlgOriginal;
            if (dlg) {
                dlg.title(title);
            }
            return this;
        },
        /**
         * 调整大小。
         * 
         * @param {integer | string} height 高度（数字：像素，字符：百分比）。
         * @param {integer | string} width 宽度（数字：像素，字符：百分比）。
         */
        setSize: function (height, width) {
            var dlg = this._dlgOriginal;
            if (dlg) {
                var reckonPix = function (prop, value) {
                    if (typeof value == 'string' && value.indexOf('%') > 0) {
                        value = $(window)[prop]() * parseFloat(value) / 100;
                    }
                    return value;
                };
                
                // 对话框头尾高度。
                var dlgNode$ = $(dlg.node);
                var dlgHeaderHeight = $('[i="header"]', dlgNode$).outerHeight();
                var dlgFooterHeight = $('[i="footer"]', dlgNode$).outerHeight();
                
                // 设置高度。
                height = reckonPix('height', height) - dlgHeaderHeight - dlgFooterHeight - 10;
                dlg.height(height);
                
                // 设置宽度。
                width = reckonPix('width', width);
                dlg.width(width);
            }
            return this;
        },
        /**
         * 获取传入参数。
         * 
         * @return {object} 传入参数。
         */
        getParams: function() {
            var self = this;
            return self._options.data;
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
            
            // 建立对话框。
            var dlgOpts = self._createOriginalOptions(element$, options);

            // 检测是否加载了对话框插件。
            if (window.top.dialog) {
                // 创建对话框。
                self._dlgOriginal = window.top.dialog(dlgOpts);
                // 缓存。
                self._cacheWrapper();
            }
        },
        /**
         * 创建原始对话框配置信息。
         */
        _createOriginalOptions: function (element$, options) {
            var self = this;

            var dlgOpts = {
                id: options.id,
                title: options.title,
                url: options.url,
                data: options.data,
                padding: 0,
                cancelValue: '关闭',
                okValue: '确定',
                onremove: function () {
                    if (options.onClose) {
                        options.onClose.call(self, this.returnValue);
                    }
                    
                    // 清除原始对话框引用。
                    delete self._dlgOriginal;
                    // 销毁包装器。
                    self.destroy();
                }
            };
            
            // 按钮。
            if (options.buttons) {
                var buttons = [];

                options.buttons.forEach(function (o) {
                    buttons.push({
                        value: o.text,
                        callback: o.handler,
                        autofocus: o.autofocus
                    });
                });

                dlgOpts.button = buttons;
            }

            return dlgOpts;
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var dlg = this._dlgOriginal;
            
            // 移除原始对话框。
            if (dlg) {
                // 先关闭对话框。
                if (dlg.open) {
                    dlg.close();
                }
                // 移除对话框。
                dlg.remove();
            }

            _superMethods._destroy.call(this);
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
         * 缓存包装器。
         */
        _cacheWrapper: function () {
            var dlg = this._dlgOriginal, iframe;
            if (dlg && (iframe = dlg.iframeNode)) {
                // 缓存当前对象。
                iframe.contentWindow['dialogPointer'] = this;
            }
        },
        /**
         * 获取内部页面引用。
         * 
         * @param {object} dailogOriginal 原始对话框。
         */
        _getPagePointer: function (dailogOriginal) {
            var iframe = dailogOriginal.iframeNode, fw;
            if (iframe && (fw = iframe.contentWindow)) {
                return fw['pageHandler'];
            }
            return null;
        }
    });

    /***********私有方法***********/

    return DialogClass;
});