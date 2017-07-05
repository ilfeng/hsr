/**
 * 图表盒组件。
 * 
 * @remark 包含查询条件。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-box',
    'ui-tool-manager', 'ui-chart', 'extension'
], function ($, hsr, _super, ToolUtils, ChartClass) {
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
    function ChartBoxClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(ChartBoxClass, _super);

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
        cssClass: '@CSS_PREFIX@box-chart',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'ChartBox'
    };

    $.extend(ChartBoxClass, metedata);

    // 注册组件。
    ToolUtils.regiest(ChartBoxClass);

    /***********公共(及特权)方法***********/
    $.extend(ChartBoxClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'fit', value: false },  // 是否撑满父元素。
                { name: 'autoLoad', value: true }  // 是否自动加载数据。
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

            var condition$ = $('.@CSS_PREFIX@box-condition', element$);  // 查询面板。

            self._chart$ = $('.' + ChartClass.cssClass, element$); // 图表元素。
            
            // 绑定图表放大按钮。
            $('.@CSS_PREFIX@btn-magnifier', element$).on('click', function () {
                var chartO = self._chart$.api(); 
                // 图表放大。
                if (chartO) {
                    chartO.showMagnifier();
                }
                return false;
            });
            
            // 绑定查询条件面板切换按钮。
            $('.@CSS_PREFIX@btn-condition', element$).on('click', function () {
                condition$.toggle();
                return false;
            });
            
            // 获取查询表单，并绑定提交事件。
            self._conditionForm$ = $('form', condition$).on('submit', function () {
                self._loadData();
                // 隐藏查询面板。
                condition$.hide();
                return false;
            });
            
            // 绑定查询取消按钮。
            $('.@CSS_PREFIX@btn-cancel', element$).on('click', function () {
                // 隐藏查询面板。
                condition$.hide();
                return false;
            });
            
            // 加载数据。
            if (options.autoLoad) {
                setTimeout($.proxy(self._loadData, self), 0);
            }
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

            var chartO = self._chart$.api(); 
            // 图表刷新。
            if (chartO) {
                chartO.refresh();
            }
        },
        /**
         * 加载数据。
         */
        _loadData: function () {
            var self = this, form$ = self._conditionForm$, chart$ = self._chart$;

            if (form$ && form$.length > 0 && chart$ && chart$.length > 0) {
                // 序列化表单。
                var params = $.serializeObject(self._conditionForm$),
                    chartO = chart$.api(); 
                // 图表加载数据。
                if (chartO) {
                    chartO.load(params);
                }
            }
        }
    });

    /***********私有方法***********/

    return ChartBoxClass;
});