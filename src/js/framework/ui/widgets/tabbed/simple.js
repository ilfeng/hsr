/**
 * 卡片控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-panel', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function TabbedClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._compact = true; // 紧凑模式。

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
        cssClass: '@CSS_PREFIX@tabbed',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Tabbed'
    };

    $.extend(TabbedClass, metedata);

    // 注册组件。
    ToolUtils.regiest(TabbedClass);

    /***********公共(及特权)方法***********/
    $.extend(TabbedClass.prototype, metedata, {
        /**
         * 选中卡片。
         */
        select: function () {

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
                { name: 'content', value: '' }
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
            
            // 获取标签容器、面板容器。
            self._bar$ = $('.@CSS_PREFIX@tabbed-bar');
            self._labels$ = $('.@CSS_PREFIX@tabbed-nav', element$.children('.@CSS_PREFIX@tabbed-bar'));
            if (hsr.StringUtils.isBlank(options.content)) {
                self._content$ = element$.children('.@CSS_PREFIX@tabbed-content');
                self._compact = true;
            } else {
                self._content$ = $(options.content);
                self._compact = false;
            }

            self._tabPanel$s = self._content$.children('.@CSS_PREFIX@tabbed-panel');
            self._tabPanel$s.addClass('@CSS_PREFIX@control');

            // 标签点击事件：切换面板。
            self._labels$.on('click', '.@CSS_PREFIX@tabbed-label > a', function () {
                var link$ = $(this), label$ = link$.parent(), href = link$.attr('href');

                if (!label$.hasClass('@UI_CLASS_ACTIVE@')) {
                    // 取消标签选中，取消面板显示。
                    var activeLabel$ = $('.@CSS_PREFIX@tabbed-label.@UI_CLASS_ACTIVE@', self._labels$),
                        activeHref = activeLabel$.children('a').attr('href');
                    var nextPanel$ = $(href);

                    activeLabel$.removeClass('@UI_CLASS_ACTIVE@');
                    $(activeHref).removeClass('@UI_CLASS_ACTIVE@');
                    
                    // 选中当前标签及面板。
                    label$.addClass('@UI_CLASS_ACTIVE@');
                    nextPanel$.addClass('@UI_CLASS_ACTIVE@');
                    
                    // 自动刷新显示的面板。
                    self.refresh();

                    self._onTabChange(label$, nextPanel$);
                }

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

            var barHeight = options.barIgnore ? 0 : self._bar$.outerHeight();
            var width = '100%', height = (element$.height() - barHeight) + 'px';
            self._content$.css({ width: width, height: height });
            self._tabPanel$s.css({ width: width, height: height });
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