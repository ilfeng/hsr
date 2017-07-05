/**
 * 。
 *
 * @type {class}
 */
define(['jquery', 'core', 'base'], function ($, hsr, base) {
    'use strict';

    var _super = base.Application,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     *
     * @param {object} options 配置项。
     *
     * @constructor
     */
    function ApplicationClass(options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        options = options || {};

        // 继承父类。
        _super.call(self, options);
    }

    // 继承父类。
    hsr.inherit(ApplicationClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(ApplicationClass.prototype, {
        exit: function () {
            window.top.location.href = '/';
        },
        /**
         * 创建控件。
         *
         * @param {object} options 配置项。
         *
         * @protected
         */
        _init: function (options) {
            var self = this;
            _superMethods._init.call(self, options);

            // 加载项目配置。
            // self._loadConfiguration();

            // 全局服务。

            // 定时器。
        },
        /**
         * 销毁控件本身。
         *
         * @protected
         */
        _destroy: function () {
            var self = this;
            _superMethods._destroy.call(self);
        },
        ////////////////////// 项目配置 ////////////////////
        _loadConfiguration: function () {
            var options = this._options;

            // 使用同步方法。
            // $.ajax({
            //     url: '/projectconfig',
            //     async: false
            // }).done(function (result) {
            //     if (result.status != 0 || result.data.length == 0) return;
            //
            //     var config = result.data[0];
            //
            //     options.map = $.extend(true, options.map, {
            //         kind: config.mapType,
            //         addressKind: config.mapAddress,
            //         lng: config.lng,
            //         lat: config.lat,
            //         zoom: config.zoom,
            //         area: '',
            //         routeKind: config.routeKind,
            //         vehicleIconKind: config.carMarkerType,
            //         vehicleLabelTmpl: config.vehicleLabelTmpl,
            //         personIconKind: config.personMarkerKind,
            //         vehicleTrack: hsr.BooleanUtils.parse(config.vehicleTrack),
            //         layerCity: config.layerCity
            //     });
            // });
        },
        ////////////////////// 特定功能 ////////////////////
        /**
         * 打开用户密码修改页面。
         */
        openChangePwd: function () {
            var url = '/user/goChangePwd';

            hsr.app.openEditDialog({ id: 'changePwd', title: '密码修改', url: url });
        },
        ////////////////////// 待实现方法 ////////////////////
        /**
         * 打开内容视图。
         */
        openViewContent: function () {

        },
    });

    return ApplicationClass;
});