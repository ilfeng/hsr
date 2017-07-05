/**
 * UUID 类。
 *
 * @type {class}
 * @static
 */
define(['ns'], function (ns) {
    'use strict';

    return (ns.UUID = {
        /**
         * 生成新的标识符字符串。
         *
         * @param {boolean} isStandard 是否为遵循标准（使用连接符'-'）。默认为不遵循（false）。
         * 
         * @returns {string} 生成的标识符字符串。
         */
        random: function (isStandard) {
            var C = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
                F = [],
                D = Math.random,
                E, connector;

            if (isStandard) {
                connector = '-';
            } else {
                connector = '';
            }

            F[8] = F[13] = F[18] = F[23] = connector;

            F[14] = '4';

            for (var i = 0; i < 36; i++) {
                if (!F[i]) {
                    E = 0 | D() * 16;
                    F[i] = C[(i == 19) ? (E & 3) | 8 : E & 15];
                }
            }

            return F.join('');
        }
    });
});
