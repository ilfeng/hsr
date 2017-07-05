/**
 * 手风琴控件（基础版）。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-panel', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function AccordionClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。 
    hsr.inherit(AccordionClass, _super);

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
        cssClass: '@CSS_PREFIX@accordion',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Accordion'
    };

    $.extend(AccordionClass, metedata);

    // 注册组件。
    ToolUtils.regiest(AccordionClass);

    /***********公共(及特权)方法***********/
    $.extend(AccordionClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
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
            var self = this, items$ = element$.find('li');
            _superMethods._create.call(self, element$, options);

            // 绑定点击事件。
            $('a', items$).on('click', function () {
                var link$ = $(this),
                    item$ = link$.parent(),
                    parentItems$ = item$.parent().children();

                if (item$.children('ul').length > 0) {
                    // 有子菜单，折叠或展开。
                    if (item$.hasClass('@UI_CLASS_ACTIVE@')) {
                        item$.removeClass('@UI_CLASS_ACTIVE@');
                    } else {
                        parentItems$.removeClass('@UI_CLASS_ACTIVE@');
                        item$.addClass('@UI_CLASS_ACTIVE@');
                    }

                    // 重新刷新控件。
                    self.refresh();
                } else {
                    // 无子菜单，触发点击事件。
                    self._onItemClick(link$);
                }

                return false;
            });
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
         * 触发项点击事件。
         */
        _onItemClick: function (link$) {
            self._fireEvent('item-click', { item: link$ });
        }
    });

    /***********私有方法***********/

    return AccordionClass;
});