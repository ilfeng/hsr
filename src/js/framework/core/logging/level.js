/**
 * 日志级别。
 */
define(['ns', 'util-enum'], function (ns, EnumUtils) {

    var LoggingLevelEnum = {
        /**
         * 调试。
         */
        LEVEL_DEBUG: 0,
        /**
         * 消息。
         */
        LEVEL_INFO: 1,
        /**
         * 警告。
         */
        LEVEL_WARN: 2,
        /**
         * 错误。
         */
        LEVEL_ERROR: 3,
        /**
         * 严重错误。
         */
        LEVEL_FATAL: 4
    };
    
    // 扩展枚举对象，并锁定之。
    EnumUtils.freeze(LoggingLevelEnum);

    return ns.LoggingLevel = LoggingLevelEnum;
});