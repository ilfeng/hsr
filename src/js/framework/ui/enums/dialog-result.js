define(['jquery', 'core', 'ui-ns'], function ($, hsr, ns) {
    'use strict';

    /**
     * 指定对话框返回值。
     * @readonly
     * @enum {number}
     */
    var DialogResultEnum = {
        /**
         * 不确定。
         */
        NONE: 0,
        /**
         * 点击取消按钮返回。
         */
        CANCEL: 1,
        /**
         * 点击确定按钮返回。
         */
        OK: 2
    };

    // 扩展枚举对象，并锁定之。
    hsr.EnumUtils.freeze(DialogResultEnum);

    return (ns.DialogResult = DialogResultEnum);
});