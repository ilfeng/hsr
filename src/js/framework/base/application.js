/**
 * 应用程序基类。
 *
 * @type {class}
 */
define(['jquery', 'core', 'base-ns', 'ui'], function ($, hsr, ns, ui) {
    'use strict';

    var _super = hsr.EventObject,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */

    function ApplicationClass(options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        this._options = options;

        // 继承父类。
        _super.call(self);
    }

    // 继承父类。
    hsr.inherit(ApplicationClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(ApplicationClass.prototype, {
        /**
         * 获取配置。
         * 
         * @return {object} 配置信息。
         */
        getOptions: function() {
            return this._options;  
        },
        /**
         * 初始化。
         * 
         * @protected
         */
        _init: function () {
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
        ////////////////////// 浏览器窗口管理 ////////////////////
        openLink: function (options) {
            if(!options) return;
            
            var url = options.url, name = options.name, opts = [];

            if(hsr.StringUtils.isBlank(url)) return;


            window.open(url, name, opts.join(','));
        },
        ////////////////////// 消息管理 ////////////////////
        /**
         * 显示提示消息。
         * 
         * @param {string} msg 提示的消息。
         * @param {function} okCallbackFunc
         */
        alert : function(msg, options){
        	hsr.ui.MessageBox.alert(msg, options);
        },
        /**
         * 显示询问消息。
         * 
         * @param {string} msg 提示的消息。
         * @param {function} okCallbackFunc
         */
        confirm : function (msg, okCallbackFunc, options) {
            hsr.ui.MessageBox.confirm(msg, okCallbackFunc, options);
        },
        /**
         * 显示提示消息。
         * 
         * @param {string} msg 提示的消息。
         */
        info : function (msg, options) {
            hsr.ui.MessageBox.info(msg, options);
        },
        /**
         * 显示警告消息。
         * 
         * @param {string} msg 提示的消息。
         */
        warn : function (msg, options) {
            hsr.ui.MessageBox.warn(msg, options);
        },
        /**
         * 显示错误消息。
         * 
         * @param {string} msg 提示的消息。
         */
        error : function (msg, options) {
            hsr.ui.MessageBox.error(msg, options);
        },
        ////////////////////// 对话框管理 ////////////////////
        openDialog: function (options) {
            var dialog = new ui.Dialog(options);
            dialog.show();
        },
        openDetailDialog: function (options) {
            var opts = $.extend(true, {}, {
                id: 'dialog-edit',
                title: '编辑',
                buttons: [{
                    text: '取消'
                }, {
                    text: '确定',
                    autofocus: true
                }]
            }, options);

            this.openDialog(opts);
        },
        openEditDialog: function (options) {
            var opts = $.extend(true, {}, {
                id: 'dialog-edit',
                title: '编辑',
                buttons: [{
                    text: '取消'
                }, {
                    text: '保存',
                    handler: function () {
                        var iframe = this.iframeNode;
                        if (iframe) {
                            var pageHandler = iframe.contentWindow['pageHandler'];
                            if (pageHandler && pageHandler.accept) {
                                pageHandler.accept();
                            }
                            return false;
                        }
                    },
                    autofocus: true
                }]
            }, options);

            this.openDialog(opts);
        }
        ////////////////////// 子页面管理 ////////////////////
    });

    return (ns.Application = ApplicationClass);
});