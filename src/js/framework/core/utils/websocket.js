define(['jquery', 'ns'], function ($, ns) {
    'use strict';

    // 缓存。
    var _sockectCaches = [];

    /**
     * 根据地址获取缓存对象。
     * 
     * @param {string} url 地址。
     */
    function __findCacheByUrl(url) {
        var cache;
        _sockectCaches.forEach(function (o) {
            if (o.url == url) {
                cache = o;
                return false;
            }
        });
        return cache;
    }

    return (ns.WebSocketUtils = {
        /**
         * 注册。
         * 
         * @param {string} url 连接地址。
         * @param {function} funcCallback 响应方法。
         * 
         * @remark 如果地址相同，会把所有注册的方法组装成方法链。 
         *         当 Websocket 回调时，会依次调用方法链上的注册方法。
         */
        register: function (url, funcCallback) {
            if (!window.WebSocket) return;

            // 获取缓存。
            var socketCache = __findCacheByUrl(url);
            if (socketCache) {
                // 已经存在，扩展方法链。
                socketCache.callbacks.add(funcCallback);
            } else {
                // 不存在，创建 Websocket 与方法链，并添加到缓存。
                
                // 创建方法链。
                var callbacks = $.Callbacks();
                callbacks.add(funcCallback);

                // 创建 Websocket 。
                var hostname = window.location.hostname,
                    port = window.location.port,
                    baseUrl = hostname + ':' + port,
                    socket = new WebSocket('ws://' + baseUrl + url);

                socket.onmessage = function (event) {
                    if (event.status != 0 && funcCallback) {
                        var json = JSON.parse(event.data);
                        callbacks.fire(json);
                    }
                };

                // 添加到缓存。
                _sockectCaches.push({
                    url: url,
                    callbacks: callbacks,
                    socket: socket
                });
            }
        }
    });
});
