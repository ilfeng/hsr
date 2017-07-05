/**
 * 分割控件。
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
    function SplitterClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(SplitterClass, _super);

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
        cssClass: '@CSS_PREFIX@splitter',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Splitter'
    };

    $.extend(SplitterClass, metedata);

    // 注册组件。
    ToolUtils.regiest(SplitterClass);

    /***********公共(及特权)方法***********/
    $.extend(SplitterClass.prototype, metedata, {
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
                { name: 'kind', value: 'horizontal' }  // 面板摆放位置：horizontal -- 水平摆放；vertical -- 垂直摆放。
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

            self._p1$ = $('.@CSS_PREFIX@splitter-panel.panel1', element$);
            self._p2$ = $('.@CSS_PREFIX@splitter-panel.panel2', element$);
            self._bar$ = $('.@CSS_PREFIX@splitter-bar', element$);
            self._barIcon$ = $('.@CSS_PREFIX@splitter-arrow', self._bar$);
            
            // 绑定事件 -- 切换面板。
            $('.@CSS_PREFIX@splitter-handler', self._bar$).on('click', function () {
                self._p1$.toggle();
                self._refreshBar();
                self.refresh();
                
                return false;
            });
            
            // 计算面板大小。
            self._reckoning();
            
            // 刷新工具条。
            self._refreshBar();
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
            
            // 计算面板大小。
            self._reckoning();
        },
        /**
         * 刷新控制条。
         */
        _refreshBar: function () {
            var self = this, kind = self._options.kind;
            var isP1Show = self._p1$.is(':visible'), icon$ = self._barIcon$;

            if (kind == 'horizontal') {
                if (isP1Show) {
                    icon$.removeClass('fa-chevron-right').addClass('fa-chevron-left');
                } else {
                    icon$.removeClass('fa-chevron-left').addClass('fa-chevron-right');
                }
            } else if (kind == 'vertical') {
                if (isP1Show) {
                    icon$.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                } else {
                    icon$.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                }
            }
        },
        _reckoning: function () {
            var self = this, kind = self._options.kind;
            if (kind == 'horizontal') {
                self._reckonH();
            } else if (kind == 'vertical') {
                self._reckonV();
            }
        },
        _reckonH: function () {
            var self = this, width = self._element$.width();
            var p1Width = self._p1$.outerWidth(), barWidth = self._bar$.outerWidth();
            var isP1Show = self._p1$.is(':visible');

            if (!isP1Show) {
                p1Width = 0;
            }

            self._bar$.css({ left: p1Width });
            self._p2$.css({ left: p1Width + barWidth, width: width - p1Width - barWidth });
        },
        _reckonV: function () {
            var self = this, height = self._element$.height();
            var p1Height = self._p1$.outerHeight(), barHeight = self._bar$.outerHeight();
            var isP1Show = self._p1$.is(':visible');

            if (!isP1Show) {
                p1Height = 0;
            }

            self._bar$.css({ top: p1Height });
            self._p2$.css({ top: p1Height + barHeight, height: height - p1Height - barHeight });
        }
    });

    /***********私有方法***********/

    return SplitterClass;
});