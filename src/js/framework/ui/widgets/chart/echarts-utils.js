define([], function () {

    /**
     * 预处理 Y 轴标签格式化。
     * 
     * @param {string | func} yFormat 配置项。 
     */
    function __reckonYFormatter(yFormat) {
        var yFormatter = '{value}';
        if (yFormat) {
            if (typeof yFormat == 'string' && yFormat.length > 0) {
                // 字符类型且不为空。
                yFormatter = yFormat.replace('{0}', '{value}');
            } else if (typeof yFormat == 'function') {
                // TODO 使用格式化方法。目前考虑不周全，直接赋值。
                yFormatter = yFormat;
            }
        }
        return yFormatter;
    }

    /**
     * 预处理 tooltip 标签格式化。
     * 
     * @param {string | func} tooltipFormat 配置项。 
     */
    function __reckonTooltipFormatter(tooltipFormat) {
        var tooltipFormatter = '{a}<br/>{b}:{c}';
        if (tooltipFormat) {
            if ((typeof tooltipFormat == 'string' && tooltipFormat.length > 0) || (typeof tooltipFormat == 'function')) {
                // 字符类型或函数且不为空。
                tooltipFormatter = tooltipFormat;
            }
        }
        return tooltipFormatter;
    }

    return {
        /**
         * 数据转换：适用于折线图、柱状图。
         * 
         * @remark
         * 原始值：
         *  items: [{legend: '车辆在线', name: '一组', value: 11},
         *          {legend: '车辆在线', name: '二组', value: 12},
         *          {legend: '车辆总数', name: '一组', value: 20},
         *          {legend: '车辆总数', name: '二组', value: 30}]
         * 转换值：
         *  legend: ['车辆在线', '车辆总数']
         *  x: ['一组', '二组']
         *  series: [{name: '车辆在线', data: [11, 12]},
         *           {name: '车辆总数', data: [20, 30]}]
         */
        prepareDataA: function (items, legendData, xData, seriesData) {
            for (var i = 0, l = legendData.length; i < l; i++) {
                var legend = legendData[i], values = [];

                for (var j = 0, m = items.length; j < m; j++) {
                    var item = items[j], name = item.name, value = item.value;

                    if (legend == item.legend) {
                        for (var k = 0, n = xData.length; k < n; k++) {
                            if (xData[k] == name) {
                                var v = Number(value);
                                if (!isNaN(v)) {
                                    if (values[k]) {
                                        values[k] += v;
                                    } else {
                                        values[k] = v;
                                    }
                                } else {
                                    values[k] = value;
                                }
                                break;
                            }
                        }
                    }
                }

                seriesData.push({ name: legend, data: values });
            }
        },
        /**
         * 数据转换：适用于饼状图、环状图。
         * 
         * @remark
         *  原始值：
         *  items: [{legend: '车辆在线', name: '一组', value: 11},
         *          {legend: '车辆在线', name: '二组', value: 12},
         *          {legend: '车辆总数', name: '一组', value: 20},
         *          {legend: '车辆总数', name: '二组', value: 30}]
         *  转换值：
         *  legend: null
         *  x: ['一组', '二组']
         *  series: [{name: '一组', value: (11 + 12)},
         *           {name: '二组', value: (20 + 30)}]
         */
        prepareDataB: function (items, legendData, xData, seriesData) {
            for (var i = 0, l = xData.length; i < l; i++) {
                var name = xData[i], values = 0;

                for (var j = 0, m = items.length; j < m; j++) {
                    var item = items[j];

                    if (name == item.name) {
                        var v = Number(item.value);
                        if (!isNaN(v)) {
                            values += v;
                        }
                    }
                }

                seriesData.push({ name: name, value: values });
            }
        },
        /**
         * 折线图配置。
         */
        createLineOptions: function (options, title, legendData, xData, seriesData) {
            // y 轴格式化。
            var yFormatter = __reckonYFormatter(options.yFormat), zoomdata;
            var tooltipFormatter = __reckonTooltipFormatter(options.tooltipFormat);
            // 显示最大最小值。
            if (options.useMaxMin) {
                for (var i = 0; i < seriesData.length; i++) {
                    seriesData[i].markPoint = {
                        data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }]
                    };
                }
            }

            // 显示平均值。
            if (options.useAverage) {
                for (var i = 0; i < seriesData.length; i++) {
                    seriesData[i].markLine = {
                        data: [{ type: 'average', name: '平均值' }]
                    };
                }
            }

            //
            if (options.useZoom) {
                zoomdata = { show: true, start: 0 };
            }
            
            // 强制设置类型。
            seriesData.forEach(function (o) {
                o.type = 'line';
                o.smooth = true;//默认所有折线曲线平滑
            });

            return {
                // 标题。
                title: {
                    text: title,
                    subtext: ''
                },
                // 悬浮。
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    formatter: tooltipFormatter
                },
                // 图例。
                legend: {
                    data: legendData
                },
                // X轴。
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: xData
                }],
                // Y轴。
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: yFormatter
                    }
                }],
                // 数据。
                series: seriesData,
                // 工具箱。
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                //是否拖拽
                calculable: false,
                //是否显示数据区域缩放
                dataZoom: zoomdata
            };
        },
        /**
         * 柱状图配置。
         */
        createBarOptions: function (options, title, legendData, xData, seriesData) {
            // y 轴格式化。
            var yFormatter = __reckonYFormatter(options.yFormat);
            var tooltipFormatter = __reckonTooltipFormatter(options.tooltipFormat);
        
            // 强制设置类型。
            seriesData.forEach(function (o) {
                o.type = 'bar';
            });

            return {
                // 标题。
                title: {
                    text: title,
                    subtext: '',
                    x: 'center',
                    y: 'top'
                },
                // 悬浮。
                tooltip: {
                    show: true,
                    formatter: tooltipFormatter
                },
                // 图例。
                legend: {
                    data: legendData,
                    y: 30,
                    x: 'left'
                },
                // X轴。
                xAxis: [{
                    type: 'category',
                    data: xData
                }],
                // Y轴。
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: yFormatter
                    }
                }],
                // 数据。
                series: seriesData,
                // 工具箱。
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                // 是否拖拽。
                calculable: true
            };
        },
        /**
         * 饼状图配置。
         */
        createPieOptions: function (options, title, legendData, xData, seriesData) {
            // 获取数据的最大值。
            var dataMax = 0;
            seriesData.forEach(function (o) {
                if (o.value > dataMax) {
                    dataMax = o.value;
                }
            });

            return {
                // 标题。
                title: {
                    text: title,
                    subtext: '',
                    x: 'center'
                },
                // 悬浮。
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // 图例。
                legend: {
                    orient: 'vertical',
                    data: xData,
                    x: 'left'
                },
                // 数据。
                series: [{
                    name: legendData[0],
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    itemStyle: {
                        normal: {
                            label: {
                                formatter: '{b}({d}%)'
                            }
                        }
                    },
                    data: seriesData
                }],
                // 工具箱。
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                pie: {
                                    tooltip: {
                                        show: true,
                                        trigger: 'item',
                                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                                    },
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                formatter: '{b}({d}%)'
                                            }
                                        }
                                    }
                                },
                                funnel: {
                                    max: dataMax,
                                    tooltip: {
                                        show: true,
                                        trigger: 'item',
                                        formatter: '{a} <br/>{b} : {c}'
                                    },
                                    itemStyle: {
                                        normal: {
                                            label: {
                                                formatter: '{b}'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true
            };
        },
        /**
         * 环状图配置。
         */
        createRingOptions: function (options, title, legendData, xData, seriesData) {
            return {
                // 标题。
                title: {
                    text: title,
                    subtext: '',
                    x: 'center'
                },
                // 悬浮。
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // 图例。
                legend: {
                    show: true,
                    orient: 'vertical',
                    data: xData,
                    x: 'left'
                },
                // 数据。
                series: [{
                    name: legendData[0],
                    type: 'pie',
                    radius: ['50%', '70%'],
                    label: {
                        normal: { show: false },
                        emphasis: { show: true }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            position: 'center'
                        }
                    },
                    data: seriesData
                }],
                // 工具箱。
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true
            };
        },
        /**
         * 漏斗图配置。
         */
        createFunnelOptions: function (options, title, legendData, xData, seriesData) {
            // 获取数据的最大值。
            var dataMax = 0;
            seriesData.forEach(function (o) {
                if (o.value > dataMax) {
                    dataMax = o.value;
                }
            });

            return {
                // 标题。
                title: {
                    text: title,
                    subtext: '',
                    x: 'center'
                },
                // 悬浮。
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                // 图例。
                legend: {
                    orient: 'vertical',
                    data: xData,
                    x: 'left'
                },
                // 数据。
                series: [{
                    name: legendData[0],
                    type: 'funnel',
                    max: dataMax,
                    data: seriesData
                }],
                // 工具箱。
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                // 是否拖拽。
                calculable: true
            };
        },
        /**
         * 雷达图配置。
         */
        createRadarOptions: function (options, title, legendData, xData, seriesData) {
            var indicators = [], sData = [];

            // 
            xData.forEach(function (o) {
                indicators.push({ text: o, max: 0 });
            });
            seriesData.forEach(function (o) {
                var vv = [];
                for (var i = 0, l = o.data.length; i < l; i++) {
                    var v = o.data[i];
                    if (!v) {
                        v = 0;
                    }
                    vv.push(v);

                    var indicator = indicators[i];
                    if (v > indicator.max) {
                        indicator.max = v;
                    }
                }

                sData.push({ name: o.name, value: vv });
            });

            return {
                // 标题。
                title: {
                    text: title,
                    subtext: ''
                },
                // 悬浮。
                tooltip: {
                    trigger: 'axis'
                },
                // 图例。
                legend: {
                    x: 'center',
                    data: legendData
                },
                polar: [{
                    indicator: indicators
                }],
                // 数据。
                series: [{
                    name: legendData[0],
                    type: 'radar',
                    itemStyle: {
                        normal: {
                            areaStyle: { type: 'default' }
                        }
                    },
                    data: sData
                }],
                // 工具箱。
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: false },
                        dataView: { show: false, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                // 是否拖拽。
                calculable: true
            };
        }
    };
});
