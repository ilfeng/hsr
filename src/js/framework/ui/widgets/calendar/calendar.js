/**
 * 日历控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-panel', 'ui-tool-manager', 'calendar-utils'], function ($, hsr, _super, ToolUtils, CalendarUtils) {
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
    function CalendarClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。 
    hsr.inherit(CalendarClass, _super);

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
        cssClass: '@CSS_PREFIX@calendar',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Calendar'
    };

    $.extend(CalendarClass, metedata);

    // 注册组件。
    ToolUtils.regiest(CalendarClass);

    /***********公共(及特权)方法***********/
    $.extend(CalendarClass.prototype, metedata, {
        changeDate: function (year, month, day) {

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
                { name: 'firstWeek', value: 1 }, // 第一行星期（周日为 0，周一为 1）。
                { name: 'fill', value: false }  // 前后补齐。
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
                
            // 使用当前日期创建日历。
            var date = new Date();

            self._createCalendarElement(element$, options, date);
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
         * 
         */
        _createCalendarElement: function (element$, options, date) {
            // 清空日历。
            element$.empty();

            var calendarElement$ = $('<ul></ul>').appendTo(element$);

            var currentYear = date.getFullYear(), currentMonth = date.getMonth(), currentDay = date.getDate(),
                currentItems = CalendarUtils.createCalendar(currentYear, currentMonth, currentDay);

            date.setMonth(currentMonth - 1);
            var prevYear = date.getFullYear(), prevMonth = date.getMonth(), prevDay = date.getDate(),
                prevItems = CalendarUtils.createCalendar(prevYear, prevMonth, prevDay);

            date.setMonth(prevMonth + 2);
            var nextYear = date.getFullYear(), nextMonth = date.getMonth(), nextDay = date.getDate(),
                nextItems = CalendarUtils.createCalendar(nextYear, nextMonth, nextDay);

            for (var i = 0; i < 42; i++) {
                var sD = i - currentItems.firstWeek, calendarDayElement$;

                if (sD > -1 && sD < currentItems.length) {
                    calendarDayElement$ = this._createCalendarDayElement(currentItems[sD]);
                } else {
                    calendarDayElement$ = this._createEmptyDayElement();
                }

                calendarDayElement$.appendTo(calendarElement$);
            }
        },
        _createEmptyDayElement: function () {
            return $('<li></li>');
        },
        _createCalendarDayElement: function (itemDay) {
            var dayElement$ = $('<li></li>');

            dayElement$.text(itemDay.sDay + '  ' + CalendarUtils.getLunarDayName(itemDay.lDay));

            return dayElement$;
        }
    });

    /***********私有方法***********/

    return CalendarClass;
});