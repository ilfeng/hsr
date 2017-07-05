/**
 * 主页。
 *
 * @type {class}
 * 
 * @remark
 *     包含：固定的顶部、左侧菜单、中心选项卡式视图。
 */
define([
    'jquery', 'core', 'ui', 'base'
], function ($, hsr, ui, base) {
    'use strict';

    var _super = base.BasePage,
        _superMethods = _super.prototype;

    /**
     * 构造方法。
     * 
     * @param {HTMLElement | jQuery}  element 主元素。
     * @param {object} options 配置项。
     * 
     * @constructor
     */
    function ShellClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(ShellClass, _super);

    /***********公共(及特权)方法***********/
    $.extend(ShellClass.prototype, {
        start: function () {
            var self = this;

            // 注册打开方法。
            hsr.app.openViewContent = function (options) {
                self._openViewContent(options);
            };
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
            
            // 菜单项目。
            self._initMenu();
            
            // 
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
         * 加载完成事件。
         */
        _onComplete: function () {
            this.refresh();
            _superMethods._onComplete.call(this);
        },
        _initMenu: function () {
            var self = this;
            
            // 菜单项点击。
            self._element$.on('item-click', '.hsrui-menu-item', function () {
                var link$ = $(this);
                var url = link$.attr('href');
                var id = link$.data('id');
                var name = link$.data('name');
                var opend = link$.data('opend');

                if (opend == "defaultMode") {
                    // 默认模式
                    hsr.app.openViewContent({ id: id, title: name, url: url });
                } else if (opend == "dialogMode") {
                    // 对话框模式
                    hsr.app.openDialog({ id: id, title: name, url: url });
                } else if (opend == "dialogEditMode") {
                    // 编辑对话框模式
                    hsr.app.openEditDialog({ id: id, title: name, url: url });    
                } else if (opend == "newWindowMode") {
                    // 新窗口模式
                    hsr.app.openLink({ name: 'nw' + id, title: name, url: url });
                } else if (opend == "selfWindowMode") {
                    // 自窗口（刷新）模式。
                    window.location.href = url;
                }
                
                // 关闭收藏夹。
                self._hideFavorite();

                return false;
            });
        },
        _initViewContent: function () {
            

        },
        _showViewContent: function () {
            
        },
        _hideViewContent: function () {
            
        },
        _openViewContent: function (options) {
            
        },
        _closeViewContent: function () {
            
        }
    });

    /***********私有方法***********/

    return ShellClass;
});