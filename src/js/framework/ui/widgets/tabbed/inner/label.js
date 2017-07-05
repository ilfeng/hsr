/**
 * 卡片控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-control'], function ($, hsr, _super) {
    'use strict';

    var _superMethods = _super.prototype,
        StringUtils = hsr.StringUtils;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function TabbedLabelClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(TabbedLabelClass, _super);

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
        cssClass: '@CSS_PREFIX@tabbed-label',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TabbedLabel'
    };

    $.extend(TabbedLabelClass, metedata);

    /***********公共(及特权)方法***********/
    $.extend(TabbedLabelClass.prototype, metedata, {
        /**
         * 获取左边距。
         * @returns {number} 左边距。
         */
        getLeft: function () {
            return Math.round(this._element$.position().left);
        },
        /**
         * 获取右边距。
         * @returns {number} 右边距。
         */
        getRight: function () {
            return this.getLeft() + this.getWidth();
        },
        /**
         * 获取宽度。
         * @returns {number} 宽度。
         */
        getWidth: function () {
            return this._element$.outerWidth(true);
        },
        /**
         * 获取是否为激活状态。
         * @returns {number} 是否为激活状态，ture -- 是；false -- 否。
         */
        isActive: function () {
            return this._element$.hasClass('@UI_CLASS_ACTIVE@');
        },
        /**
         * 设置激活状态。
         */
        setActive: function () {
            this._element$.addClass('@UI_CLASS_ACTIVE@');
            this._onActivated();
        },
        /**
         * 设置激活状态。
         * @param {boolean} toActive 要设置的激活状态。
         */
        removeActive: function () {
            this._element$.removeClass('@UI_CLASS_ACTIVE@');
        },
        /**
         * 获取关联卡片标识。
         * @returns {string} 关联卡片标识。
         */
        getTabId: function () {
            return this._options.tab;
        },
        setTabId: function (tabId) {
            this._options.tab = tabId;
        },
        /**
         * 获取关联面板标识。
         * @returns {string} 关联面板标识。
         */
        getPanelId: function () {
            return this._panelId;
        },
        /**
         * 设置关联面板标识。
         * @param {string} id 关联面板标识。
         */
        setPanelId: function (id) {
            this._panelId = id;
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
                { name: 'tab', value: '' },           // 卡片标识。
                { name: 'id', value: '' },            // 识别码。
                { name: 'title', value: '' },         // 标题。
                { name: 'icon', value: '' },          // 图标(CSS Class)。
                { name: 'closable', value: true },    // 是否允许关闭。
                { name: 'content', value: null },     // 内容面板元素（或选择器）。
                { name: 'url', value: null },         // 内容地址。
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

            this._id = options.id = options.id || hsr.UUID.random();

            var link$ = $('a', element$);
            if (link$.length == 0) {
                link$ = $('<a href="#" />').appendTo(element$);
            } else {
                var href = link$.attr('href');
                if (!StringUtils.isBlank(href)) {
                    if (href.length > 2 && StringUtils.startWith(href, '#')) {
                        options.content = href;
                    } else {
                        options.url = href;
                    }
                }
            }

            // 图标。
            var icon$ = link$.children('.@CSS_PREFIX@icon');
            if (icon$.length == 0 && !StringUtils.isBlank(options.icon)) {
                icon$ = $('<i />').addClass('@CSS_PREFIX@icon').addClass(options.icon).appendTo(link$);
            }

            // 标题。
            var content$ = $('span', link$), title = link$.text();
            if (content$.length == 0 && StringUtils.isBlank(title)) {
                content$ = $('<span />').appendTo(link$);
            }
            if (StringUtils.isBlank(options.title)) {
                content$.text('新标签');
            } else {
                content$.text(options.title);
            }

            // 面板。
            var href = link$.attr('href');
            if (!StringUtils.isBlank(href) && StringUtils.startWith(href, '#')) {
                this._panelId = href;
            }

            // 关闭按钮。
            var buttonClose$ = $('.close', element$);
            if (buttonClose$.length == 0) {
                if (options.closable === true) {
                    buttonClose$ = $('<b />').addClass('close').appendTo(link$);
                }
            } else {
                options.closable = true;
            }

            // 点击标签。
            link$.on('click', function () {
                self._onClick();
                return false;
            });

            // 点击关闭。
            buttonClose$.on('click', function () {
                self._onClose();
                return false;
            });
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
        _onClick: function () {
            this._fireEvent('@EVENT_TABBED_LABEL_CLICK@');
        },
        _onActivated: function () {
            this._fireEvent('@EVENT_TABBED_LABEL_ACTIVATED@');
        },
        _onClose: function () {
            this._fireEvent('@EVENT_TABBED_LABEL_CLOSE@');
        }
    });

    /***********私有方法***********/

    return TabbedLabelClass;
});