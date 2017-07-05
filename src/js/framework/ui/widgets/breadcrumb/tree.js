/**
 * 面包屑下拉树控件。
 *
 * @type {class}
 */
define([
    'jquery', 'core', 'ui-control', 'ui-tool-manager', 'ui-dropdown-panel'
], function ($, hsr, _super, ToolUtils, DropdownPanelClass) {
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
    function BreadCrumbTreeClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(BreadCrumbTreeClass, _super);

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
        cssClass: '@CSS_PREFIX@breadcrumb-tree',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'BreadCrumbTree'
    };

    $.extend(BreadCrumbTreeClass, metedata);

    // 注册组件。
    ToolUtils.regiest(BreadCrumbTreeClass);

    /***********公共(及特权)方法***********/
    $.extend(BreadCrumbTreeClass.prototype, metedata, {
        /**
         * 获取值。
         */
        getValue: function () {
            return this._getValue();
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
                { name: 'required', value: true, kind: 'attr' }, // 是否必填。
                { name: 'fieldValue', value: 'id' },  // 值字段名称。
                { name: 'fieldDisplay', value: 'name' }, // 显示字段名称。
                { name: 'url', value: '' },  // 获取数据的地址。
                { name: 'method', value: 'post' },  // 请求方式。
                { name: 'onlyChild', value: false },  // 只选择子节点。
                { name: 'fieldParent', value: 'pid' }  // 父节点字段名称。
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

            self._value$ = $('.@CSS_PREFIX@editor-value', element$);
            self._breadcrumb$ = $('.@CSS_PREFIX@breadcrumb', element$);

            // 下拉按钮。
            self._arrowButton$ = $('.@CSS_PREFIX@button.arrow', element$).on('click', function () {
                self._onArrowButtonClick($(this));
                return false;
            }).on('mousedown', function(){
                return false;
            });

            // 创建下拉面板。
            var dropdownPanelO = self._dropdownPanelO = DropdownPanelClass.create(element$);
            // 初始化面板。
            self._initializeDropdownPanel(dropdownPanelO.getContentElement(), options);
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;
            
            // 销毁树。
            if (self._tree$O) {
                self._tree$O.destroy();
                self._tree$O = null;
            }

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
         * 下拉按钮点击事件。
         * 
         * @param {jQuery} button$ 按钮元素。
         */
        _onArrowButtonClick: function (button$) {
            this._toggleDropdownPanel();
        },
        /**
         * 初始化下拉面板。
         * 
         * @param {jQuery} 内容元素。
         * @param {object} options 配置项。
         * 
         * @protected
         */
        _initializeDropdownPanel: function (content$, options) {
            var self = this;
            var divTree$ = $('<div />').attr('id', 'tree-' + hsr.UUID.random()).addClass('ztree').appendTo(content$);

            // 树配置。
            var treeSetting = {
                async: {
                    enable: true,
                    type: options.method,
                    url: options.url,
                    autoParam: [options.fieldValue],
                    otherParam: {}
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: options.fieldValue,
                        pIdKey: options.fieldParent,
                        rootPId: 0
                    }
                },
                view: {
                    selectedMulti: false
                },
                callback: {
                    onClick: function (event, treeId, treeNode, clickFlag) {
                        // 如果节点不是父节点，且当前操作为选择节点。
                        if (clickFlag == 1 && !(options.onlyChild && treeNode.isParent)) {
                            // 更新显示。
                            self._updateBreadcrumb(treeNode);
                            // 设置选的值。
                            self._setValue(treeNode);
                            // 关闭下拉。
                            self._closeDropdownPanel();
                        }
                    },
                    onAsyncSuccess: function (event, treeId, treeNode) {
                        var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                        
                        // 展开所有节点。
                        zTreeObj.expandAll(true);

                        // 初始化初值。
                        var node, value = self._value$.val();
                        if (hsr.StringUtils.isBlank(value)) {
                            // 2 -- 无初值且必选且可以选择非叶节点，获取根节点显示。
                            if (options.required && !options.onlyChild) {
                                // 获取一个根节点。
                                node = zTreeObj.getNodesByFilter(function (node) {
                                    return node.level == 0;
                                }, true);
                                if (node) {
                                    self._updateBreadcrumb(node);
                                }
                            }
                        } else {
                            // 1 -- 有初值，获取并显示。
                            // 根据值查找节点。
                            node = zTreeObj.getNodeByParam(options.fieldValue, value, null);
                            if (node) {
                                zTreeObj.selectNode(node);
                                self._updateBreadcrumb(node);
                            }
                        }
                    }
                }
            };
            
            // 初始化树。
            self._tree$O = $.fn.zTree.init(divTree$, treeSetting);
        },
        /**
         * 更新面包屑。
         */
        _updateBreadcrumb: function (treeNode) {
            var self = this, breadcrumb$ = self._breadcrumb$;
            if (!breadcrumb$ || !treeNode) return;

            breadcrumb$.empty();

            while (treeNode) {
                var display = self._extractDisplay(treeNode);
                $('<li />').text(display).prependTo(breadcrumb$);

                treeNode = treeNode.getParentNode();
            }
        },
        /**
         * 切换下拉面板显示。 
         */
        _toggleDropdownPanel: function () {
            var self = this;
            if (self._panelOpened) {
                self._closeDropdownPanel();
            } else {
                if (self._beforeOpenDropdownPanel()) {
                    self._openDropdownPanel();
                }
            }
        },
        /**
         * 打开下拉面板前判断。
         * 
         * @return {boolean} true -- 继续打开；false -- 停止打开。
         */
        _beforeOpenDropdownPanel: function () {
            return true;
        },
        /**
         * 打开下拉面板。
         */
        _openDropdownPanel: function () {
            if (this._dropdownPanelO) {
                this._dropdownPanelO.show();
            }
        },
        /**
         * 关闭下拉面板。
         */
        _closeDropdownPanel: function () {
            if (this._dropdownPanelO) {
                this._dropdownPanelO.hide();
            }
        },
        /**
         * 获取值。
         */
        _getValue: function () {
            return this._value$.val();
        },
        /**
         * 设置值。
         * 
         * @param {string | object} text 要显示的值或对象。
         */
        _setValue: function (value) {
            // 设置默认值。
            value = value || '';

            // 如果是对象，提前字段。
            if (typeof value == 'object') {
                value = this._extractValue(value);
            }

            // 设置。
            var self = this, oldValue = self._value$.val();
            if (oldValue != value) {
                self._value$.val(value);
                self._onChange(value, oldValue);
            }
        },
        /**
         * 提取显示值。
         * 
         * @param {object} 要提取的对象。
         * 
         * @return {string} 显示值。
         */
        _extractDisplay: function (item) {
            var displayField = this._options.fieldDisplay, value;
            if (displayField) {
                value = item[displayField];
            }
            return value || '';
        },
        /**
         * 提取值。 
         * 
         * @param {object} 要提取的对象。
         * 
         * @return {string} 显示值。
         */
        _extractValue: function (item) {
            var keyField = this._options.fieldValue, value;
            if (keyField) {
                value = item[keyField];
            }
            return value || '';
        },
        /**
         * 当输入值改变时触发。
         * 
         * @param {string} newValue 新值。
         * @param {string} oldValue 旧值。
         */
        _onChange: function (newValue, oldValue) {
            this._fireEvent('change', { newValue: newValue, oldValue: oldValue });
        }
    });

    /***********私有方法***********/

    return BreadCrumbTreeClass;
});