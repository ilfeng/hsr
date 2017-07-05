/**
 * 工具方法。
 */
define(['ns'], function (ns) {
    /**
     * 对象属性比较器。
     * @param {string | Function} prop 属性名称 或 获取属性的方法。
     * @returns {Function} 比较方法。
     */
    ns.comparer = function (prop) {
        return function (a, b) {
            if (typeof a === 'object' && typeof b === 'object' && a && b) {
                var aProp, bProp;

                if (typeof prop === 'string' && prop) {
                    aProp = a[prop];
                    bProp = b[prop];
                } else if (typeof prop === 'function' && prop) {
                    aProp = prop(a);
                    bProp = prop(b);
                } else {
                    throw ('comparer prop error');
                }

                if (aProp === bProp) {
                    return 0;
                }
                if (typeof aProp === typeof bProp) {
                    return aProp < bProp ? -1 : 1;
                }
                return typeof aProp < typeof bProp ? -1 : 1;
            } else {
                throw ('comparer error');
            }
        };
    };
});
