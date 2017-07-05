/* global DEFAULT_GRIDVIEW_HEADER_HEIGHT */
/* global DEFAULT_GRIDVIEW_DATAROW_HEIGHT */
/* global DEFAULT_GRIDVIEW_FOOTER_HEIGHT */
/* global DEFAULT_GRIDVIEW_PAGER_HEIGHT */
/**
 * 网格控件（通过异步获取数据更新表格）。
 *
 * @type {class}
 * 
 * @remark
 *      1. 网格列宽度根据 a. 设置宽度 b. 数据宽度 显示。
 *      2. 网格宽度最小要撑满页面。
 *      3. 网格宽度如果超过页面，出现滚动条。 
 */
define([
    'jquery', 'core', 'ui-panel',
    'ui-tool-manager', 'dataTables-utils', 'gridview-utils', 'ui-enum-selectMode', 'ui-paging', 'rowmerge-utils',
    'datatables', 'datatables-setting'
], function ($, hsr, _super, ToolUtils, DataTablesUtils, GridViewUtils, SelectModeEnum, PagingClass, RowMergeUtils) {
    'use strict';

    var _superMethods = _super.prototype,
        UI_CLASS_TABLE = 'hsrui-datagrid';

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function GridViewClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._lastHeight = 0;
        self._lastWidth = 0;
        self._conditionsParams = {};
        self._loading = false;

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(GridViewClass, _super);

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
        cssClass: '@CSS_PREFIX@gridview',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'GridView'
    };

    $.extend(GridViewClass, metedata);

    // 注册组件。
    ToolUtils.regiest(GridViewClass);

    /***********公共(及特权)方法***********/
    $.extend(GridViewClass.prototype, metedata, {
        /**
         * 根据条件加载数据。
         * 
         * @param {object} conditions 查询条件。
         * 
         * @returns {object} 控件实例。
         */
        load: function (conditions) {
            var self = this;
                
            // 设置初始查询参数。
            self._conditionsParams = conditions || {};
            // 异步加载数据。
            self._reload();

            return self;
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
         * 获取选择的行元素。
         * 
         * @returns {jQuery} 选择的行元素集合。
         */
        getSelectedRows: function () {
            return GridViewUtils.getSelectedRows(this._table$);
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
                { name: 'serverOrder', value: true }, // 服务端排序。
                { name: 'selectMode', value: SelectModeEnum.SINGLE }, // 行选项模式：无、单选、多选，默认单选。
                { name: 'rowSelected', value: true }, // 行选择方式。true -- 通过行选择；false -- 必须通过指示器选择。
                { name: 'autoPageSize', value: false }, // 是否启用自动估计每页行数，默认不启用。
                { name: 'headerHeight', value: 36 }, // 默认表头高度（单位：像素）。
                { name: 'dataRowHeight', value: 33 }, // 默认数据行高（单位：像素）。
                { name: 'footerHeight', value: 0 }, // 默认表尾高度（单位：像素）。
                { name: 'pagerHeight', value: 37 }, // 默认分页高度（单位：像素）。
                { name: 'rowMergeType', value: 0 }, // 表格合并类型。0：不合并、1：表头、2：表体 、3:都合并
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

            // 初始值。
            self._lastHeight = element$.height();
            self._lastWidth = element$.width();

            self._table$ = $('.' + UI_CLASS_TABLE, element$);
            self._paging$ = $('.' + PagingClass.cssClass, element$);

            // 生成网格控件。
            self._createTable();
            // 生成分页。
            self._createPaging();
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;

            self._table$ = null;
            self._paging$ = null;

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
         * 设置当前页码。
         * 
         * @parma {integer} pageNum 当前页码。 
         */
        _setPageNum: function (pageNum) {
            this._conditionsParams['start'] = pageNum;
        },
        /**
         * 设置每页行数。
         * 
         * @parma {integer} pageSize 每页行数。 
         */
        _setPageSize: function (pageSize) {
            this._conditionsParams['limit'] = pageSize;
        },
        /**
         * 创建表格。
         */
        _createTable: function () {
            var self = this,
                elem$ = self._element$,
                opts = self._options,
                table$ = self._table$,
                paging$ = self._paging$,
                height = self._element$.height(),
                headerHeigth = table$.find('thead').outerHeight() || 0,
                footerHeight = table$.find('tfoot').outerHeight() || 0,
                pageHeight = 0;

            if (paging$) {
                pageHeight = paging$.outerHeight();
            }
            
            // 表格中的控件绑定。
            ToolUtils.parse(elem$);

            // 网格基本配置。
            var tableOpts = $.extend(true, {
                paging: false,
                scrollY: height - headerHeigth - footerHeight - pageHeight,
                scrollX: true
            }, DataTablesUtils.createTableOptions(table$, [window, opts, self]));

            // 网格列配置。
            if (opts.columns) {
                tableOpts.columnDefs = [];

                opts.columns.forEach(function (o, i) {
                    var tableColumn = $.extend(true, {}, o);

                    // 列索引。
                    tableColumn.targets = i;

                    tableOpts.columnDefs.push(tableColumn);
                });
            }

            // 创建网格。
            table$.DataTable(tableOpts);
            
            // 绑定序号列。
            DataTablesUtils.bindingSerial(table$, tableOpts);

            // 网格行选择。
            switch (opts.selectMode) {
                case SelectModeEnum.SINGLE:   // 单行选择 -- 默认单选框。
                    GridViewUtils.bindSingleSelectRow(elem$, table$, opts.rowSelected, function (tr$) {
                        self._onRowSelected(tr$);
                    });
                    break;
                case SelectModeEnum.MULTIPLE:  // 多行选择 -- 默认复选框。
                    GridViewUtils.bindMultipleSelectRow(elem$, table$, opts.rowSelected, function (tr$) {
                        self._onRowSelected(tr$);
                    });
                    break;
                default:
                    break;
            }

            var headTable$ = $(".dataTables_scrollHead table",elem$);
            if(opts.rowMergeType == 1){
            	RowMergeUtils.formatTable(table$);
            }else if(opts.rowMergeType == 2){
            	RowMergeUtils.formatTableTh(headTable$);
            }else if(opts.rowMergeType == 3){
            	RowMergeUtils.formatTable(table$);
            	RowMergeUtils.formatTableTh(headTable$);
            }
            
            // 网格行中的按钮。
            $('.@CSS_PREFIX@btn', table$).on('click', function (event) {
                var button$ = $(this), row$ = button$.parents('tr');
                self._onRowButtonClick(button$, row$);
                return false;
            });
        },
        /**
         * 创建分页。
         */
        _createPaging: function () {
            var self = this;

            if (self._paging$.length == 0) return;

            var p = new PagingClass(self._paging$);

            p.on('page-index-changed', function (event, sender, data) {
                self._setPageNum(data.pageIndex);
                self._reload();
                return false;
            });
        },
        /**
         * 刷新数据。
         */
        _reload: function () {

        },
        /**
         * 
         */
        _onRowSelected: function (tr$) {
            this._fireEvent('gridview-row-selected', { row: tr$ });
        },
        /**
         * 
         */
        _onRowButtonClick: function (button$, tr$) {
            this._fireEvent('gridview-row-button-click', { button: button$, row: tr$ });
        }
    });

    /***********私有方法***********/

    return GridViewClass;
});