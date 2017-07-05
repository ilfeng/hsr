/**
 * 数组辅助类。
 * 仅能处理number string 不能处理对象
 * @type {class}
 * @static
 */
define(['ns'], function (ns) {
    'use strict';

    return (ns.ArrayUtils = {
        /**
         * 去重。
         * fn 对数组中的元素进行处理
         */
        distinct: function (array, fn) {
            if (!Array.isArray(array)) return [];
            if (typeof (fn) != 'function') fn = null;

            return array.reduce(function (newArray, oldArrayValue) {
                var value = fn ? fn(oldArrayValue) : oldArrayValue;
                if (newArray.indexOf(value) == -1) {
                    newArray.push(value);
                }
                return newArray;
            }, []);
        },
        /**
         * 并集。并去重
         */
        union: function (a, b) {
            if (!Array.isArray(a) || !Array.isArray(b)) return [];

            return a.concat(b.filter(function(v) { return a.indexOf(v) === -1 }));
        },
        /**
         * 交集 。
         */
        intersect: function (a, b) {
            if (!Array.isArray(a) || !Array.isArray(b)) return [];

            return a.filter(function(v){ return b.indexOf(v) > -1 });
        },
        /**
         * 差集。
         */
        except: function (a, b) {
            if (!Array.isArray(a) || !Array.isArray(b)) return [];

            return a.filter(function(v){ return b.indexOf(v) === -1 }).concat(b.filter(function(v){ return a.indexOf(v) === -1 }));
        },
        /**
         * 补集。
         */
        complement: function (a, b) {
            if (!Array.isArray(a) || !Array.isArray(b)) return [];

            return b.filter(function(v){ return a.indexOf(v) === -1 });
        }
    });
});
