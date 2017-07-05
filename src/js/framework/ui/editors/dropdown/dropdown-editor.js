/**
 * 下拉编辑组件基类。
 *
 * @type {class}
 * 
 * @remark
 *     下拉面板的一般性操作。
 *     当离开焦点时，自动关闭下拉面板。
 */
define([
    'jquery', 'core', 'ui-editor', 'ui-tool-manager', 'ui-dropdown-panel'
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
    function DropdownEditorClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._panelInited = false;   // 指示下拉面板是否初始化过。
        self._panelOpened = false;   // 指示下拉面板是否被打开。

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(DropdownEditorClass, _super);

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
        cssClass: '@CSS_PREFIX@editor-dropdown',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'Editor'
    };

    $.extend(DropdownEditorClass, metedata);

    // 注册组件（基类）。
    ToolUtils.regiestBaseClass(DropdownEditorClass);

    /***********公共(及特权)方法***********/
    $.extend(DropdownEditorClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                // { name: 'required', value: false } // 是否必填。
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
            
            // 文本框。
            self._display$.on('mousedown.dropdown@EVENT_POSTFIX@', function (e) {
                e.stopPropagation();
            }).on('keyup.dropdown@EVENT_POSTFIX@', function (e) {
                switch (e.keyCode) {
                    case 37:	// left
                    case 38:	// up: 选择上一个项。
                        break;
                    case 39:	// right
                    case 40:	// down: 选择下一个项。
                        break;
                    case 13:	// enter: 选择当前项。
                    
                        break;
                    case 27:	// esc: 关闭选择。
                        break;
                    default:  // 过滤选择项。
                    //if (options.editable) {
                    //    options.filter.call(target, $(this).val());
                    //}
                }
                return false;
            });

            // 清除按钮。
            self._clearButton$ = $('.@CSS_PREFIX@editor-button.clear', element$).on('click', function () {
                self._onClearButtonClick($(this));
            });

            // 下拉按钮。
            self._arrowButton$ = $('.@CSS_PREFIX@editor-button.arrow', element$).on('click', function () {
                self._display$.focus();
                self._onArrowButtonClick($(this));
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

            // 清除下拉面板。
            if (self._dropdownPanelO) {
                self._dropdownPanelO.destroy();
                self._dropdownPanelO = null;
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
            
            // 页面变动自动关闭面板。
            self._closeDropdownPanel();
        },
        /**
         * 清除按钮点击事件。
         * 
         * @param {jQuery} button$ 按钮元素。
         */
        _onClearButtonClick: function (button$) {
            this.clear();
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
         * 离开焦点。
         */
        _onBlur: function () {
            var self = this;
            // TODO 当焦点转移到本控件内的其它元素时，不触发事件。
            // 焦点离开时，关闭下拉面板。
            // self._closeDropdownPanel();
            _superMethods._onBlur.call(self);
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
        }
    });

    /***********私有方法***********/

    return DropdownEditorClass;
});