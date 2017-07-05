define(['jquery', 'core', 'ui-ns'], function ($, hsr, ns) {
    'use strict';

    /**
     * 网格行的选择方式。
     * @readonly
     * @enum {number}
     */
    var SelectModeEnum = {
        /**
         * 不支持选择。
         */
        NONE: 0,
        /**
         * 单选。
         */
        SINGLE: 1,
        /**
         * 多选。
         */
        MULTIPLE: 2
    };

    // 扩展枚举对象，并锁定之。
    hsr.EnumUtils.freeze(SelectModeEnum);

    return (ns.SelectMode = SelectModeEnum);
});