/**
 * 。
 *
 * @type {class}
 */
define(['jquery', 'core', 'echarts'], function ($, hsr, ECharts) {
    'use strict';

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function ChartMagnifierClass(options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._options = $.extend(true, {}, options);

        // 创建元素。
        self._create(self._options);
    }

    /***********公共(及特权)方法***********/
    $.extend(ChartMagnifierClass.prototype, {
        /**
         * 创建控件。
         * 
         * @param {jQuery} element$ 主元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _create: function (options) {
            var self = this;

            var element$ = $('<div class="@CSS_PREFIX@magnifier" />').appendTo('body'),
                mask$ = $('<div class="@CSS_PREFIX@magnifier-mask" />').appendTo(element$),
                container$ = $('<div class="@CSS_PREFIX@magnifier-container" />').appendTo(element$),
                chart$ = $('<div class="@CSS_PREFIX@magnifier-chart" />').appendTo(container$);

            mask$.on('click', function () {
                self.destroy();
            });
            
            // 初始化图表。
            self._chartObj = ECharts.init(chart$[0]);

            self._element$ = element$;
        },
        /**
         * 显示。
         */
        show: function () {
            var self = this, options = self._options, element$ = self._element$, chartObj = self._chartObj;
            if (element$) {
                // 显示。
                element$.show();
                
                // 调整图表大小。
                if (chartObj) {
                    chartObj.setOption(options.chartSettings);
                    chartObj.resize();
                }
            }
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        destroy: function () {
            var self = this;
            
            // 释放图表。
            if (self._chartObj) {
                self._chartObj.dispose();
                self._chartObj = null;
            }

            if (self._element$) {
                self._element$.remove();
                self._element$ = null;
            }
        }
    });

    /***********私有方法***********/

    return ChartMagnifierClass;
});