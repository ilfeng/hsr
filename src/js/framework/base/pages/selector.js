/**
 * 基础选择页面。
 *
 * @type {class}
 */
define(['jquery', 'core', 'base-ns', 'base-page-base'], function ($, hsr, ns, _super) {
    'use strict';

    var _superMethods = _super.prototype;
    var CLASS_CHECKED = 'fa-check-square-o',
        CLASS_UNCHECK = 'fa-square-o',
        CLASS_SELECTED = '@UI_CLASS_SELECTED@',
        SELECTOR_ITEM = '.selector-item',
        SELECTED_ITEM = '.selected-item';

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function SelectorPageClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。
    hsr.inherit(SelectorPageClass, _super);
    
    /***********公共(及特权)方法***********/
    $.extend(SelectorPageClass.prototype, {
        accept: function () {
            var result = [];
            
            //获取选中区域的项目
            $(SELECTED_ITEM, self._container$).each(function () {
                var div$ = $(this);

                result.push(div$.data());
            });

            this.close(result);
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
            var self = this, dialogParams = self._getDialogParams();
            _superMethods._create.call(self, element$, options);

            // 查询条件。
            self._formCondition$ = $('.hsrui-form-condition', element$);

            // 查询按钮绑定。
            $('.hsrui-btn-search', self._formCondition$).on('click', function () {
                self._onSearchButtonClick();
                return false;
            });
            // 取消按钮绑定。
            $('.hsrui-btn-clear', self._formCondition$).on('click', function () {
                self._onClearButtonClick();
                return false;
            });
			
            // 获取数据容器。
            self._container$ = $('.hsrui-container', element$);
            // 绑定容器事件。
            //self._bindContainerEvent();
            
            // 全选按钮。
            $('input[name="checkAll"]', self._element$).on('change', function () {
                var radio$ = $(this), checked = radio$.prop('checked');
                if (checked) {
                    $(SELECTOR_ITEM, self._container$).each(function (ai, ao) {
                        if (!$(ao).hasClass(CLASS_SELECTED)) {
                            $(ao).addClass(CLASS_SELECTED).find('i').removeClass(CLASS_UNCHECK).addClass(CLASS_CHECKED);
                            //在选中区域增加对应项
                            $('<div class="selected-item" data-' + dialogParams.fieldValue + '="' + $(ao).attr("data-"+dialogParams.fieldValue) + '" data-'+dialogParams.fieldDisplay+'="' + $(ao).attr("data-"+dialogParams.fieldDisplay) + '">' + $(ao).attr("data-"+dialogParams.fieldDisplay) + '<i class="fa fa-remove"></i></div>').on('click', function (i, o) {
                                var node = $(this);
                                $(SELECTOR_ITEM, self._container$).each(function (ai, ao) {
                                    if (node.attr('data-'+dialogParams.fieldValue) == $(ao).attr('data-'+dialogParams.fieldValue)) {
                                        $(ao).removeClass(CLASS_SELECTED).find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                                    }
                                });
                                node.remove();
                            }).appendTo($('.hsrui-page-selected'));
                        }
                    });
                } else {
                    $(SELECTOR_ITEM, self._container$).each(function (ai, ao) {
                        if ($(ao).hasClass(CLASS_SELECTED)) {
                            $(ao).removeClass(CLASS_SELECTED).find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                            $(SELECTED_ITEM).each(function (i, o) {
                                if ($(o).attr('data-'+dialogParams.fieldValue) == $(ao).attr('data-'+dialogParams.fieldValue)) {
                                    $(o).remove();
                                }
                            });
                        }
                    });
                }
                return false;
            });		

            if (dialogParams && dialogParams.selectMode) {
                self.selectMode = dialogParams.selectMode;
            } else {
                self.selectMode = 2;
            }

            if (self.selectMode == 1) { 
                // 单选，隐藏全选按钮。
                $('.hsrui-form-checkAll', self._element$).hide();
            }

            // 加载完成后，自动点击“查询”按钮。
            setTimeout($.proxy(self._onSearchButtonClick, self), 0);
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
        _loadData: function () {
            var self = this, params = {};

            // 数据准备。
            self._formCondition$.serializeArray().forEach(function (o) {
                params[o.name] = o.value;
            });

            // 加载数据并显示。
            this._loadDataAndRender(self._options.searchUrl, params);
        },
		/**
		 * 查询按钮点击事件。
		 * 
		 * @protected
		 */
        _onSearchButtonClick: function () {
            this._loadData();
        },
        
        /**
		 * 清空选择
		 */
        _onClearButtonClick: function () {
            $(SELECTOR_ITEM, self._container$).removeClass(CLASS_SELECTED).find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
            $('.hsrui-page-selected').empty();
            $('input[name="checkAll"]', self._element$).prop("checked", "");
        },

        _loadDataAndRender: function (url, params) {
            var self = this;

            $.get(url, params, function (result) {
                self._container$.html(result);
                
                // 恢复选择的项。
                self._restoreSelected();

                // 恢复全选。
                self._reckonSelectAll();
            });
        },
        /**
         * 恢复选择的项。
         */
        _restoreSelected: function () {
            var self = this, dialogParams = self._getDialogParams();
            
            // 恢复选择。已被选中
            if (dialogParams && dialogParams.value && $.isArray(dialogParams.value) && dialogParams.display && $.isArray(dialogParams.display)) {
                var i = 0;
                dialogParams.value.forEach(function (o) {
                    if(o){
                        var name = dialogParams.display[i++];
                        var selector$ = $(SELECTOR_ITEM + '[data-' + dialogParams.fieldValue + '="' + o + '"]', self._container$);
                        var selected$ = $(SELECTED_ITEM + '[data-' + dialogParams.fieldValue + '="' + o + '"]', self._element$);
    
                        if (selector$ && selector$.attr("data-"+dialogParams.fieldValue)) {
                            selector$.addClass(CLASS_SELECTED).find('i').removeClass(CLASS_UNCHECK).addClass(CLASS_CHECKED);
                        }
                        
                        if (!selected$.attr("data-"+dialogParams.fieldValue)) {
                            //在选中区域增加对应项
                            $('<div class="selected-item" data-'+dialogParams.fieldValue+'="' + o + '" data-'+dialogParams.fieldDisplay+'="' + name + '">' + name + '<i class="fa fa-remove"></i></div>').on('click', function (i, o) {
                                var node = $(this);
                                node.remove();
                                $(SELECTOR_ITEM, self._container$).each(function (ai, ao) {
                                    if (node.attr('data-'+dialogParams.fieldValue) == $(ao).attr('data-'+dialogParams.fieldValue)) {
                                        $(ao).removeClass(CLASS_SELECTED).find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                                    }
                                });
                            }).appendTo($('.hsrui-page-selected'));
                        }
                    } 
                });
            }
			
            // 恢复选择。当前页已被选中
            $(SELECTED_ITEM).each(function (i, o) {
                $(SELECTOR_ITEM, self._container$).each(function (ai, ao) {
                    if ($(o).attr('data-'+dialogParams.fieldValue) == $(ao).attr('data-'+dialogParams.fieldValue)) {
                        $(ao).addClass(CLASS_SELECTED).find('i').removeClass(CLASS_UNCHECK).addClass(CLASS_CHECKED);
                    }
                });
            });
			
            // 单项选择。
            var items$ = $(SELECTOR_ITEM, self._container$);
            items$.on('click', function () {
                var li$ = $(this), i$ = li$.find('i');

                if (li$.hasClass(CLASS_SELECTED)) {
                    i$.removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                    li$.removeClass(CLASS_SELECTED);
                    //去除选中区域的对应项
                    $(SELECTED_ITEM).each(function (i, o) {
                        if ($(o).attr('data-'+dialogParams.fieldValue) == li$.attr('data-'+dialogParams.fieldValue)) {
                            $(o).remove();
                        }
                    });
                } else {
                    if (self.selectMode == 1) {
                        // 单选，先清除其它选项。
                        $(SELECTOR_ITEM, self._container$).removeClass(CLASS_SELECTED)
                            .find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                        //清空选中区
                        $('.hsrui-page-selected', self._container$).empty();
                        $('.hsrui-page-selected', self._element$).empty();
                    }
					
                    // 选择自身。
                    i$.removeClass(CLASS_UNCHECK).addClass(CLASS_CHECKED);
                    li$.addClass(CLASS_SELECTED);
                    //在选中区域增加对应项
                    $('<div class="selected-item" data-'+dialogParams.fieldValue+'="' + li$.attr("data-"+dialogParams.fieldValue) + '" data-'+dialogParams.fieldDisplay+'="' + li$.attr("data-"+dialogParams.fieldDisplay) + '">' + li$.attr("data-"+dialogParams.fieldDisplay) + '<i class="fa fa-remove"></i></div>').on('click', function () {
                        var node = $(this);
                        node.remove();
                        $(SELECTOR_ITEM, self._container$).each(function (ai, ao) {
                            if (node.attr('data-'+dialogParams.fieldValue) == $(ao).attr('data-'+dialogParams.fieldValue)) {
                                $(ao).removeClass(CLASS_SELECTED).find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                            }
                        });
                    }).appendTo($('.hsrui-page-selected'));
                }

                // 计算全选按钮状态。
                self._reckonSelectAll();
            });
        },
        /**
         * 绑定容器事件。
         */
        _bindContainerEvent: function () {
            var self = this;

            // 单项选择。
            self._container$.on('click', SELECTOR_ITEM, function () {
                var li$ = $(this), i$ = li$.find('i');

                if (li$.hasClass(CLASS_SELECTED)) {
                    i$.removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                    li$.removeClass(CLASS_SELECTED);
                } else {
                    if (self.selectMode == 1) {
                        // 单选，先清除其它选项。
                        $(SELECTOR_ITEM, self._container$).removeClass(CLASS_SELECTED)
                            .find('i').removeClass(CLASS_CHECKED).addClass(CLASS_UNCHECK);
                    }
						
                    // 选择自身。
                    i$.removeClass(CLASS_UNCHECK).addClass(CLASS_CHECKED);
                    li$.addClass(CLASS_SELECTED);
                }

                // 计算全选按钮状态。
                self._reckonSelectAll();
            });
        },
		/**
		 * 计算是否勾选“全选”按钮。
		 * 
		 * @private
		 */
        _reckonSelectAll: function () {
            var self = this,
                chkAll$ = $('input[name="checkAll"]', self._element$),
                items$ = $(SELECTOR_ITEM, self._container$);
			
            // 单选，不判断。
            if (self.selectMode == 1) return;

            if (items$.length == 0 || items$.not('.' + CLASS_SELECTED).length > 0) {
                chkAll$.prop('checked', false);
            } else {
                chkAll$.prop('checked', true);
            }
        }
    });


    return (ns.SelectorPage = SelectorPageClass);
});