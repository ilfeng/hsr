/**
 * 枚举值辅助类。
 *
 * @type {class}
 * @static
 */
define(['ns'], function (ns) {
    'use strict';

    var ENUM_EXTEND_PROP_NAME = '_enum_extend_';

    return (ns.EnumUtils = {
        /**
         * 
         */
        parse: function (enumType, value) {
            if (!enumType.hasOwnProperty(ENUM_EXTEND_PROP_NAME)) {
                throw ('不是有效的枚举类');
            }

            if (value) {
                var enumMap = enumType[ENUM_EXTEND_PROP_NAME];

                if (typeof value == 'string') {
                    var propName = value.toUpperCase();
                    if (enumMap.hasOwnProperty(propName)) {
                        return enumMap[propName];
                    }
                } else if (typeof value == 'number') {
                    if (enumMap.hasOwnProperty(value)) {
                        return value;
                    }
                }
            }

            throw ('不是有效的枚举值');
        },
        /**
         * 锁定枚举类型，不允许修改。
         * 
         * @param {object} enumType 枚举类型。
         */
        freeze: function (enumType) {
            // 查找所有自定义属性以及值，匹配为{大写 : 值}。
            if (!enumType.hasOwnProperty(ENUM_EXTEND_PROP_NAME)) {
                var map = {};

                for (var propName in enumType) {
                    if (enumType.hasOwnProperty(propName)) {
                        var k = propName.toUpperCase(),
                            v = enumType[propName];
                        map[k] = v;
                        map[v] = propName;
                    }
                }

                enumType[ENUM_EXTEND_PROP_NAME] = map;
            }

            if (Object.freeze) {
                // 锁定对象。
                Object.freeze(enumType);
                // 同时锁定原型。
                Object.freeze(Object.getPrototypeOf(enumType));
            }
        }
    });
});
