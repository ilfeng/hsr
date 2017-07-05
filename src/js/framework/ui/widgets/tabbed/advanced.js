/**
 * 卡片控件。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-panel', 'ui-tool-manager', 'tabbed-bar', 'tabbed-bar-scroll', 'tabbed-content'
], function ($, hsr, _super, ToolUtils, TabbedBarClass, TabbedScrollBarClass, TabbedContentClass) {
    'use strict';

    var _superMethods = _super.prototype,
        StringUtils = hsr.StringUtils;

    /**
     * 默认卡片配置。
     * @private
     */
    var DEFATUL_TAB_OPTIONS = {
        id: '',              // 识别码。
        title: '',           // 标题。
        icon: '',            // 图标(CSS Class)。
        closable: true,      // 是否允许关闭。
        content: null,       // 内容面板元素（或选择器）。
        url: '',             // 内容地址。
        html: '',            // 内容 HTML 。
        iframe: false        // 是否使用框架。
    };

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function TabbedClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._compact = true; // 紧凑模式。
        self._tabOs = new hsr.Dictionary();
        self._barOnly = false;

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(TabbedClass, _super);

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
        cssClass: '@CSS_PREFIX@tabbed-adv',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TabbedAdv'
    };

    $.extend(TabbedClass, metedata);

    // 注册组件。
    ToolUtils.regiest(TabbedClass);

    /***********公共(及特权)方法***********/
    $.extend(TabbedClass.prototype, metedata, {
        /**
         * 添加卡片。
         * @param {TabOptions} options 卡片配置。
         */
        addTab: function (options) {
            var cfg = $.extend(true, {}, DEFATUL_TAB_OPTIONS, options);
            var tab = this._createTab(cfg);

            this._barO.addLabel(tab.labelOptions);
        },
        /**
         * 关闭卡片。
         * @param {string} id 卡片标识。
         */
        closeTab: function (id) {
            var tab = this._getTabById(id);
            if (tab) {
                this._barO.removeLabel(tab.labelOptions.id);
            }
        },
        /**
         * 关闭所有卡片。
         */
        clearTab: function () {
            this._barO.clearLabel();
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
                { name: 'fit', value: true },
                { name: 'barIgnore', value: false },
                { name: 'content', value: '' },
                { name: 'max', value: 20 },
                { name: 'scrollable', value: false }
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
            element$.addClass('@CSS_PREFIX@tabbed');
            
            // 构建标签条。
            self._bar$ = element$.children('.@CSS_PREFIX@tabbed-bar');
            if (self._bar$.length == 0) {
                self._bar$ = $('<div />').addClass('@CSS_PREFIX@tabbed-bar').prependTo(element$);
            }
            if (options.scrollable) {
                self._barO = new TabbedScrollBarClass(self._bar$, {
                    max: options.max
                });
            } else {
                self._barO = new TabbedBarClass(self._bar$);
            }

            self._barO.on('@EVENT_TABBED_LABEL_ACTIVATED@', function (event, sender, data) {
                // 激活对应面板。
                var tabO = self._getTabById(data.getTabId());
                if (tabO && tabO.panel) {
                    tabO.panel.setActive();
                }
                return false;
            }).on('@EVENT_TABBED_LABEL_ADDED@', function (event, sender, data) {
                // 添加面板。
                var tabO = self._getTabById(data.getTabId());
                if (tabO) {
                    tabO.panel = self._addPanel(tabO.panelOptions);
                }
                return false;
            }).on('@EVENT_TABBED_LABEL_REMOVED@', function (event, sender, data) {
                // 移除对应面板。
                var tabO = self._getTabById(data.getTabId());
                if (tabO && tabO.panel) {
                    self._removeTab(tabO);
                }
                return false;
            }).on('@EVENT_TABBED_LABELS_OVERFLOW@', function (event, sender, data) {
                self._onTabsOverflow();
                return false;
            }).on('@EVENT_TABBED_LABELS_EMPTY@', function (event, sender, data) {
                self._clearTab();
                return false;
            });

            // 构建内容区。1 -- 有传入，传入是字符串；2 -- 有传入，传入是元素；3 -- 无传入，自动查找或构建。
            if (options.content) {
                self._barOnly = true;

                var contentSelector = options.content;
                if (typeof options.content == 'string' && !StringUtils.isBlank(options.content) && !StringUtils.startWith(options.content, '#')) {
                    contentSelector = '#' + contentSelector;
                }

                self._content$ = $(contentSelector).addClass('@CSS_PREFIX@tabbed-content');
                if (self._content$.length == 0) {
                    throw new Error('无法找到工作区。');
                }
            } else {
                self._content$ = element$.children('.@CSS_PREFIX@tabbed-bar');
                if (self._content$.length == 0) {
                    self._content$ = $('<div />').addClass('@CSS_PREFIX@tabbed-bar').appendTo(element$);
                }
            }
            self._contentO = new TabbedContentClass(self._content$, {
                panels: options.panels
            });

            // 根据标签建立联系。
            var labelOs = self._barO.getLabels();
            labelOs.forEach(function (o) {
                var tabOptions = {
                    closable: false,
                    url: o.getPanelId()
                };
                var tab = self._createTab(tabOptions);
                o.setTabId(tab.id);
                tab.label = o;
                tab.panel = self._addPanel(tab.panelOptions);
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
        /**
         * 刷新子控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _refreshChildren: function (element$, options) {
            var self = this;
            var container$ = self._content$.children('.@CSS_PREFIX@tabbed-panel.@UI_CLASS_ACTIVE@');
            this._getChildren(container$).forEach(function (o) {
                o.refresh();
            });
        },
        _createTabNameById: function (id) {
            if (StringUtils.startWith(id, 'tab-')) {
                return id;
            }
            return 'tab-' + id;
        },
        _getTabById: function (id) {
            var name = this._createTabNameById(id);
            if (this._tabOs && this._tabOs.has(name)) {
                return this._tabOs.get(name);
            }
            return null;
        },
        _createTab: function (options, panel) {
            var id = options.id || hsr.UUID.random(),
                name = this._createTabNameById(id),
                url = options.url;

            var labelOptions = {
                tab: id,
                title: options.title,
                closable: options.closable,
                url: url
            };
            var panelOptions = {
                tab: id,
                url: url,
                html: options.html,
                iframe: options.iframe,
                onCreate: options.onCreatePanel
            };

            if (!StringUtils.isBlank(url) && StringUtils.startWith(url, '#')) {
                panelOptions.id = url.substr(1, url.length - 1);
                panelOptions.url = '';
            }

            var tab = {
                id: id,
                name: name,
                options: options,
                labelOptions: labelOptions,
                panelOptions: panelOptions,
                label: null,
                panel: null
            };

            this._tabOs.set(name, tab);

            return tab;
        },
        _addPanel: function (options) {
            return this._contentO.addPanel(options);
        },
        _removeTab: function (tabO) {
            var self = this;
            self._onTabRemove(tabO.id);
            var panel = tabO.panel;
            if (panel) {
                self._contentO.removePanel(panel.getId());
            }
            self._tabOs.remove(tabO.name);
        },
        _clearTabs: function () {
            var self = this;
            self._tabOs.forEach(function (o) {
                self.onTabRemove(o.id);
            });

            self._contentO.clearPanel();
            self._tabOs.clear();

            self._onTabsEmpty();
        },
        _onTabRemove: function (tabId) {
            this._fireEvent('@EVENT_TABBED_TAB_REMOVE@', tabId);
        },
        _onTabsOverflow: function () {
            this._fireEvent('@EVENT_TABBED_TABS_OVERFLOW@');
        },
        _onTabsEmpty: function () {
            this._fireEvent('@EVENT_TABBED_TABS_EMPTY@');
        },
        /**
         * 标签切换事件。
         */
        _onTabChange: function (activeLabel$, activePanel$) {
            this._fireEvent('tabchange', { activeLabel: activeLabel$, activePanel: activePanel$ });
        }
    });

    /***********私有方法***********/

    return TabbedClass;
});