/**
 * 登陆页。
 *
 * @type {class}
 *
 * @remark
 *     包含：固定的顶部、左侧菜单、中心选项卡式视图。
 */
define([
    'jquery', 'core', 'base', 'jquery-backstretch'
], function ($, hsr, base) {
    'use strict';

    var _super = base.BasePage,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     *
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     *
     * @constructor
     */
    function ShellClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(ShellClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(ShellClass.prototype, {
        start: function () {
            var self = this;
        },
        /**
         * 创建配置属性。
         *
         * @returns {array} 配置属性信息。
         *
         * @protected
         */
        _createOptionProperties: function () {
            return [];
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
            // 菜单项目。
            self._initBackGround(element$);

            // 表单处理。
            self._loading$ = $('#loading-screen');
            self._errorinfo$ = element$.find('.hsrui-errorinfo');
            self._form$ = element$.find('form');

            self._form$.validate({
                submitHandler: function (form) {
                    self._save();
                    return false;
                }
            });
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
         * 加载完成事件。
         */
        _onComplete: function () {
            this.refresh();
            _superMethods._onComplete.call(this);
        },
        /**
         * 初始化背景。
         */
        _initBackGround: function (element$) {
            var self = this;

            // 背景。
            element$.backstretch();
        },
        /**
         * 检验输入项目。
         * @returns {boolean} 检验是否成功。
         * @protected
         */
        _validate: function () {
            var self = this;
            if (self._options.validate) {
                return self._options.validate.call(self);
            }
            return true;
        },
        _createFormOptions: function () {
            return {};
        },
        /**
         * ajax保存前执行
         * @returns {*}
         * @private
         */
        _beforeSave: function () {
            var self = this;
            if (self._options.beforeSave) {
                return self._options.beforeSave.call(self);
            }
            return true;
        },
        /**
         * ajax保存后执行
         * @param result
         * @returns {*}
         * @private
         */
        _afterSave: function (result) {
            var self = this;
            if (self._options.afterSave) {
                return self._options.afterSave.call(self, result);
            }
            return true;
        },
        /**
         * ajax保存
         * @private
         */
        _save: function () {

            var self = this,
                form$ = this._form$,
                loading$ = self._loading$;
            //加载中
            if(loading$){
                loading$.show();
            }

            // 保存前检验。
            if (!self._validate()) {
                return;
            }

            // 保存前处理。
            if (!self._beforeSave()) {
                return;
            }

            var formOptions = $.extend({}, {
                type: 'POST',
                url: this._options.saveUrl,
                success: function (result) {
                    // 数据提交结束。
                    if (!self._afterSave(result)) {
                        return;
                    }

                    var ro = result;
                    if (typeof result == 'string') {
                        ro = JSON.parse(result);
                    }

                    // 返回数据处理。
                    if (ro.status == '000000') {
                        // 保存成功。
                        // hsr.app.info(ro.msg);
                        // 关闭对话框。
                        // self.close(hsr.ui.DialogResult.OK);
                        //需要跳转的地址
                        window.location.href="/index";
                    } else {
                        // 保存失败 -- 提示失败信息。
                        self._errorinfo$.html(ro.msg);
                        // hsr.app.warn(ro.msg);
                    }

                    if(loading$){
                        loading$.hide();
                    }
                },
                error: function(result){
                    hsr.app.warn("未知错误");
                    if(loading$){
                        loading$.hide();
                    }
                }
            }, self._createFormOptions());

            // 提交数据。
            form$.ajaxSubmit(formOptions);
        }
    });

    /***********私有方法***********/

    return ShellClass;
});