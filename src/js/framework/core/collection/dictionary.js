/**
 * 字典类。
 *
 * @type {class}
 */
define(['jquery', 'ns'], function ($, ns) {
    'use strict';

    // 私有方法。
    var __wrapKey = function (original) {
        if (original == null) {
            throw 'key must not empty.';
        }
        if (typeof (original) != 'string' && typeof (original) != 'number') {
            throw 'key must be string or number.';
        }

        return 'key-' + original;
    }, __unwrapKey = function (wrapper) {
        return wrapper.replace('key-', '');
    }, __wrapValue = function (original, order) {
        return { __order__: order, value: original };
    }, __unwrapValue = function (wrapper) {
        return wrapper.value;
    };

    /**
     * 创建字典类。
     * @constructor
     */
    function DictionaryClass() {
        this.__container = {};
        this.__order = 0;
        this.__length = 0;
    }

    // 公共方法。
    $.extend(DictionaryClass.prototype, {
        size: function () {
            return this.__length;
        },
        isEmpty: function () {
            return this.__length == 0;
        },
        has: function (key) {
            var nk = __wrapKey(key);
            return nk in this.__container;
        },
        get: function (key) {
            var nk = __wrapKey(key);
            var wrapper = this.__container[nk];
            if (wrapper) {
                return __unwrapValue(wrapper);
            }
            return null;
        },
        set: function (key, value) {
            var self = this;
            var nk = __wrapKey(key);
            if (nk in self.__container) {
                return;
            }
            // 添加次序。
            self.__container[nk] = __wrapValue(value, self.__order++);
            self.__length++;
        },
        remove: function (key) {
            var self = this;
            var nk = __wrapKey(key);
            if (nk in self.__container) {
                delete self.__container[nk];
                self.__length--;
            }
        },
        clear: function () {
            var self = this;
            var c = self.__container;
            for (var key in c) {
                delete c[key];
            }
            self.__length = 0;
            self.__order = 0;
        },
        forEach: function (func) {
            if (!func || typeof func != 'function') return;

            var c = this.__container;
            for (var key in c) {
                var uValue = __unwrapValue(c[key]),
                    uKey = __unwrapKey(key);
                func(uValue, uKey);
            }
        },
        getKeys: function () {
            var c = this.__container, key;
            var keys = [];

            for (var key in c) {
                keys.push(key);
            }
            
            return keys;
        },
        /**
         * 获取所有值的集合。
         * @param {boolean} inverted 是否倒叙, true--倒叙。
         * @returns {Array} 值的集合。
         */
        getValues: function (inverted) {
            var c = this.__container,
                wrappers = [],
                key, wrapper;

            for (var key in c) {
                wrapper = c[key];
                wrappers.push(wrapper);
            }

            if (inverted === true) {
                wrappers = wrappers.sort(function (a, b) {
                    if (a.__order__ == b.__order__)
                        return 0;
                    if (a.__order__ < b.__order__)
                        return 1;
                    else
                        return -1;
                });
            } else {
                wrappers = wrappers.sort(function (a, b) {
                    if (a.__order__ == b.__order__)
                        return 0;
                    if (a.__order__ < b.__order__)
                        return -1;
                    else
                        return 1;
                });
            }

            return wrappers.map(__unwrapValue);
        }
    });

    return ns.Dictionary = DictionaryClass;
});
