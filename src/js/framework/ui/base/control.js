/**
 * 可视控件基类。
 *
 * @type {class}
 */
define([
    'jquery', 'core',
    'ui-tool-manager', 'ui-tool-options', 'ui-tool-cache',
    'jsrender'
], function ($, hsr, ToolUtils, OptionUtils, CacheUtils) {
    'use strict';

    var _super = hsr.EventObject,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function ControlClass(element, options) {
        var self = this;
        // 参数调整。
        if ($.isPlainObject(element)) {
            // 主元素是基本对象。
            options = $.extend(true, {}, options, element);
            element = null;
        }

        // 主元素。
        self._element$ = $(element);

        // 配置参数。
        self._originalOptions = $.extend(true, {}, options);
        self._options = self._createOptions(options);

        // 是否已经销毁。
        self._destroyed = false;

        // 继承父类。
        _super.call(self);
    }

    // 继承父类。
    hsr.inherit(ControlClass, _super);

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
        cssClass: '@CSS_PREFIX@control',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Control'
    };

    $.extend(ControlClass, metedata);

    // 注册组件（基类）。
    ToolUtils.regiestBaseClass(ControlClass);

    /***********公共(及特权)方法***********/
    $.extend(ControlClass.prototype, metedata, {
        ////////////////////// 元素管理 ////////////////////
        /**
         * 获取主元素。
         *
         * @returns {jQuery} 主元素。
         */
        getElement: function () {
            return this._element$;
        },
        /**
         * 获取标识。
         * @returns {string} 获取标识。
         */
        getId: function () {
            return this._id;
        },
        /**
         * 设置大小。
         *
         * @returns {object} 控件实例。
         */
        setSize: function (size) {
            if (!size) return;

            // 获取元素的原始大小。
            var elem$ = this._element$,
                oWidth = elem$.outerWidth(),
                oHeight = elem$.outerHeight();

            if (size.width) {
                oWidth = size.width;
            }
            if (size.height) {
                oHeight = size.height;
            }

            elem$.css({
                width: oWidth,
                height: oHeight
            });

            // 刷新控件。
            setTimeout($.proxy(this.refresh, this), 0);

            // 触发更改事件。
            this._onResize();

            return this;
        },
        hide: function () {
            var self = this, element$ = self._element$;
            if (element$.is(':visible')) {
                self._element$.hide();
                self.refresh();
            } else {
                self._element$.hide();
            }
            return this;
        },
        show: function () {
            var self = this, element$ = self._element$;
            if (element$.is(':hidden')) {
                self._element$.show();
                self.refresh();
            } else {
                self._element$.show();
            }
            return this;
        },
        ////////////////////// 控件创建 ////////////////////
        /**
         * 初始化。
         *
         * @protected
         */
        _init: function () {
            var self = this;
            // 渲染控件。
            self._render(self._element$, self._options);
            // 绑定控件（添加控件动作）。
            self._create(self._element$, self._options);
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
            // 序号。
            var id = element$.attr('id') || element$.selector || '';
            if (hsr.StringUtils.isBlank(id)) {
                id = hsr.UUID.random();
            }
            self._id = id;
            // 是否隐藏。
            self._hidden = element$.is(':hidden');
            // 缓存控件实例到元素中。
            CacheUtils.setCache(element$, self);
            // 添加样式。
            element$.addClass(ControlClass.cssClass);
            // 添加控件样式。
            element$.addClass(self.cssClass);
            // TODO 继承父组件样式。
            // self._addSuperStyle();
        },
        /**
         * 销毁控件。
         *
         * @returns {object} 控件实例。
         */
        destroy: function () {
            var self = this;
            if (!self._destroyed) {
                self._destroyChildren();
                self._destroy();
                self._destroyed = true;
            }
            return this;
        },
        /**
         * 销毁子控件。
         *
         * @protected
         */
        _destroyChildren: function () {
        },
        /**
         * 销毁控件本身。
         *
         * @protected
         */
        _destroy: function () {
            var self = this, elem$ = self._element$;
            if (elem$) {
                if (CacheUtils.getCache(elem$) == this) {
                    // 清空缓存。
                    CacheUtils.clearCache(elem$);
                    // 从父节点中移除自身。
                    elem$.remove();
                }
                self._element$ = null;
            }
        },
        /**
         * 获取子控件集合。
         *
         * @protected
         *
         * @remark 参考 easyui 并参见 http://ju.outofmemory.cn/entry/88524
         */
        _getChildren: function (container$) {
            var self = this,
                containers$ = container$ || self._element$;

            if (!containers$ || containers$.length == 0) {
                throw '不存在的元素';
            }

            var element = containers$[0],
                _isBodyElem = (element == $('body')[0]);

            // 过滤有效的子控件。
            // filter: 返回 true 是有效元素。
            return containers$.find('.' + ControlClass.cssClass).filter(function (index) {
                var p = $(this).parents('.' + ControlClass.cssClass + ':first');
                if (_isBodyElem) {
                    return p.length == 0;
                } else {
                    return p[0] == element;
                }
            }).map(function () {
                return CacheUtils.getCache($(this));
            }).get();
        },
        ////////////////////// 控件渲染 ////////////////////
        /**
         * 渲染控件。
         *
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         *
         * @protected
         */
        _render: function (element$, options) {
            var html = this._renderControl(options);
            if (!hsr.StringUtils.isBlank(html)) {
                element$.empty().html(html);
            }
        },
        /**
         * 生成控件 HTML 结构。
         *
         * @param {object} options 配置项。
         *
         * @return {string} HTML 结构字符串。
         *
         * @remark
         *    默认使用模板生成控件 HTML 结构。
         *
         * @protected
         */
        _renderControl: function (options) {
            var tmpl = options.tmpl;
            if (!tmpl) return;
            var tmpl$ = $.templates(options.tmpl);
            if (!tmpl$) return;

            return tmpl$.render(options) || '';
        },
        ////////////////////// 配置管理 ////////////////////
        /**
         * 获取配置信息。
         *
         * @returns {object} 配置信息。
         */
        getOptions: function () {
            return this._options;
        },
        /**
         * 设置配置信息。
         *
         * @param {object} options 配置信息。
         */
        setOptions: function (options) {
            $.extend(true, this._options, options);
            return this;
        },
        /**
         * 创建配置信息。
         *
         * @param {object} options 自定义配置信息。
         *
         * @returns {object} 配置信息。
         *
         * @protected
         */
        _createOptions: function (options) {
            var properties = OptionUtils.createOptionProperties(this),
                defaultOptions = OptionUtils.parseDefaultOptions(properties),
                dataOptions = OptionUtils.parseDataOptions(this._element$, properties);
            return $.extend(true, {}, defaultOptions, dataOptions, options);
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
                { name: 'tmpl', value: null }
            ];
        },
        ////////////////////// 刷新控件 ////////////////////
        /**
         * 刷新控件。
         * 
         * @returns {object} 控件实例。
         */
        refresh: function () {
            var self = this, elem$ = self._element$, opts = self._options;
            self._refresh(elem$, opts);
            self._refreshChildren(elem$, opts);
            return self;
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
        },
        /**
         * 刷新子控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _refreshChildren: function (element$, options) {
        },
        ////////////////////// 事件清单 ////////////////////
        /**
         * 触发事件。
         * 
         * @param eventName 事件名称。
         * @param data 事件附带数据。
         * 
         * @returns 事件返回值。
         * 
         * @protected
         */
        _fireEvent: function (eventName, data) {
            var self = this;
            // TODO 如何管理元素事件和组件事件。
            var superResult = _superMethods._fireEvent.call(self, eventName, data);
            
            // 生成事件。
            var event = $.Event(eventName + '@EVENT_POSTFIX@');

            // 设置事件参数。
            var args = Array.prototype.slice.call(arguments);
            args[0] = self;

            // 激发事件。
            self._element$.triggerHandler(event, args);

            // 返回事件的返回值。
            return event.result;
        },
        /**
         * 控件改变自身尺寸后触发此事件。
         * 
         * @protected
         */
        _onResize: function () {
            this._fireEvent('resize');
        },
        ////////////////////// 样式 ////////////////////
        /**
         * 循环添加
         */
        _addSuperStyle: function () {
            var elem$ = this._element$, _parent = this.__proto__;
            while (_parent && _parent.cssClass) {
                elem$.addClass(_parent.cssClass);
                _parent = _parent.prototype;
            }
        }
    });

    /***********私有方法***********/

    return ControlClass;
});