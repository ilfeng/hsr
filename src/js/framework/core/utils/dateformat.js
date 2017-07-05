/**
 * 日期格式。
 */
define(['ns', 'util-enum'], function (ns, EnumUtils) {

    var DateFromatEnum = {
        /**
         */
        FORMAT_yyyy_MM_dd_hh_mm_ss_S: 'yyyy-MM-dd hh:mm:ss.S',
        /**
         */
        FORMAT_yyyyMMddhhmmssS: 'yyyyMMddhhmmssS',
        /**
         */
        FORMAT_yyyy_MM_dd_hh_mm_ss: 'yyyy-MM-dd hh:mm:ss',
        /**
         */
        FORMAT_yyyyMMddhhmmss: 'yyyyMMddhhmmss'
    };

    // 扩展枚举对象，并锁定之。
    EnumUtils.freeze(DateFromatEnum);

    return ns.DateFormat = DateFromatEnum;
});