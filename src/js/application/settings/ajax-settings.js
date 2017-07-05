
define(['jquery', 'core'],
    function ($, hsr) {
        'use strict';

        return {
            register: function () {
                /*
                 * 当传递参数为一个key多个value时value为数组
                 * p: ["123", "456", "789"]
                 */
                $.ajaxSettings.traditional = true;
                /*
                 * 设置AJAX的全局默认选项
                 */
                $.ajaxSetup({
                    global: true,
                    cache: false,
                    statusCode: {
                        400: function (data) {
                            // 请求无效 -- 参数不正确.

                        },
                        401: function (data) {
                            // 未授权 -- 未登录或 Session 已经过期.
                            hsr.logger.warn(data.responseText);

                            if (hsr.app) {
                                hsr.app.exit();
                            } else {
                                // 页面跳转。
                                window.top.location.href = '/';
                            }
                        },
                        403: function (data) {
                            // 禁止访问 -- 没有权限.

                        },
                        404: function (data) {
                            // 无法找到文件 -- 地址不正确.

                        },
                        405: function (data) {
                            // 不允许的 HTTP 方法 -- GET POST 错误.

                        },
                        500: function (data) {
                            // 内部服务器错误 -- 其它异常（数据库链接错误等）.
                            hsr.logger.error(data.responseText);
                        }
                    }
                });
            }
        };
    });