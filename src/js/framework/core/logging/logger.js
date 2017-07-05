/**
 * 日志类。
 * 
 * @type {class}
 */
define(['jquery', 'ns', 'logging-level'], function ($, ns, LoggingLevel) {
    'use strict';

    /**
     * 构造方法。
     * 
     * @param {number | enum} level 日志级别。
     * 
     * @constructor
     */
    function LoggerClass(level) {
        this.setLevel(level);
    }

    /***********公共(及特权)方法***********/
    $.extend(LoggerClass.prototype, {
        /**
         * 显示消息。
         */
        _message: function (level, msg) {
            if (level >= this._level) {
                var now = new Date(), time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds();

                switch (level) {
                    case LoggingLevel.LEVEL_DEBUG:
                        console.log('DEBUG[' + time + ']: ' + msg);
                        break;
                    case LoggingLevel.LEVEL_INFO:
                        console.info('INFO[' + time + ']: ' + msg);
                        break;
                    case LoggingLevel.LEVEL_WARN:
                        console.warn('WARN[' + time + ']: ' + msg);
                        break;
                    case LoggingLevel.LEVEL_ERROR:
                        console.error('ERROR[' + time + ']: ' + msg);
                        break;
                    case LoggingLevel.LEVEL_FATAL:
                        console.error('FATAL[' + time + ']: ' + msg);
                        break;
                }
            }
        },
        /**
         * 设置级别。
         * 
         * @param {number | enum} level 日志级别。
         * 
         * @remark 如果不设置，默认为 ERROR 级别。
         */
        setLevel: function (level) {
            if ($.isNumeric(level)) {
                if (level < LoggingLevel.LEVEL_DEBUG) {
                    level = LoggingLevel.LEVEL_DEBUG;
                } else if (level > LoggingLevel.LEVEL_FATAL) {
                    level = LoggingLevel.LEVEL_FATAL;
                }
            } else {
                level = LoggingLevel.LEVEL_ERROR;
            }
            this._level = level;
        },
        /**
         * 显示 DEBUG 级别消息。
         * 
         * @param {string} msg 要显示的消息。
         */
        debug: function (msg) {
            this._message(LoggingLevel.LEVEL_DEBUG, msg);
        },
        /**
         * 显示 INFO 级别消息。
         * 
         * @param {string} msg 要显示的消息。
         */
        info: function (msg) {
            this._message(LoggingLevel.LEVEL_INFO, msg);
        },
        /**
         * 显示 WARN 级别消息。
         * 
         * @param {string} msg 要显示的消息。
         */
        warn: function (msg) {
            this._message(LoggingLevel.LEVEL_WARN, msg);
        },
        /**
         * 显示 ERROR 级别消息。
         * 
         * @param {string} msg 要显示的消息。
         */
        error: function (msg) {
            this._message(LoggingLevel.LEVEL_ERROR, msg);
        },
        /**
         * 显示 FATAL 级别消息。
         * 
         * @param {string} msg 要显示的消息。
         */
        fatal: function (msg) {
            this._message(LoggingLevel.LEVEL_FATAL, msg);
        }
    });

    return ns.Logger = LoggerClass;
});