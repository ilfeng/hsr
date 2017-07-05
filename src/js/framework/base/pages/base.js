/**
 * 基础页面。
 *
 * @type {class}
 * 
 * @remark 
 *     当页面为对话框内嵌时，影响对话框。
 */
define(['jquery', 'core', 'base-ns', 'ui'], function ($, hsr, ns, ui) {
    'use strict';

    var _super = ui.Panel,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function BasePageClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._dialogPointer = self._getDialogPointer();  // 对话框指针。
        self._loadingLock = 1;

        // 继承父类。
        _super.call(self, element, options);
            
        // 完成事件。
        setTimeout($.proxy(self._onComplete, self), 100);
    }

    // 继承父类。
    hsr.inherit(BasePageClass, _super);

    /***********元数据***********/
    var metedata = {
        /**
         * 版本。
         * @type {string}
         * @readonly
         */
        version: '@VERSION@',
        /**
         * 样式类。
         * @type {string}
         * @readonly
         */
        cssClass: '@CSS_PREFIX@page',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'BasePage'
    };

    $.extend(BasePageClass, metedata);

    /***********公共(及特权)方法***********/
    $.extend(BasePageClass.prototype, metedata, {
        /**
         * 当页面是对话框时，点击确定触发的方法。
         */
        accept: function () {

        },
        /**
         * 关闭页面，并传达参数。
         * 
         * @param {object} result 对话框返回结果。
         */
        close: function (result) {
            var dialog = this._dialogPointer;
            if (dialog) {
                dialog.close(result);
            }
            return this;
        },
        /**
         * 设置标题。
         * 
         * @param {string} title 标题。
         */
        setTitle: function (title) {
            var dialog = this._dialogPointer;
            if (dialog) {
                dialog.setTitle(title);
            }
            return this;
        },
        /**
         * 设置页面尺寸。
         * 
         * @param {integer | string} height 高度（数字：像素，字符：百分比）。
         * @param {integer | string} width 宽度（数字：像素，字符：百分比）。
         */
        setSize: function (height, width) {
            var dialog = this._dialogPointer;
            if (dialog) {
                dialog.setSize(height, width);
            }
            return this;
        },
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'fit', value: false },
                { name: 'width', value: 0 },
                { name: 'height', value: 0 }
            ];
        },
        /**
         * 创建控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _create: function (element$, options) {
            var self = this;
            _superMethods._create.call(self, element$, options);
            
            // 调整页面所在容器（对话框）的尺寸。
            if (options.width == 0) {
                options.width = element$.css('width');
            }
            if (options.height == 0) {
                options.height = element$.css('height');
            }
            self.setSize(options.height, options.width);
            
            // 
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
        /**
         * 刷新控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _refresh: function (element$, options) {
            var self = this;
            _superMethods._refresh.call(self, element$, options);
        },
        /**
         * 获取根样式类。
         */
        _getRootStyleClass: function () {
            return BasePageClass.cssClass;
        },
        /**
         * 获取对话框指针。
         * 
         * @return {object} 对话框的引用指针。
         */
        _getDialogPointer: function () {
            return window['dialogPointer'];
        },
        /**
         * 获取对话框传入参数。
         * 
         * @return {object} 对话框的传入参数。
         */
        _getDialogParams: function () {
            var dialogPointer = this._getDialogPointer();
            if (dialogPointer) {
                return dialogPointer.getParams();
            }
            return null;
        },
        /**
         * 加载完成事件。
         */
        _onComplete: function () {
            this._fireEvent('complete');
            this._hideLoading();
        },
        _showLoading: function () {
            this._loadingLock++;
            $('#loading-screen').show();
        },
        _hideLoading: function () {
            var self = this;
            self._loadingLock--;
            if (self._loadingLock <= 0) {
                $('#loading-screen').hide();
                self._loadingLock = 0;
            }
        }
    });

    return (ns.BasePage = BasePageClass);
});