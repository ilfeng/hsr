/**
 * 钟表控件。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-control', 'ui-tool-manager', 'ui-dropdown-panel'
], function ($, hsr, _super, ToolUtils, DropdownPanelClass) {
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
    function TextClockClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(TextClockClass, _super);

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
        cssClass: '@CSS_PREFIX@clock-text',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TextClock'
    };

    $.extend(TextClockClass, metedata);

    // 注册组件。
    ToolUtils.regiest(TextClockClass);

    /***********公共(及特权)方法***********/
    $.extend(TextClockClass.prototype, metedata, {
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
            
            self._weekNames = ['日', '一', '二', '三', '四', '五', '六'];
            self._day$ = $('.clock-day', element$);
            self._time$ = $('.clock-time', element$);
            self._week$ = $('.clock-week', element$);

            self._timer = setInterval($.proxy(self._clockTimer, self), 800);
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;
            
            // 销毁树。
            if (self._timer) {
                clearInterval(self._timer);
                self._timer = null;
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
         * 时钟跳动，更新内容。
         */
        _clockTimer: function () {
            var self = this, dtNow = new Date();

            // 日期。
            if(self._day$.length > 0) {
                var day = hsr.DateUtils.format(dtNow, 'yyyy年MM月dd日');
                self._day$.text(day);
            }
            
            // 时间。
            if(self._time$.length > 0) {
                var time = hsr.DateUtils.format(dtNow, 'hh:mm:ss');
                self._time$.text(time);
            }
            
            // 星期。
            if(self._week$.length > 0) {
                var week = dtNow.getDay();
                self._week$.text('星期' + self._weekNames[week]);
            }
        }
    });

    /***********私有方法***********/

    return TextClockClass;
});