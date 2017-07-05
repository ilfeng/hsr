/**
 * 事件基类。
 * 
 * @type {class}
 */
define(['jquery', 'ns'], function ($, ns) {
    'use strict';

    /**
     * 构造方法。
     * 
     * @constructor
     */
    function EventObjectClass() {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._event$ = $(self);

        // 初始化。
        self._init();
    }

    /***********公共(及特权)方法***********/
    $.extend(EventObjectClass.prototype, {
        /**
         * 初始化。
         */
        _init: function () {
        },
        /**
         * 销毁。
         */
        destroy: function () {
            var self = this;
            self._event$ = null;
            self._destroy();
            return self;
        },
        /**
         * 销毁本身。
         *
         * @protected
         */
        _destroy: function () {
        },
        /**
         * 绑定事件。
         * 
         * @param events 事件名称集合（以空格分割）。
         * @param data 事件触发时传递的数据。
         * @param handler 事件处理方法。
         * 
         * @returns {object} 控件自身。
         */
        on: function (events, data, handler) {
            this._event$.on(events, data, handler);
            return this;
        },
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
            // 生成事件。
            var event = $.Event(eventName);

            // 设置事件参数。
            var args = Array.prototype.slice.call(arguments);
            args[0] = this;

            // 激发事件。
            this._event$.triggerHandler(event, args);

            // 返回事件的返回值。
            return event.result;
        }
    });

    return (ns.EventObject = EventObjectClass);
});