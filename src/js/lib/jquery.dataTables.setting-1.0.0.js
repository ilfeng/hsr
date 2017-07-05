
(function (window, document, undefined) {

    var factory = function ($, DataTable) {
        'use strict';

        // DataTable -- 1.10.4

        $.extend($.fn.dataTable.defaults, {
            dom: 'Zlfrti<"table-bottom"p<"table-toolbar">>',
            autoWidth: false,
            //deferRender: 
            info: false,
            //jQueryUI: 
            lengthChange: false,
            processing: true,
            //serverSide: true,
            //stateSave: 

            paging: false,
            scrollX: '100%',
            scrollCollapse: false,
            //scrollY: 'auto',

            //pageLength: ,
            //pagingType: ,

            ordering: false,
            //orderCellsTop: ,
            //orderClasses: ,
            //order: ,
            //orderFixed: ,
            //orderMulti: ,

            searching: false,
            //search : {
            //     caseInsensitive: ,
            //     regex: ,
            //     search: ,
            //     smart: ,
            //},
            //searchCols: ,
            //searchDelay: ,

            //ajax.data: ,
            //ajax.dataSrc: ,
            //ajax: ,
            //data: ,

            //deferLoading: ,
            //destory: ,
            //displayStart: ,
            //lengthMenu: ,
            //renderer: ,
            //retrieve: ,
            //stateDuration: ,
            //stripeClasses: ,
            //tabIndex: ,

            language: {
                aria: {
                    sortAscending: '：升序排列',
                    sortDescending: '：降序排列'
                },
                decimal: '.',
                emptyTable: '没有可用的数据',
                info: '当前第 _START_ 条到 _END_ 条 共 _MAX_ 条',
                infoEmtpy: '找不到相关数据',
                infoFiltered: '（从 _MAX_ 记录中过滤）',
                infoPostFix: '',
                lengthMenu: '每页显示 _MENU_ 条记录',
                loadingRecords: '加载中……',
                paginate: {
                    first: '首页',
                    last: ' 末页 ',
                    next: ' 下一页',
                    previous: ' 上一页 '
                },
                processing: '处理中……',
                search: '搜索',
                searchPlaceholder: '',
                thousands: ',',  // 千分符
                url: '',
                zeroRecords: '查询不到任何相关数据'
            }

        });
    };

    // Define as an AMD module if possible
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'datatables'], factory);
    }
    else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'), require('datatables'));
    }
})(window, document);
