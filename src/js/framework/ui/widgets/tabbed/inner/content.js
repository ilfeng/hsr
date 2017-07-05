/**
 * 卡片控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-control', 'tabbed-panel'], function ($, hsr, _super, TabbedPanelClass) {
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
    function TabbedContentClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._panelOs = new hsr.Dictionary();
        self._activePanelO = null;

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(TabbedContentClass, _super);

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
        cssClass: '@CSS_PREFIX@tabbed-content',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TabbedContent'
    };

    $.extend(TabbedContentClass, metedata);

    /***********公共(及特权)方法***********/
    $.extend(TabbedContentClass.prototype, metedata, {
        /**
         * 添加面板。
         * @param {PlainObject} options 面板配置。
         */
        addPanel: function (options) {
            return this._addPanel(options);
        },
        /**
         * 移除指定面板。
         * @param {number} id 面板标识符。
         */
        removePanel: function (id) {
            var panelO = this._getPanelById(id);
            if (panelO) {
                this._removePanel(panelO);
            }
        },
        /**
         * 移除所有面板。
         * @private
         */
        clearPanels: function () {
            var self = this;
            self._panelOs.forEach(function (o) {
                o.destroy();
                self._onPanelRemoved(o);
            });
            self._panelOs.clear();
        },
        /**
         * 根据标识获取面板。
         * @param {string} id 面板标识。
         */
        getPanelById: function (id) {
            return this._getPanelById(id);
        },
        /**
         * 设置指定面板为激活的面板。
         * @param {number} id 面板标识符。
         */
        setActivePanel: function (id) {
            var panelO = this._getPanelById(id);
            if (panelO) {
                this._showPanel(panelO);
            }
        },
        /**
         * 获取激活的面板。
         * @returns {TabbedPanel} 激活的面板。
         */
        getActivePanel: function () {
            return this._activePanelO;
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

            element$.children('.@CSS_PREFIX@tabbed-panel').each(function () {
                var panelO = self._createPanel($(this));

                if (panelO.isActive()) {
                    self._activePanelO = panelO;
                }
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
            this._panelOs.forEach(function (o) {
                o.refresh();
            });
        },
        /**
         * 添加面板。
         * @param {PlainObject} cfg 卡片面板配置。
         * @private
         */
        _addPanel: function (options) {
            var self = this,
                id = options.id = self._createPanelId(options),
                panelO = self._getPanelById(options.id);

            if (!panelO) {
                // 创建面板。
                var panelDom$ = $('#' + options.id);
                if (panelDom$.length == 0) {
                    panelDom$ = $('<div />')
                        .attr('id', id)
                        .addClass('@CSS_PREFIX@tabbed-panel')
                        .appendTo(self._element$);
                }

                panelO = self._createPanel(panelDom$, options);
            }

            return panelO;
        },
        /**
         * 生成标签序号。
         * @param {PlainObject} options 面板配置。
         * @returns {string} 标签序号。
         * @private
         */
        _createPanelId: function (options) {
            return options.id || 'tp-' + options.tab;
        },
        /**
         * 添加面板。
         * @param {jQuery} elem$ 面板配置。
         * @param {PlainObject} options 面板配置。
         * @private
         */
        _createPanel: function (element$, options) {
            var self = this, panelId = element$.attr('id'), panels = self._options.panels, panelO;

            // 绑定已经注册过的面板。
            if (!hsr.StringUtils.isBlank(panelId) && panels && panels.length > 0) {
                for (var i = 0, l = panels.length; i < l; i++) {
                    var p = panels[i];
                    if (p.getId() == panelId) {
                        panelO = p;
                        break;
                    }
                }
            }
            if (!panelO) {
                // 构建新面板。
                if (options && options.onCreate) {
                    panelO = options.onCreate.call(self, element$, options);
                }

                if (!panelO) {
                    panelO = new TabbedPanelClass(element$, options);
                }
            }

            panelO.on('@EVENT_TABBED_PANEL_ACTIVATED@', function (event, sender, data) {
                self._onPanelActivated(sender);
            });

            self._panelOs.set(panelO.getId(), panelO);
            self._onPanelAdded(panelO);

            return panelO;
        },
        /**
         * 移除面板。
         * @param {TabbedPanel} panelO 卡片面板。
         * @private
         */
        _removePanel: function (panelO) {
            // 从集合中移除。
            this._panelOs.remove(panelO.getId());

            panelO.destroy();

            this._onPanelRemoved(panelO);
        },
        /**
         * 显示面板。
         * @param {TabbedPanel} panelO 卡片面板。
         * @private
         */
        _showPanel: function (panelO) {
            // 显示面板前必须保证容器显示。
            this.show();

            // 标签不是激活的，设置内容并激活。
            if (!panelO.isActive()) {
                panelO.setActive();

                this._onPanelActivated(panelO);
            }
        },
        /**
         * 根据标识符获取面板。
         * @param {number} id 标识符。
         * @returns {TabbedPanel} 具有焦点的面板。
         * @private
         */
        _getPanelById: function (id) {
            if (this._panelOs.has(id)) {
                return this._panelOs.get(id);
            }
            return null;
        },
        /**
         * 。
         * @param {TabbedPanel} panelO 面板。
         * @private
         */
        _onPanelAdded: function (panelO) {
            this._fireEvent('@EVENT_TABBED_PANEL_ADDED@', panelO);
        },
        /**
         * 。
         * @param {TabbedPanel} panelO 面板。
         * @private
         */
        _onPanelActivated: function (panelO) {
            var self = this;
            var activePanelO = self._activePanelO;

            if (activePanelO != null && activePanelO.getId() == panelO.getId()) {
                return;
            }

            if (activePanelO != null) {
                activePanelO.removeActive();
            }

            self._activePanelO = panelO;
            self._fireEvent('@EVENT_TABBED_PANEL_ACTIVATED@', panelO);
        },
        /**
         * 。
         * @param {TabbedPanel} panelO 面板。
         * @private
         */
        _onPanelRemoved: function (panelO) {
            this._fireEvent('@EVENT_TABBED_PANEL_REMOVED@', panelO);
        }
    });

    /***********私有方法***********/

    return TabbedContentClass;
});