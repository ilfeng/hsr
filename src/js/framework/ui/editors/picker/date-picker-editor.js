/**
 * 日期编辑组件。
 *
 * @type {class}
 * 
 * @remark
 *     根据格式化字符串不同，可以显示为日期、时间、日期时间、月度等。
 */
define(['jquery', 'core', 'ui-editor', 'ui-tool-manager', 'wDatePicker'], function ($, hsr, _super, ToolUtils) {
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
    function DateEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(DateEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-date',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'DateEditor'
    };

    $.extend(DateEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(DateEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(DateEditorClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'format', value: '' } // 日期格式化字符串。
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
            
            // 必须确定格式化字符串。
            if(hsr.StringUtils.isBlank(options.format)) {
                options.format = self._reckonFormat(element$);
            }

            // 存储值的隐藏域自动生成 ID 。
            var id = 'picker_date_' + hsr.UUID.random();
            self._value$.attr('id', id);

            // 使用 My97DatePicker 控件。
            var dateOptions = {
                vel: id,
                dateFmt: options.format
            };
            self._display$.attr('onfocus', 'WdatePicker(' + JSON.stringify(dateOptions) + ')');
            //self._display$.attr('onfocus', 'WdatePicker({vel: \'' + id + '\', dateFmt: \'' + options.format + '\'})');
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
         * 根据元素的样式推断格式化字符串。
         */
        _reckonFormat: function (element$) {
            if (element$.hasClass('date')) {
                return 'yyyy-MM-dd';
            } else if (element$.hasClass('time')) {
                return 'HH:mm:ss';
            } else if (element$.hasClass('datetime')) {
                return 'yyyy-MM-dd HH:mm:ss';
            } else if (element$.hasClass('month')) {
                return 'yyyy-MM';
            } else if (element$.hasClass('year')) {
                return 'yyyy';
            } else {
                return 'yyyy-MM-dd';
            }
        }
    });

    /***********私有方法***********/

    return DateEditorClass;
});