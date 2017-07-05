/**
 * 图表控件（基于 EChart 构建）。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-panel',
    'ui-tool-manager', 'chart-magnifier', 'echarts-utils', 'echarts'
], function ($, hsr, _super, ToolUtils, MagnifierClass, EChartUtils, EChart) {
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
    function ChartClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._conditionsParams = {};

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。 
    hsr.inherit(ChartClass, _super);

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
        cssClass: '@CSS_PREFIX@chart',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Chart'
    };

    $.extend(ChartClass, metedata);

    // 注册组件。
    ToolUtils.regiest(ChartClass);

    /***********公共(及特权)方法***********/
    $.extend(ChartClass.prototype, metedata, {
        /**
         * 根据条件加载数据。
         * 
         * @param {object} conditions 查询条件。
         * 
         * @returns {object} 控件实例。
         */
        load: function (conditions) {
            // 设置初始查询参数。
            this._conditionsParams = conditions || {};
            // 异步加载数据。
            this._reload();

            return this;
        },
        /**
         * 重新加载数据。
         * 
         * @returns {object} 控件实例。
         */
        reload: function () {
            // 异步加载数据。
            this._reload();

            return this;
        },
        /**
         * 获取原始图表的配置信息。
         * 
         * @returns {object} 原始图表配置信息。
         */
        getChartOptions: function () {
            try {
                if (this._chartObj) {
                    return this._chartObj.getOption();
                }
            } catch (ex) { }
            return null;
        },
        /**
         * 显示放大器。
         */
        showMagnifier: function () {
            var chartSettings = $.extend(true, {}, this.getChartOptions());

            if (!hsr.StringUtils.isBlank(chartSettings.title)) {
                chartSettings.title.show = true;
            }

            var magnifier = new MagnifierClass({
                chartSettings: chartSettings
            });

            magnifier.show();
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
                { name: 'fit', value: true },  // 是否撑满父元素。
                { name: 'type', value: 'bar' }, // 图表类型。
                { name: 'title', value: '' }, // 标题。
                { name: 'url', value: '' },  // 数据访问地址。
                { name: 'method', value: 'post' },  // 数据访问类型。
                { name: 'autoLoad', value: false },  // 是否自动加载数据。
                { name: 'legend', value: 'auto' }, // 是否显示图例。
                { name: 'chaosColol', value: true },  // 是否混乱颜色。
                { name: 'yFormat', value: '{0}' }, // 格式化 y 轴。
                { name: 'tooltipFormat', value: '{a}<br/>{b}:{c}' }, // 格式化 
                { name: 'useTitle', value: false }, // 是否显示标题。
                { name: 'useToolbox', value: false }, // 是否显示工具栏。
                { name: 'useMaxMin', value: true }, // 是否显示最大最小值。
                { name: 'useAverage', value: false }, // 是否显示平均线。
                { name: 'useZoom', value: false }, // 是否显示缩放。
                { name: 'magnifier', value: true }, // 是否显示放大器。
                { name: 'openDetail', kind: 'function', scope: window }, // 点击item显示详细的方法
                { name: 'convert', kind: 'function', scope: window }  // 数据转换方法。
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

            // 初始化图表：高度/宽度不能使用比例。
            var height = element$.outerHeight(), width = element$.outerWidth();
            if (height == 0) {
                height = 100;
            }
            if (width == 0) {
                width = 100;
            }
            element$.css({ height: height, width: width });

            element$.on('dblclick', function (param) {
                self._onDblClick(param);
            });

            var chartObj = self._chartObj = EChart.init(element$[0]);

            // 点击。
            chartObj.on('click', function (param) {
                self._onItemClick(param);
            });

            // 需要自动加载数据。
            if (options.autoLoad) {
                setTimeout($.proxy(self._reload, self), 0);
            }
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;

            // 释放图表。
            if (self._chartObj) {
                self._chartObj.dispose();
                self._chartObj = null;
            }

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

            if (self._chartObj) {
                // WARNING 直接调用有时候不起作用。
                setTimeout(function () {
                    self._chartObj.resize();
                }, 0);
            }
        },
        /**
         * 加载图表。
         */
        _reload: function () {
            var self = this,
                opts = self._options,
                chart = self._chartObj,
                data = self._conditionsParams,
                url = opts.url;

            if (hsr.StringUtils.isBlank(url)) return;

            chart.clear();
            console.log('chart load begin');

            chart.showLoading({
                text: '正在努力的读取数据中...'
            });

            $.ajax({
                url: opts.url,
                type: opts.method,
                data: data
            }).done(function (result) {
                if (result.status == 0 && result.data.length > 0) {
                    var items = self._originalItems = self._convertData(result.data);
                    self._initChart(items);
                }
                chart.hideLoading();
                console.log('chart load end');
            });
        },
        /**
         * 根据数据初始化图表。
         * 
         * @param {array} items 图表数据。
         * 
         * @remark
         *  items: [{legend: '车辆在线', name: '一组', value: 11},
         *          {legend: '车辆在线', name: '二组', value: 12},
         *          {legend: '车辆总数', name: '一组', value: 20},
         *          {legend: '车辆总数', name: '二组', value: 30}]
         */
        _initChart: function (items) {
            if (!Array.isArray(items)) return;

            var self = this,
                opts = self._options,
                type = opts.type,
                title = opts.title,
                legendData = hsr.ArrayUtils.distinct(items, function (v) {
                    return v.legend;
                }), xData = hsr.ArrayUtils.distinct(items, function (v) {
                    return v.name;
                }),
                seriesData = [],
                chartOptions;

            switch (type) {
                case 'line': // 折线图。
                    EChartUtils.prepareDataA(items, legendData, xData, seriesData);
                    chartOptions = EChartUtils.createLineOptions(opts, title, legendData, xData, seriesData);
                    break;
                case 'bar': // 柱状图。
                    EChartUtils.prepareDataA(items, legendData, xData, seriesData);
                    chartOptions = EChartUtils.createBarOptions(opts, title, legendData, xData, seriesData);
                    break;
                case 'radar': // 雷达图。
                    EChartUtils.prepareDataA(items, legendData, xData, seriesData);
                    chartOptions = EChartUtils.createRadarOptions(opts, title, legendData, xData, seriesData);
                    break;
                case 'pie': // 饼状图。
                    EChartUtils.prepareDataB(items, legendData, xData, seriesData);
                    chartOptions = EChartUtils.createPieOptions(opts, title, legendData, xData, seriesData);
                    break;
                case 'ring': // 环状图。
                    EChartUtils.prepareDataB(items, legendData, xData, seriesData);
                    chartOptions = EChartUtils.createRingOptions(opts, title, legendData, xData, seriesData);
                    break;
                case 'funnel': // 漏斗图。
                    EChartUtils.prepareDataB(items, legendData, xData, seriesData);
                    chartOptions = EChartUtils.createFunnelOptions(opts, title, legendData, xData, seriesData);
                    break;
            }
            
            // 标题。
            if (!opts.useTitle || hsr.StringUtils.isBlank(opts.title)) {
                chartOptions.title.show = false;
            }

            // 使用混乱颜色。
            if (opts.chaosColol) {
                chartOptions.color = self._createChaosColor();
            }
            
            // 图例。
            if (typeof opts.legend == 'boolean') {
                chartOptions.legend.show = opts.legend;
            }
            
            // 工具栏。
            chartOptions.toolbox.show = opts.useToolbox;
            
            // 区域。
            if (opts.useZoom) {
                // TODO 未实现。
            }

            // 绘制图表。
            self._chartObj.setOption(chartOptions);
        },
        _convertData: function (original) {
            if (!Array.isArray(original)) return null;

            var convertFunc = this._options.convert, items = [], item;

            for (var i = 0, l = original.length; i < l; i++) {
                item = convertFunc ? convertFunc(original[i]) : original[i];
                item.data = $.extend({}, original[i]);
                items.push(item);
            }

            return items;
        },
        _createChaosColor: function () {
            var colors = [
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', 
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', 
                '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0',
                '#c23531', '#314656', '#61a0a8', '#dd8668', '#91c7ae',
                '#6e7074', '#61a0a8', '#bda29a', '#44525d', '#c4ccd3'
            ], chaos = [];

            var random = Math.floor((colors.length - 1) / 3 * Math.random());

            for (var i = random, l = colors.length; i < l; i++) {
                chaos[i - random] = colors[i];
            }
            for (var i = 0, l = random; i < l; i++) {
                chaos[i + random] = colors[i];
            }

            return chaos;
        },
        _onItemClick: function (param) {
            var self = this, items = self._originalItems, item, original,
                legend = param.seriesName, name = param.name, openDetail = this._options.openDetail;

            if (items && items.length > 0) {
                for (var i = 0, l = items.length; i < l; i++) {
                    item = items[i];
                    if (item.legend === legend && item.name === name) {
                        original = item.data;
                        break;
                    }
                }
            }

            if (original) {
                this._fireEvent('item-click', { item: original });
                if (openDetail) {
                    openDetail(original);
                }
            }
        },
        _onDblClick: function () {
            this._fireEvent('dblclick');
            var magnifierFlag = this._options.magnifier;
            if (magnifierFlag) {
                this.showMagnifier();
            }
        }
    });

    /***********私有方法***********/

    return ChartClass;
});