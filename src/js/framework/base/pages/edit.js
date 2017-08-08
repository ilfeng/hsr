/**
 * 基础编辑页面。
 *
 * @type {class}
 */
define(['jquery', 'core', 'base-ns', 'base-page-base', 'jquery-validate-messages_zh', 'jquery-form'], function ($, hsr, ns, _super) {
    'use strict';

    var _superMethods = _super.prototype;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function EditPageClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(EditPageClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(EditPageClass.prototype, {
        /**
         * 当页面是对话框时，点击确定触发的方法。
         */
        accept: function () {
            var self = this;
            if (self._form$) {
                self._form$.submit();
            }
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
            
            // 表单处理。
            self._loading$ = $('#loading-screen');
            self._form$ = element$.children('form');
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
        _beforeSave: function () {
            var self = this;
            if (self._options.beforeSave) {
                return self._options.beforeSave.call(self);
            }
            return true;
        },
        _afterSave: function (result) {
            var self = this;
            if (self._options.afterSave) {
                return self._options.afterSave.call(self, result);
            }
            return true;
        },
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
                        hsr.app.info(ro.msg);
                        // 关闭对话框。
                        self.close(hsr.ui.DialogResult.OK);
                    } else {
                        // 保存失败 -- 提示失败信息。
                        hsr.app.warn(ro.msg);
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

    return (ns.EditPage = EditPageClass);
});