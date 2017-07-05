/**
 * Created by a on 2017/5/17.
 */
/* global PAGE_MODULE_NAME */
/* global AUTO_RESIZE */

/* 配置  */
require.config({
    baseUrl: '../',

    paths: {
        //** 插件 **
        'jquery': 'js/lib/jquery-2.1.4.min',
        'jquery-validate': 'js/lib/jquery.validate-1.14.0.min',
        'jquery-validate-additional': 'js/lib/jquery.validate-additional-1.14.0.min',
        'jquery-validate-messages_zh': 'js/lib/jquery.validate-messages_zh-1.14.0.min',
        'jquery-form': 'js/lib/jquery.form-3.51.min',
        'gritter': 'js/lib/jquery.gritter-1.7.4.min',
        'art-dialog': 'js/lib/art-dialog-6.0.4.min',
        'jqueryui': 'js/lib/jquery-ui-1.11.4.min',
        'jqueryui-position': 'js/lib/jquery-ui-position-1.11.4.min',
        'jsrender': 'js/lib/jsrender-0.9.71.min',
        'datatables': 'js/lib/jquery.dataTables-1.10.9.min',
        'datatables-tableTools': 'js/lib/jquery.dataTables.tableTools-2.2.3.min',
        'datatables-scroller': 'js/lib/jquery.dataTables.scroller-1.2.2.min',
        'datatables-colVis': 'js/lib/jquery.dataTables.colVis-1.1.1.min',
        'datatables-colResize': 'js/lib/jquery.dataTables.colResize-0.0.2.min',
        'datatables-setting': 'js/lib/jquery.dataTables.setting-1.0.0',
        'zrender': 'js/lib/zrender-2.0.7.min',
        'echarts': 'js/lib/echarts-3.0.1.min',
        'ztree': 'js/lib/jquery.ztree.all-3.5.min',
        'lightbox': 'js/lib/lightbox-2.7.1.min',
        'fancybox': 'js/lib/jquery.fancybox-2.1.5.min',
        'wDatePicker': 'widgets/My97DatePicker/WdatePicker',
        'contextMenu': 'js/lib/jquery.contextMenu-1.6.6',
        'jwplayer': 'widgets/jwplayer/jwplayer.min',
        'select2': 'js/lib/select2-4.0.2.min',
        'jquery-backstretch': 'js/lib/jquery.backstretch.min',
        'bootstrap3': 'js/lib/bootstrap-3.3.4.min',

        //** 全局 **
        'core': 'js/framework',
        'ui': 'js/framework',
        'base': 'js/framework',

        'ui-enum-selectMode':' js/framework',
        'dataTables-utils': 'js/framework',
        'gridview-utils': 'js/framework',
        'echarts-utils': 'js/framework'
    },
    shim: {
    },
    waitSeconds: 60 // 60秒超时
});

define(
    ['require', 'jquery', 'core', 'base', 'ui', 'app-ajax-settings', 'app-application'
], function (require, $, hsr, base, ui, AjaxSettings, ApplicationClass) {
    // 全局 Ajax 脚本注册 -- 异步数据错误。
    AjaxSettings.register();

    // 设置日志级别。
    hsr.logger.setLevel(hsr.LoggingLevel.LEVEL_DEBUG);

    // hsr.logger.debug(hsr.DateUtils.format(new Date(), hsr.DateFormat.FORMAT_yyyy_MM_dd_hh_mm_ss));
    //
    // hsr.logger.debug(hsr.StringUtils.format('aaaaaa({a1}),({a2}),({a3})', {'a1':'aaa','a2':'bbb','a3':'ccc'}));
    //
    // hsr.logger.debug(hsr.StringUtils.startWith('aaaabbb','bb'));
    //
    // var a = [{'a1':''},{'a2':''},{'a3':''}],
    //     b = [{'a1':''},{'a4':''}];
    //
    // hsr.logger.debug(hsr.ArrayUtils.union(a,b));
    //
    // var dic = new hsr.Dictionary();
    // dic.set('a','aa');
    // dic.set('b','bb');
    // dic.set('c','cc');
    //
    // dic.forEach(function(v,k){
    //     hsr.logger.debug(v+'--'+k);
    // });
    //
    // hsr.logger.debug(window.name);
    $(function () {
        // 主应用。
        if (!hsr.app) {
            if (window.top.hsr.app) {
                // 附加主页面类。
                hsr.app = window.top.hsr.app;
            } else {
                hsr.app = new ApplicationClass();
            }
        }
        // 处理界面控件。
        ui.parse();

        // 页面配置。
        var iframeName = window.name, pageOptions = { name: iframeName };

        // 扩展额外的方法 -- 创建页面初始化配置。
        if (window.createOptions && $.isFunction(window.createOptions)) {
            var opts = window.createOptions();

            if (opts) {
                $.extend(true, pageOptions, opts);
            }
        }

        // 获取页面（body）设置的高度和宽度。
        var body$ = $('body'), height = body$.css('height'), width = body$.css('width'), max = body$.data('max');
        if (max) {
            height = '100%';
            width = '100%';
        }
        pageOptions.height = height;
        pageOptions.width = width;

        // 创建页面类。
        var page$ = $('.hsrui-page');
        if (page$.length > 0) {
            // 加载页面类。
            require([PAGE_MODULE_NAME], function (PageClass) {
                var page = new PageClass(page$, pageOptions);

                // 完成事件处理。
                page.on('complete', function () {
                    var loading$ = $('#loading-screen');
                    if(loading$){
                        loading$.hide();
                    }
                });

                // 向管理模块注册。
                window['pageHandler'] = page;

                //
                $(window).on('resize', function () {
                    page.refresh();
                }).on('unload', function () {
                    // 页面刷新、关闭时自动注销。
                    page.destroy();
                });

                // 扩展额外的方法 -- 初始化组件。
                if (window.initializeComponent && $.isFunction(window.initializeComponent)) {
                    window.initializeComponent(page);
                }

                // 重新计算页面布局。
                if (AUTO_RESIZE) {
                    page.refresh();
                }

                if (page.start) {
                    page.start();
                }
            });
        }
    });
});

/**
 * 系统启动方法（即 Main 函数）。
 *
 * @remark 通过全局变量向方法传递参数，启动程序。
 */
require(['main'], function () { });