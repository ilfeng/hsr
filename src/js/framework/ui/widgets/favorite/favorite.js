/**
 * 收藏管理。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-panel', 'ui-tool-manager', 'jsrender', 'contextMenu'], function ($, hsr, _super, ToolUtils) {
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
    function FavoriteClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        this._items = new hsr.Dictionary();

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(FavoriteClass, _super);

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
        cssClass: '@CSS_PREFIX@favorite',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Favorite'
    };

    $.extend(FavoriteClass, metedata);

    // 注册组件。
    ToolUtils.regiest(FavoriteClass);

    /***********公共(及特权)方法***********/
    $.extend(FavoriteClass.prototype, metedata, {
        /**
         * 添加项。
         */
        addItem: function (data) {
            var self = this, url = self._options.url;
            if (!data || !data.id || self._items.has(data.id)) {
                return;
            }

            // 远端发送。
            $.ajax({
                url: url,
                type: 'PUT',
                data: { id: data.id }
            }).done(function (result) {
                // console.log('添加收藏项目状态：' + result.status);
            });

            // 添加到控件。
            self._addItem(data);
        },
        /**
         * 移除项。
         */
        removeItem: function (id) {
            var self = this, url = self._options.url;
            if (id || !self._items.has(id)) {
                return;
            }

            // 远端发送。
            $.ajax({
                url: url,
                type: 'DELETE',
                data: { id: id }
            }).done(function (result) {
                // console.log('移除收藏项目状态：' + result.status);
            });

            // 从控件移除项。
            self._removeItem(id);
        },
        /**
         * 清除所有项。
         */
        clearItems: function () {
            var self = this, url = self._options.url;

            // 远端发送。
            $.ajax({
                url: url,
                type: 'DELETE'
            }).done(function (result) {
                // console.log('移除所有收藏项目状态：' + result.status);
            });
            
            // 从控件清除所有项。
            this._clearItems();
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
                { name: 'fit', value: false },
                { name: 'url', value: '' }, // 操作地址。
                { name: 'tmplItem', value: '#tmpl-favorite-item' }, // 最大数量。
                { name: 'max', value: 8 }, // 最大数量。
                { name: 'contextMenu', value: true } // 启用右键菜单。
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
            
            // 模板。
            self._tmplItem$O = $.templates(options.tmplItem);
            
            // 项目点击。
            $(element$).on('click', '.@CSS_PREFIX@favorite-item', function () {
                self._onItemClick($(this));
                return false;
            });
            
            // 右键菜单。
            if (options.contextMenu) {
                self._createContextMenu();
            }
            
            // 自动加载。
            self._load();
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
        _createContextMenu: function () {
            var self = this;
            if (!$.contextMenu) return;

            $.contextMenu({
                selector: '.@CSS_PREFIX@favorite-item',
                callback: function (key, options) {
                    var trigger$ = options.$trigger;
                    if (key == 'remove') {
                        self.removeItem(trigger$.data('id'));
                    } else if (key == 'removeAll') {
                        self.clearItems();
                    }
                },
                items: {
                    "remove": {
                        name: "移除",
                        icon: "remove"
                    },
                    "sep1": "---------",
                    "removeAll": {
                        name: "清空",
                        icon: "remove-all"
                    }
                }
            });
        },
        /**
         * 异步加载所有项。
         */
        _load: function () {
            var self = this, url = self._options.url;
            $.get(url).done(function (result) {
                if (result.status == 0) {
                    result.data.forEach(function (o) {
                        self._addItem(o);
                    });
                }
            });
        },
        /**
         * 添加项到控件。
         * 
         * @param {object} data 项数据。 
         */
        _addItem: function (data) {
            var self = this, items = self._items;
            if (!data || !data.id || items.has(data.id)) {
                return;
            }

            // 添加到控件。
            var html = self._tmplItem$O.render(data);
            self._element$.append(html);

            // 添加到缓存。
            items.set(data.id, data);
        },
        /**
         * 根据序号从控件移除项。
         * 
         * @param {number} id 项序号。 
         */
        _removeItem: function (id) {
            var items = this._items;

            if (!items.has(id)) return;

            // 从控件移除。
            this._element$.find('[data-id="' + id + '"]').remove();
            // 从缓存移除。
            items.remove(id);
        },
        /**
         * 清除所有项。
         */
        _clearItems: function () {
            this._items.clear();
            this._element$.empty();
        },
        /**
         * 项单机事件。
         * 
         * @param {jQuery} item$ 单击的项。
         */
        _onItemClick: function (item$) {
            this._fireEvent('item-click', { item: item$ });
        }
    });

    /***********私有方法***********/

    return FavoriteClass;
});