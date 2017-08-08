/* global dialog */
define(['jquery', 'ui-ns', 'art-dialog', 'gritter'], function ($, ns) {
    'use strict';

    /**
     * 消息提示框。
     * @type {class}
     */
    var MessageBox = {
        alert: function (msg, okCallbackFunc, options) {
            if (!window.dialog) return;

            var opts = $.extend(true, {
                height: '8em',
                width: '20em'
            }, options);

            var content = ['<div class="msg-icon"><i></i></div>'];
            content.push('<div class="msg-content">');
            content.push(msg);
            content.push('</div>');

            dialog({
                skin: '@CSS_PREFIX@messagebox @CSS_PREFIX@messagebox-alert',
                title: '提醒',
                content: content.join(''),
                height: opts.height,
                width: opts.width,
                okValue: '确定',
                ok: function () {
                    if (okCallbackFunc) {
                        return okCallbackFunc.call(this);
                    }
                }
            }).showModal();
        },
        confirm: function (msg, okCallbackFunc, options) {
            if (!window.dialog) return;

            var opts = $.extend(true, {
                height: '8em',
                width: '20em'
            }, options);

            var content = ['<div class="msg-icon"><i></i></div>'];
            content.push('<div class="msg-content">');
            content.push(msg);
            content.push('</div>');

            dialog({
                skin: '@CSS_PREFIX@messagebox @CSS_PREFIX@messagebox-confirm',
                title: '请确认',
                content: content.join(''),
                height: opts.height,
                width: opts.width,
                okValue: '确定',
                ok: function () {
                    if (okCallbackFunc) {
                        return okCallbackFunc.call(this);
                    }
                },
                cancelValue: '取消',
                cancel: function () { }
            }).showModal();
        },
        info: function (msg, title, options) {
            if (!$.gritter) return;

            if (typeof title == 'object' && !options) {
                options = title;
                title = '';
            }

            var opts = $.extend(true, {
                sticky: false,
                time: '3000'
            }, options);

            $.gritter.add({
                title: title || '提示',
                text: msg || '',
                image: '/dist/img/messagebox/info.png',
                // 是否锁定。
                sticky: opts.sticky,
                // 自动消失时，停留的时间（单位：毫秒）。
                time: opts.time,
                class_name: '@CSS_PREFIX@messagebox @CSS_PREFIX@messagebox-info'
            });
        },
        warn: function (msg, title, options) {
            if (!$.gritter) return;

            if (typeof title == 'object' && !options) {
                options = title;
                title = '';
            }

            var opts = $.extend(true, {
                sticky: false,
                time: '3000'
            }, options);

            $.gritter.add({
                title: title || '警告',
                text: msg || '',
                image: '/dist/img/messagebox/warn.png',
                // 是否锁定。
                sticky: opts.sticky,
                // 自动消失时，停留的时间（单位：毫秒）。
                time: opts.time,
                class_name: '@CSS_PREFIX@messagebox @CSS_PREFIX@messagebox-warn'
            });
        },
        error: function (msg, title, options) {
            if (!$.gritter) return;

            if (typeof title == 'object' && !options) {
                options = title;
                title = '';
            }

            var opts = $.extend(true, {
                sticky: false,
                time: '3000'
            }, options);

            $.gritter.add({
                title: title || '错误',
                text: msg || '',
                image: '/dist/img/messagebox/error.png',
                // 是否锁定。
                sticky: opts.sticky,
                // 自动消失时，停留的时间（单位：毫秒）。
                time: opts.time,
                class_name: '@CSS_PREFIX@messagebox @CSS_PREFIX@messagebox-error'
            });
        }
    };

    return (ns.MessageBox = MessageBox);
});
