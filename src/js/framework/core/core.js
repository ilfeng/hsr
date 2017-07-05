/**
 * 
 */
define(['jquery', 'ns',
    'event-object',
    'dictionary',
    'logging-logger', 'logging-level',
    'tool-namespace', 'tool-inherit', 'tool-comparer',
    'util-array', 'util-boolean', 'util-date', 'util-dateformat', 'util-enum', 'util-string', 'util-url', 'util-uuid', 'util-websocket'
], function ($, ns) {

    // 日志单例。
    ns.logger = new ns.Logger();

    // 空白调用对象。
    ns.EMPTY_AJAX_DEFERRED = $.Deferred(function (dfd) {
        dfd.resolve({ status: 0, data: [] });
    }).promise();

    // 注册全局变量。
    return (window[ns.name] = ns);
});
