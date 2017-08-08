/**
 * 检验模块。
 *
 * @author ilfeng
 * @since 2017-01-05
 */
define(['jquery', 'jquery-validate', 'jquery-validate-messages_zh'], function ($) {
    'use strict';

    //** 如果需要，在此对验证方法进行扩展。**//


    // 密码强度规则：1 -- 长度不小于8位；2 -- 密码中必须含有数字、字母。
    $.validator.addMethod('password', function (value, element, params) {
        var regex = /(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z]).*$/;
        return this.optional(element) || regex.test(value);
    }, '密码不符合要求（必须大于等于8位，且包含数字与字母）');


    // 精度（小数位数）规则：1 -- 数字；2 -- 小数位数。
    $.validator.addMethod('precision', function (value, element, params) {
        var precision = 2;
        if(params && params > 0){
            precision = params;
        }
        var regex = '^[0-9]+(.[0-9]{'+ precision + '})?$';
        return this.optional(element) || new RegExp(regex).test(value);
    }, '小数位数必须小于{0}位');


    // 经度规则：1 -- 数字；2 -- (0, 180)之间；3 -- 六位小数。
    $.validator.addMethod('lng', function (value, element, params) {

    }, '');

    // 纬度规则：1 -- 数字；2 -- (0, 90)之间；3 -- 六位小数。
    $.validator.addMethod('lat', function (value, element, params) {

    }, '');

    // 颜色值。
    $.validator.addMethod('color', function (value, element, params) {
        var regex = /^[a-fA-F0-9]{6}|[a-fA-F0-9]{3}$/;
        return this.optional(element) || regex.test(value);
    }, '请使用 HEX 颜色值');
    

    // 基本设置。
    $.validator.setDefaults({
        debug: false,                      // 调试模式 -- 在控制台有错误提示。
        ignore: '',                        // 开启 hidden 验证。
        errorElement: 'div',               // 容器默认输入错误消息
        errorClass: '@CSS_PREFIX@prompt',  // 默认的输入错误消息类
        errorPlacement: function (error, element) {
            // 设置提示位置。
            if (!element.hasClass('@CSS_PREFIX@editor')) {
                element = element.parents(".@CSS_PREFIX@editor");
            }
            error.insertAfter(element);
        },
        highlight: function (element) {
            $(element).parents('.@CSS_PREFIX@form-group').addClass('@CSS_PREFIX@has-error');
            $(element).parents('.form-group').addClass('@CSS_PREFIX@has-error');
        },
        unhighlight: function (element) {
            $(element).parents('.@CSS_PREFIX@form-group').removeClass('@CSS_PREFIX@has-error');
            $(element).parents('.form-group').removeClass('@CSS_PREFIX@has-error');
        }
    });


});