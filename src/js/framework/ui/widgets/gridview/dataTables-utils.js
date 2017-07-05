define(['jquery', 'core'], function ($, hsr) {

    var StringUtils = hsr.StringUtils;

    /**
     * 根据名称在指定对象内提取属性。
     * 
     * @param {string} name 属性名称。
     * @param {object | array} 属性所在对象集合。
     * 
     * @return {object} 属性值。
     */
    function findPropertyByName(name, scopes) {
        if (scopes == null) return;

        if (!Array.isArray(scopes)) {
            scopes = [scopes];
        }

        for (var i = 0, l = scopes.length, scope; i < l; i++) {
            scope = scopes[i];
            if (typeof scope == 'object' && scope[name]) {
                // 使用代理，保证方法可以访问上下文内容。
                return $.proxy(scope[name], scope);
            }
        }

        return;
    }

    return {
        createTableOptions: function (table$, scopes) {
            // 读取原始元素（Table）的信息，设置列。
            var columns = [], orderBeginColumnIndex = -1, opts = {};

            // 是否允许排序。
            // var ordering = table$.data('ordering');
            // if (ordering) {
            //     opts.ordering = ordering;
            // }

            // 是否自动调整列宽。
            // var autoWidth = table$.data('autowidth');
            // if (autoWidth) {
            //     opts.autoWidth = autoWidth;
            // }

            $('thead th.@CSS_PREFIX@column', table$).each(function (i, o) {
                var th$ = $(o),
                    //title = th$.text(),                           // 标题。
                    width = Number(th$.attr('width')),              // 宽度。
                    fieldName = th$.data('field'),                  // 字段名称（排序）。
                    orderable = th$.data('orderable'),              // 是否允许排序。
                    orderData = th$.data('orderdata'),              // 排序次序。
                    //visible = th$.data('visible'),                // 是否可见。
                    fixed = th$.data('fixed'),                      // 是否固定（列隐藏）。
                    kind = th$.data('kind') || 'string',            // 数据类型（可选值：serial、number、date、boolean、template）。
                    renderFuncName = th$.data('render'),            // 渲染方法名称。
                    createdCellFuncName = th$.data('createdCell'),  // 创建方法名称。
                    tmplName = th$.data('tmpl'),                    // 模板名称。
                    styleClassName = th$.data('cls');               // 样式名称。

                // 列配置。
                var column = {
                    targets: i,
                    data: fieldName,  // TODO 应该是 name 属性 或是 data 属性？？。
                    fixed: fixed,
                    tmplName: tmplName
                };
                
                // 列宽度。
                if (width && width > 0) {
                    column.width = width;

                    th$.css({ minWidth: width, maxWidth: width }); 
                    
                    // 设置当前列的所有单元格的最大宽度。
                    table$.find('tbody tr').each(function () {
                        $(this).find('td').eq(i).css({ minWidth: width, maxWidth: width });
                    });
                }
                
                // 列排序。
                if (orderable != null) {  // 布尔值，必须判断不为空。
                    column.orderable = orderable;
                }
                
                // 列排序次序。
                if (orderData) {
                    var aryO = orderData.split(',');
                    for (var k = 0, l = aryO.length; k < l; k++) {
                        var item = Number(aryO[k]);
                        if (!isNaN(item)) {
                            aryO[k] = item;
                        } else {
                            aryO[k] = 0;
                        }
                    }

                    if (aryO.length > 0) {
                        column.orderData = aryO;
                    }
                }

                // 第一个允许排序的列的索引。
                if (column.orderable && orderBeginColumnIndex < 0) {
                    orderBeginColumnIndex = i;
                }

                // 数据类型。
                var classNames = [styleClassName], typeRenderFuncName;

                switch (kind) {
                    case 'serial':
                        classNames.push('hsrui-cell-serial');
                        break;
                    case 'number':
                        classNames.push('hsrui-cell-number');
                        break;
                    case 'date':
                        classNames.push('hsrui-cell-date');
                        break;
                    case 'boolean':
                        classNames.push('hsrui-cell-boolean');
                        break;
                    case 'template':
                        break;
                    default:
                        typeRenderFuncName = '';
                        break;
                }

                // 样式。
                column.className = classNames.join(' ');

                // 列处理方法。
                if (!StringUtils.isBlank(renderFuncName)) {
                    column.render = findPropertyByName(renderFuncName, scopes);
                } else if (!StringUtils.isBlank(typeRenderFuncName)) {
                    column.render = findPropertyByName(typeRenderFuncName, scopes);
                }

                // 列创建单元格方法。
                if (!StringUtils.isBlank(createdCellFuncName)) {
                    column.createdCell = findPropertyByName(createdCellFuncName, scopes);
                }
                
                // 序号列。
                if (kind == 'serial') {
                    opts.serialColumnIndex = i;
                }

                columns.push(column);
            });

            if (columns.length > 0) {
                // opts.columns = columns;
                opts.columnDefs = columns;
            }

            // 默认排序列。
            var defaultOrderIndex = table$.data('orderindex');  // 不能使用 “order”字段名，原始控件已经实现。
            if (defaultOrderIndex && defaultOrderIndex >= 0) {
                opts.order = [defaultOrderIndex, 'asc'];
            } else if (orderBeginColumnIndex >= 0) {
                opts.order = [orderBeginColumnIndex, 'asc'];
            }

            return opts;
        },
        /**
         * 绑定固定序号列。
         */
        bindingSerial: function (table$, tableOpts) {
            var serialColumnIndex = tableOpts.serialColumnIndex;
            if (typeof serialColumnIndex != 'number') return;

            var dt = table$.DataTable();

            if (dt) {
                dt.on('order.dt search.dt', function () {
                    dt.column(serialColumnIndex, {
                        search: 'applied',
                        order: 'applied'
                    }).nodes().each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
                }).draw();
            }
        },
        /**
         * 恢复排序状态。
         * 
         * @param {jQuery} table$ 表格元素。
         * @parma {string} field 排序列名。 
         * @parma {string} direction 排序方向。 
         */
        restoreOrderStatus: function (table$, field, direction) {
            var dt = table$.DataTable();
            if (dt && field) {
                // 获取列索引。
                var columnIndex = dt.column(field + ':name').index();

                if (columnIndex >= 0) {
                    dt.order(columnIndex, direction).draw();
                }
            }
        },
        /**
         * 绑定排序事件。
         * 
         * @param {jQuery} table$ 表格元素。
         * @param {function} callback 回调方法。
         */
        bindOrder: function (table$, callback) {
            table$.on('order.dt', function (e, settings) {
                var tableO = $(this).DataTable(),
                    order = tableO.order(),
                    ci = order[0][0],
                    co = order[0][1];

                if (!ci) return;

                var column = settings.aoColumns[ci],
                    cn = column.name;
                
                // 当列存在列名时触发。
                if (cn && callback) {
                    callback(cn, co);
                }
            });
        }
    };
});