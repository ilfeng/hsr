/**
 * 基础列表页面。
 *
 * @type {class}
 */
define(['jquery', 'core', 'base-ns', 'base-page-base'], function ($, hsr, ns, _super) {
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
    function ListPageClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(ListPageClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(ListPageClass.prototype, {
        /**
         * 带提示框的处理辅助方法。
         * 
         * @param {string} title 标题。
         * @param {string} url 地址。
         * @param {object} data 数据。
         * @param {boolean} isReloadGrid 是否刷新网格。
         */
        dealWithConfirm: function (title, url, data, isReloadGrid) {
            var self = this;
            if (hsr.StringUtils.isBlank(url)) return;

            // 提示 -- 确认 -- 提交 -- 成功。
            hsr.app.confirm('您确定要' + title + '此记录么？', function () {
                $.post(url, data, function (result) {
                    var ro = result;
                    if (typeof result == 'string') {
                        ro = JSON.parse(result);
                    }

                    if (ro.status == 0) {
                        var msg = ro.message;
                        if (hsr.StringUtils.isBlank(msg)) {
                            msg = title + '成功';
                        }
                        hsr.app.info(msg);

                        if (isReloadGrid) {
                            // 重新加载网格。
                            self._reloadData();
                        }
                    } else {
                        hsr.app.error(title + '失败');
                    }
                });
            });
        },
        dealWithDialog: function (dialogType, title, url, data, isReloadGrid) {
            var self = this;

            if (hsr.StringUtils.isBlank(url)) return;
            
            // 附加参数。
            url = hsr.UrlUtils.join(url, data);

            var funcDialog = hsr.app[dialogType + 'Dialog'];
            if (!funcDialog) return;

            // 打开对话框。
            funcDialog.call(hsr.app, {
                title: title,
                url: url,
                onClose: function (result) {
                    if (result == hsr.ui.DialogResult.OK && isReloadGrid) {
                        self._reloadData();
                    }
                }
            });
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
                { name: 'searchUrl', value: '' },
                { name: 'pageLength', value: 10 }
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

            // 工具栏。
            self._toolbar$ = $('.hsrui-page-toolbar', element$);

            // 工具栏内按钮点击处理。
            $('.hsrui-btn', self._toolbar$).on('click', function () {
                self._onToolbarButtonClick($(this));
                return false;
            });
                
            // 查询条件。
            self._formCondition$ = $('.hsrui-form-condition');

            // 查询按钮绑定。
            $('.hsrui-btn-search', self._formCondition$).on('click', function () {
                self._onSearchButtonClick();
                return false;
            });
                
            // 表格。
            self._gridviewO = $('.hsrui-gridview').api();
    
            if (self._gridviewO) {
                // 初始化表格并绑定事件。
                self._gridviewO.setOptions({
                    url: options.searchUrl,
                    selectMode: options.selectMode,
                    rowMergeType: options.rowMergeType
                }).on('gridview-row-selected', function () {
                    return false;
                }).on('gridview-row-button-click', function (event, sender, data) {
                    self._onGridRowButtonClick(data.button, data.row);
                    return false;
                });

                // 加载完成后，自动点击“查询”按钮。
                setTimeout($.proxy(self._onSearchButtonClick, self), 0);
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
        },
        /**
         * 加载网格数据。
         * @private
         */
        _loadData: function () {
            var self = this, params = {};

            // 数据准备。
            self._formCondition$.serializeArray().forEach(function (o) {
                params[o.name] = o.value;
            });

            // 加载网格。
            self._gridviewO.load(params);
        },
        /**
         * 刷新网格数据。
         * @private
         */
        _reloadData: function () {
            var self = this;
            if (self._gridviewO) {
                self._gridviewO.reload();
            }
        },
        /**
         * 获取选择的列集合。
         * @returns {*}
         * @private
         */
        _getSelectedRows: function () {
            var self = this;
            if (self._gridviewO) {
                return self._gridviewO.getSelectedRows();
            }
            return null;
        },
        /**
         * 获取选择的列（首个）。
         * @returns {jQuery | TR}
         * @private
         */
        _getSelectedRow: function () {
            var row$, rows$ = this._getSelectedRows();
            if (rows$ && rows$.length > 0) {
                row$ = rows$.eq(0);
            }
            return row$;
        },
        /**
         * 获取行的数据序号。
         * @param {jQuery | TR} row$ 行。
         * @returns {number} 获取的数据序号。
         * @private
         */
        _getIdByRow: function (row$) {
            var id = 0;
            if (row$) {
                id = row$.data('id') || 0;
            }
            return id;
        },
        /**
         * 获取行集合的数据序号。
         * @param {jQuery | TR} rows$ 行集合。
         * @returns {number} 获取的数据序号集合。
         * @private
         */
        _getIdsByRows: function (rows$) {
            var self = this, ids = [];
            
            if(!rows$) return;
            
            rows$.each(function () {
                var id = self._getIdByRow($(this));
                if (id > 0) {
                    ids.push(id);
                }
            });
            return ids;
        },
        /**
         * 查询按钮点击事件。
         * @protected
         */
        _onSearchButtonClick: function () {
            this._loadData();
        },
        _onToolbarButtonClick: function (button$) {
            var self = this,
                opts = self._options,
                rows$ = self._getSelectedRows(),
                ids = this._getIdsByRows(rows$);

            if (opts.onBeforToolbarButtonClick) {
                if (!opts.onBeforToolbarButtonClick.call(this, button$, ids, rows$)) {
                    return false;
                }
            }

            if (button$.hasClass('hsrui-btn-detail')) {
                self._showDetailDialog(ids[0]);
            } else if (button$.hasClass('hsrui-btn-add')) {
                self._showAddDialog();
            } else if (button$.hasClass('hsrui-btn-modify')) {
                self._showEditDialog(ids[0]);
            } else if (button$.hasClass('hsrui-btn-delete')) {
                self._deleteRows(ids);
            } else if (button$.hasClass('hsrui-btn-export')) {
                self._exportData();
            } else if (opts.onToolbarButtonClick) {
                opts.onToolbarButtonClick.call(this, button$, ids, rows$);
            }
        },
        /**
         * 点击事件。
         * @protected
         */
        _onGridRowButtonClick: function (button$, row$) {
            var self = this, opts = self._options, id = row$.data('id');

            if (opts.onBeforTableButtonClick) {
                if (!opts.onBeforTableButtonClick.call(this, button$, id, row$)) {
                    return false;
                }
            }

            if (button$.hasClass('hsrui-btn-detail')) {
                self._showDetailDialog(id);
            } else if (button$.hasClass('hsrui-btn-modify')) {
                self._showEditDialog(id);
            } else if (button$.hasClass('hsrui-btn-delete')) {
                self._deleteRows([id]);
            } else if (opts.onTableButtonClick) {
                opts.onTableButtonClick.call(this, button$, id, row$);
            }
        },
        _showAddDialog: function () {
            this.dealWithDialog('openEdit', '新增', this._options.addUrl, null, true);
        },
        _showDetailDialog: function (id) {
            if (!id || id == 0) {
                hsr.app.warn('请先选择要查看的记录');
                return;
            }
            	
            this.dealWithDialog('openDetail', '查看', this._options.detailUrl, {id: id}, true);
            //var url = hsr.UrlUtils.join(this._options.detailUrl, { id: id });
            //hsr.app.openWorkbench(url);
        },
        _showEditDialog: function (id) {
            if (!id || id == 0) {
                hsr.app.warn('请先选择要编辑的记录');
                return;
            }

            this.dealWithDialog('openEdit', '编辑', this._options.editUrl, { id: id }, true);
        },
        _deleteRows: function (ids) {
            if (!ids || ids.length == 0) {
                hsr.app.warn('请先选择要删除的记录');
                return;
            }

            this.dealWithConfirm('删除', this._options.deleteUrl, { id: ids }, true);
        },
        /**
         * 导出数据。
         * @protected
         */
        _exportData: function () {
            var self = this, url = this._options.exportUrl;
            if (hsr.StringUtils.isBlank(url)) return;

            // 提示 -- 确认 -- 提交 -- 成功。
            hsr.app.confirm('您确定要导出所有记录么？', function () {
                // 生成一个隐藏的 form 元素。
                var form$ = $('<form method="post" target="_blank" />').attr('action', url);

                self._formCondition$.serializeArray().forEach(function (o) {
                    $('<input type="hidden" />').attr('name', o.name).val(o.value).appendTo(form$);
                });

                form$.appendTo('body').submit().remove();
            });
        }
    });


    return (ns.ListPage = ListPageClass);
});