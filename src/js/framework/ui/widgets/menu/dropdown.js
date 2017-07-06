/**
 * 。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-control', 'ui-tool-manager'], function ($, hsr, _super, ToolUtils) {
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
    function DropdownClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(DropdownClass, _super);

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
        cssClass: '@CSS_PREFIX@dropdown',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Dropdown'
    };

    $.extend(DropdownClass, metedata);

    // 注册组件。
    ToolUtils.regiest(DropdownClass);

    /***********公共(及特权)方法***********/
    $.extend(DropdownClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                // { name: 'fit', value: true },
                // { name: 'convert', kind: 'function', scope: window }
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
            
            $('.' + self.cssClass + '-toggle', element$).on('click', function(){
                self._toggleMenu();
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
         * 清除菜单。
         */
        _clearMenu: function () {
            this._element$.removeClass('open');
        },
        /**
         * 切换菜单显示状态。
         */
        _toggleMenu: function () {
            var self = this, elem$ = self._element$;

            if(!elem$.hasClass('open')) {
                elem$.addClass('open');
                $(document).one('click', $.proxy(self._clearMenu, self));
            }else{
                self._clearMenu();
            }
        }
    });

    /***********私有方法***********/

    return DropdownClass;
});