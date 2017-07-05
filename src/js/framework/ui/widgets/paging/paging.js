/**
 * 分页控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-panel', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function PagingClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。
    hsr.inherit(PagingClass, _super);

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
        cssClass: '@CSS_PREFIX@paging',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Paging'
    };

    $.extend(PagingClass, metedata);

    // 注册组件。
    ToolUtils.regiest(PagingClass);

    /***********公共(及特权)方法***********/
    $.extend(PagingClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'pageSize', value: 10 }  // 默认分页数量。
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
                
            // 绑定页码点击事件（上页、下页、第N页）。
            $('a', element$).on('click', function () {
                var link$ = $(this),
                    pageIndex = link$.data('page');

                if (!hsr.StringUtils.isBlank(pageIndex)) {
                    var p = Number(pageIndex);
                    if (isNaN(p) || p <= 0) p = 1;

                    self._onPageIndexChanged(p);
                }

                return false;
            });

            // 绑定页码改变按钮。
            $('.@CSS_PREFIX@btn-changepage', element$).on('click', function () {
                var pageIndex = $('input.@CSS_PREFIX@text-pageindex').val();

                if (!hsr.StringUtils.isBlank(pageIndex)) {
                    var p = Number(pageIndex);
                    if (isNaN(p) || p <= 0) p = 1;

                    self._onPageIndexChanged(p);
                }

                return false;
            });

            // 绑定每页行数改变下拉。
            $('select.@CSS_PREFIX@pagesize').on('change', function () {
                var pageSize = $(this).val();

                if (pageSize && pageSize > 0) {
                    self._onPageSizeChanged(pageSize);
                }

                return false;
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
         * 页码改变。
         * 
         * @param {integer} pageIndex 当前页码。
         * 
         * @protected
         */
        _onPageIndexChanged: function (pageIndex) {
            this._fireEvent('page-index-changed', { pageIndex: pageIndex });
        },
        /**
         * 每页行数改变。
         * 
         * @param {integer} pageSize 当前页码。
         * 
         * @protected
         */
        _onPageSizeChanged: function (pageSize) {
            this._fireEvent('page-size-changed', { pageSize: pageSize });
        }
    });

    /***********私有方法***********/

    return PagingClass;
});