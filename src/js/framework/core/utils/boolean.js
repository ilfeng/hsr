/**
 * 布尔值辅助类。
 *
 * @type {class}
 * @static
 */
define(['ns'], function (ns) {
    'use strict';

    return (ns.BooleanUtils = {
        /**
         *
         */
        parse: function (data) {
            if (data === 'false') {
                return false;
            }
            if (data === 'true') {
                return true;
            }
            return Boolean(data);
        }
    });
});
