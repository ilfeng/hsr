define(['jquery', 'core', 'ui-enum-selectMode'], function ($, hsr, SelectModeEnum, PagingClass) {

    return {
        /**
         * 获取选择的行元素集合。
         * 
         * @param {jQuery} 表格元素。
         * 
         * @return {jQuery} 选择的行元素集合。
         */
        getSelectedRows: function (table$) {
            if (!table$) return null;
            return table$.find('tbody tr.@UI_CLASS_SELECTED@');
        },
        /**
         * 绑定单选行事件。
         * 
         * @param {jQuery} element$ 网格元素。
         * @param {jQuery} table$ 表格元素。
         * @param {boolean} rowSelected 是否允许通过行点击选择。
         * @param {function} callback 行选择触发回调。
         */
        bindSingleSelectRow: function (element$, table$, rowSelected, callback) {
            // 单选框。
            $('tbody tr input:radio.indicator', table$).on('click', function (e) {
                var radio$ = $(this),
                    tr$ = radio$.parent().parent(),
                    isChecked = radio$.prop('checked');

                if (isChecked) {
                    // 清除原先选择状态。
                    tr$.parent().find('tr.@UI_CLASS_SELECTED@').removeClass('@UI_CLASS_SELECTED@')
                        .find('input:radio.indicator').prop('checked', false);
                    // 添加本行选择状态。
                    tr$.addClass('@UI_CLASS_SELECTED@');
                    callback && callback.call(tr$);
                } else {
                    tr$.removeClass('@UI_CLASS_SELECTED@');
                }

                // 禁止冒泡。
                e.stopPropagation();
            });
            if (rowSelected) {
                // 行选择。
                $('tbody tr', table$).on('click', function (e) {
                    var tr$ = $(this), radio$ = tr$.find('input:radio.indicator');

                    if (tr$.hasClass('@UI_CLASS_SELECTED@')) {
                        // 移除本行选择状态。
                        tr$.removeClass('@UI_CLASS_SELECTED@');
                        radio$.prop('checked', false);
                    } else {
                        // 清除原先选择状态。
                        tr$.parent().find('tr.@UI_CLASS_SELECTED@').removeClass('@UI_CLASS_SELECTED@')
                            .find('input:radio.indicator').prop('checked', false);
                        // 添加本行选择状态。
                        tr$.addClass('@UI_CLASS_SELECTED@');
                        radio$.prop('checked', true);
                        callback && callback.call(tr$);
                    }
                    return false;
                });
            }
        },
        /**
         * 绑定多选行事件。
         * 
         * @param {jQuery} element$ 网格元素。
         * @param {jQuery} table$ 表格元素。
         * @param {boolean} rowSelected 是否允许通过行点击选择。
         * @param {function} callback 行选择触发回调。
         */
        bindMultipleSelectRow: function (element$, table$, rowSelected, callback) {
            var reckonCheckboxAllCheckedStatus = function () {
                var checkboxs = $('tbody tr input:checkbox.indicator', table$),
                    checkedCheckboxs = $('tbody tr input:checkbox.indicator:checked', table$),
                    ckAll = $('thead tr input:checkbox.indicator', element$);

                if (checkedCheckboxs.length > 0) {
                    if (checkboxs.length == checkedCheckboxs.length) {
                        ckAll.prop('indeterminate', false);
                        ckAll.prop('checked', true);
                    } else {
                        ckAll.prop('indeterminate', true);
                    }
                } else {
                    ckAll.prop('indeterminate', false);
                    ckAll.prop('checked', false);
                }
            };
            // 复选框。
            $('tbody tr input:checkbox.indicator', table$).on('click', function (e) {
                var checkbox$ = $(this),
                    tr$ = checkbox$.parent().parent(),
                    isChecked = checkbox$.prop('checked');

                if (isChecked) {
                    tr$.addClass('@UI_CLASS_SELECTED@');
                    callback && callback.call(tr$);
                } else {
                    tr$.removeClass('@UI_CLASS_SELECTED@');
                }

                // 计算全选按钮状态。
                reckonCheckboxAllCheckedStatus();

                // 禁止冒泡。
                e.stopPropagation();
            });
            if (rowSelected) {
                // 行选择。
                $('tbody tr', table$).on('click', function () {
                    var tr$ = $(this),
                        checkbox$ = tr$.find('input:checkbox.indicator');

                    if (tr$.hasClass('@UI_CLASS_SELECTED@')) {
                        tr$.removeClass('@UI_CLASS_SELECTED@');
                        checkbox$.prop('checked', false);
                    } else {
                        tr$.addClass('@UI_CLASS_SELECTED@');
                        checkbox$.prop('checked', true);
                        callback && callback.call(tr$);
                    }
    
                    // 计算全选按钮状态。
                    reckonCheckboxAllCheckedStatus();

                    return false;
                });
            }
            // 全选按钮。
            // TODO 全选按钮怎么触发行选中事件？
            $('thead tr input:checkbox.indicator', element$).on('click', function () {
                var checkbox$ = $(this);
                if (checkbox$.prop('checked')) {
                    $('tbody tr', table$).addClass('@UI_CLASS_SELECTED@')
                        .find('input:checkbox.indicator').prop('checked', true);
                } else {
                    $('tbody tr', table$).removeClass('@UI_CLASS_SELECTED@')
                        .find('input:checkbox.indicator').prop('checked', false);
                }
            });
        }
    };
});