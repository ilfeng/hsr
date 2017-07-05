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
    function TabbedPanelClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._loading = false;
        self._loaded = false;

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(TabbedPanelClass, _super);

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
        cssClass: '@CSS_PREFIX@tabbed-panel',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TabbedPanel'
    };

    $.extend(TabbedPanelClass, metedata);

    /***********公共(及特权)方法***********/
    $.extend(TabbedPanelClass.prototype, metedata, {
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
            var self = this;
            self._hidden = false;
            self._element$.addClass('@UI_CLASS_ACTIVE@');
            self._loadContent();
            self._onActivated();
            self.refresh();
        },
        /**
         * 设置激活状态。
         * @param {boolean} toActive 要设置的激活状态。
         */
        removeActive: function () {
            var self = this;
            self._hidden = true;
            if (self._element$) {
                self._element$.removeClass('@UI_CLASS_ACTIVE@');
            }
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
                { name: 'fit', value: false },
                { name: 'iframe', value: false }
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
        _loadContent: function () {
            var self = this, options = self._options;
            if (self._loaded) return;
            if (self._loading) return;

            self._onLoading();

            if (options.iframe) {
                self._loadContentWithIframe(options);
            } else {
                self._loadContentWithHtml(options);
            }
        },
        _loadContentWithHtml: function (options) {
            var self = this,
                url = options.url,
                html = options.html;

            if (!url || !html) {
                self._onLoaded();
                return;
            }

            // TODO 加载过程需要使用Loading动画。
            // 通过 ajax 获取 html.
            // 显示等待加载。
            self._element$.html('开始加载……');

            // 开始加载。
            if (typeof (html) == 'string' && !StringUtils.isBlank(html)) {
                if (StringUtils.startWith('#') || $(html).length > 0) {
                    self._element$.html('');
                    self._element$.append($(html));
                } else {
                    self._element$.html(html);
                }
                self._onLoaded();
            } else if (html) {
                if ($(html).length > 0) {
                    self._element$.html('');
                    self._element$.append($(html));
                } else {
                    self._element$.html(html);
                }
                self._onLoaded();
            } else if (!StringUtils.isBlank(url)) {
                $.get(url).done(function (ajaxHtml) {
                    // 加载完成，填充内容。
                    self._element$.html(ajaxHtml);
                }).fail(function () {
                    self._element$.html('加载失败');
                }).always(function () {
                    self._onLoaded();
                });
            } else {
                self._onLoaded();
            }
        },
        _loadContentWithIframe: function (options) {
            var self = this,
                tab = options.tab,
                url = options.url,
                html = options.html;

            if (StringUtils.isBlank(url) && StringUtils.isBlank(html)) {
                self._onLoaded();
                return;
            }

            var iframe$ = $('<iframe frameborder="no" scrolling="no" />')
                .attr('name', tab)
                .css({ height: '100%', width: '100%' })
                .appendTo(self._element$)
                .on('load', function () {
                    self._onLoaded();
                });

            if (!StringUtils.isBlank(url)) {
                iframe$.attr('src', url);
            } else if (!StringUtils.isBlank(html)) {
                iframe$.attr('src', 'about:blank');
                $(iframe$[0].contentWindow.document.body).html(html);
            } else {
                iframe$.attr('src', 'about:blank');
            }
        },
        _onActivated: function () {
            this._fireEvent('@EVENT_TABBED_PANEL_ACTIVATED@');
        },
        _onLoading: function () {
            this._loading = true;
            this._fireEvent('@EVENT_TABBED_PANEL_LOADING@');
        },
        _onLoaded: function () {
            var self = this;
            self._loading = false;
            self._loaded = true;
            self._fireEvent('@EVENT_TABBED_PANEL_LOADED@');
        }
    });

    /***********私有方法***********/

    return TabbedPanelClass;
});