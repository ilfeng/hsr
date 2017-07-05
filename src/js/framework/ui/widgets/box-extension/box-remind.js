/**
 * 提醒盒组件。
 * 
 * @remark 包含查询条件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-box', 'ui-tool-manager', 'jsrender'], function ($, hsr, _super, ToolUtils) {
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
    function RemindBoxClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(RemindBoxClass, _super);

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
        cssClass: '@CSS_PREFIX@box-remind',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'RemindBox'
    };

    $.extend(RemindBoxClass, metedata);

    // 注册组件。
    ToolUtils.regiest(RemindBoxClass);

    /***********公共(及特权)方法***********/
    $.extend(RemindBoxClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'fit', value: false },  // 是否撑满父元素。
                { name: 'url', value: '' }, // 数据地址。
                { name: 'tmplItem', value: null }, // 项目模板选择器，例如：“#tmpl”。
                { name: 'container', value: '.@CSS_PREFIX@remind-container' }, // 容器选择器。
                { name: 'interval', value: 600 },  // 刷新间隔（单位：秒）。
                { name: 'beforRenderItem', kind: 'function', scope: window } // 数据预处理。
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

            // 容器。
            self._remindContainer$ = $(options.container, element$);

            if (!hsr.StringUtils.isBlank(options.tmplItem)) {
                self._tmplItem$O = $.templates(options.tmplItem);
            }

            if (!hsr.StringUtils.isBlank(options.url) && self._tmplItem$O && self._remindContainer$.length > 0) {
                // 启动定时器。
                if (options.interval > 0) {
                    self._timer = setInterval($.proxy(self._loadData, self), options.interval * 1000);
                }

                // 加载数据。
                setTimeout($.proxy(self._loadData, self), 0);
            }
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;

            if (self._timer) {
                clearInterval(self._timer);
            }

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
         * 加载数据。
         */
        _loadData: function () {
            var self = this, remindContainer$ = self._remindContainer$;

            // 获取数据并显示。
            $.get(self._options.url).done(function (result) {
                if (result.status != 0) return;
                
                // 清空内容。
                remindContainer$.empty();

                result.data.forEach(function (o) {
                    // 预处理项。
                    var po = self._beforRenderItem(o);
                    // 渲染项。
                    var html = self._renderItem(po);
                    // 添加项到容器中。
                    remindContainer$.append(html);
                });
            });
        },
        _beforRenderItem: function (o) {
            var func = this._options.beforRenderItem;
            if (func) {
                return func.call(o);
            } else {
                return o;
            }
        },
        _renderItem: function (o) {
            return this._tmplItem$O.render(o);
        }
    });

    /***********私有方法***********/

    return RemindBoxClass;
});