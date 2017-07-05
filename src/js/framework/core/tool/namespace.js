/**
 * 工具方法。
 */
define(['ns'], function (ns) {
    /**
     * 获取命名空间，如果不存在则创建。
     *
     * @param {string} namespace 命名空间名称。
     * 
     * @returns {object} 命名空间对象。
     */
    ns.ns = function (namespace) {
        if (typeof (namespace) != 'string') return;

        var nn = namespace.split('.'),
            np = window;
        for (var i = 0, len = nn.length, name; i < len, name = nn[i]; i++) {
            np[name] = np[name] || {
                name: namespace
            };
            np = np[name];
        }
        return np;
    };
});
