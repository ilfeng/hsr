/**
 * 带下拉树的编辑组件。
 *
 * @type {class}
 * 
 * @remark
 *     包含下拉面板、清除按钮、下拉按钮。
 */
define(['jquery', 'core', 'ui-editor-lookup', 'ui-tool-manager', 'ztree'], function ($, hsr, _super, ToolUtils) {
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
    function TreeLookupEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(TreeLookupEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-lookup-tree',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TreeLookupEditor'
    };

    $.extend(TreeLookupEditorClass, metedata);

    // 注册组件。
    ToolUtils.regiest(TreeLookupEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(TreeLookupEditorClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'onlyChild', value: false },  // 只选择子节点。
                { name: 'fieldParent', value: 'pId' }  // 父节点字段名称。
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
        },
        /**
         * 销毁控件本身。
         * 
         * @protected
         */
        _destroy: function () {
            var self = this;
            
            // 销毁树。
            if(self._tree$O) {
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
                    otherParam: {},
                    dataFilter: function(treeId, parentNode, result) {
                        if (result.status != "000000") return;
                        return result.data;
                    }
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
                            // 设置值。
                            self._setDisplay(treeNode);
                            self._setValue(treeNode);
                            // 关闭下拉面板。
                            self._closeDropdownPanel();
                        }
                    },
                    onAsyncSuccess: function (event, treeId, treeNode) {
                        var zTreeObj = $.fn.zTree.getZTreeObj(treeId);
                        // 展开所有节点。
                        zTreeObj.expandAll(true);

                        // 初始化初值。
                        // 1 -- 有初值，获取并显示；
                        // 2 -- 无初值且必选且可以选择非叶节点，获取根节点显示。
                        var node, value = self._value$.val();
                        if (hsr.StringUtils.isBlank(value)) {
                            // 2 -- 无初值且必选且可以选择非叶节点，获取跟节点显示。
                            if (options.required && !options.onlyChild) {
                                // 获取一个根节点。
                                node = zTreeObj.getNodesByFilter(function (node) {
                                    return node.level == 0;
                                }, true);
                                if (node) {
                                    //self._setDisplay(node);
                                }
                            }
                        } else {
                            // 1 -- 有初值，获取并显示。
                            // 根据值查找节点。
                            node = zTreeObj.getNodeByParam(options.fieldValue, value, null);
                            if (node) {
                                zTreeObj.selectNode(node);
                                self._setDisplay(node);
                            }
                        }
                    }
                }
            };
            
            // 初始化树。
            self._tree$O = $.fn.zTree.init(divTree$, treeSetting);
        },
        /**
         * 清除内容。
         */
        _clear: function () {
            var self = this;
            _superMethods._clear.call(self);
            
            // 取消所有节点选择状态。
            if(self._tree$O) {
                self._tree$O.checkAllNodes(false);
                self._tree$O.cancelSelectedNode();
            }
        }
    });

    /***********私有方法***********/

    return TreeLookupEditorClass;
});