/**
 * 下拉面板基类。
 *
 * @type {class}
 * 
 * @remark
 *   下拉面板的一般性操作。
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
    function DropdownPanelClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._isHidden = true;

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。 
    hsr.inherit(DropdownPanelClass, _super);

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
        cssClass: '@CSS_PREFIX@dropdown-panel',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'DropdownPanel'
    };

    $.extend(DropdownPanelClass, metedata);

    // 注册组件（基类）。
    ToolUtils.regiest(DropdownPanelClass);
    
    /***********类(静态)方法***********/
    /**
     * 创建面板。
     * 
     * @parma {jQuery} editor$ 编辑控件的主元素。
     * @param {object} options 配置项。
     * 
     * @return {object} 下拉面板控件。
     */
    DropdownPanelClass.create = function (editor$, options) {
        var cssClass = DropdownPanelClass.cssClass,
            dropdown$ = $('.' + cssClass, editor$);

        if (dropdown$.length <= 0) {
            // 没有找到，创建一个。
            dropdown$ = $('<div class="' + cssClass + '"><div class="content"></div></div>');
        }

        // 移动面板到页面底部。
        // iframe 支持：如果控件在 iframe 中，调整面板到顶级窗口页面底部。
        dropdown$.remove().appendTo(window.top.$('body'));

        // 创建下拉面板控件。
        return new DropdownPanelClass(dropdown$, $.extend(options, { editor: editor$ }));
    };

    /***********公共(及特权)方法***********/
    $.extend(DropdownPanelClass.prototype, metedata, {
        show: function () {
            var self = this;

            // 已经显示不再处理。
            if (!self._isHidden) return;

            // 重新计算元素位置。
            self._reckonPosition();
            // 隐藏元素。
            self._element$.show();
            self._isHidden = false;

            // 绑定事件。
            $([window.top, window]).on('mousedown.ui@EVENT_POSTFIX@ resize.ui@EVENT_POSTFIX@', function () {
                self.hide();
                return false;
            });
        },
        hide: function () {
            var self = this;
            
            // 已经隐藏不再处理。
            if (self._isHidden) return;

            // 隐藏元素。
            self._element$.hide();
            self._isHidden = true;

            // 移除所有事件。
            $([window.top, window]).off('.ui@EVENT_POSTFIX@');
        },
        /**
         * 切换面板显示状态。
         */
        toggle: function () {
            var self = this;
            if (self._isHidden) {
                self.show();
            } else {
                self.hide();
            }
        },
        /**
         * 获取内容元素。
         * 
         * @return {jQuery} 内容元素。
         */
        getContentElement: function () {
            return this._content$;
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

            // TODO 是否直接使用'panel-body'元素。
            self._content$ = $('.content', element$);

            // 点击面板不关闭。
            element$.on('mousedown', function() {
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
         * 重新计算元素位置。
         */
        _reckonPosition: function () {
            var self = this, panel$ = self._element$, editor$ = self._options.editor,
                offset = editor$.offset(), editorHeight = editor$.outerHeight(), editorWidth = editor$.outerWidth(),
                windowCurrent = window, windowParent = window.parent, windowTop = window.top,
                windowTopHeight = $(windowTop).height(), windowTopWidth = $(windowTop).width();

            // 先恢复原始大小，然后重新计算。
            panel$.css({ height: '', width: '' });
            var panelHeight = panel$.height(), panelWidth = panel$.width();

            // iframe 追溯。
            while (windowCurrent != windowTop) {
                // 扫描所有框架：找到当前框架，并修正偏移位置。
                $(windowParent.document).find('iframe').each(function (i, o) {
                    if (o.contentWindow && o.contentWindow == windowCurrent) {
                        var iframeOffset = $(o).offset();
                        offset.top += iframeOffset.top;
                        offset.left += iframeOffset.left;
                    }
                });

                windowCurrent = windowParent;
                windowParent = windowCurrent.parent;
            }

            // 计算放置到上边或下边。如果都放不下，缩减下拉框高度。
            var top = offset.top, bottom = windowTopHeight - offset.top - editorHeight;
            if (bottom > panelHeight) {
                top += editorHeight;
            } else if (top > panelHeight) {
                top -= panelHeight;
            } else if (bottom > top) {
                panel$.css('height', bottom);
                top += editorHeight;
            } else {
                panel$.css('height', top);
                top = 0;
            }

            // 计算放置到左边或右边。如果都放不下，缩减下拉框宽度。
            var left = offset.left + editorWidth, right = windowTopWidth - offset.left;
            if (right > panelWidth) {
                left = offset.left;
            } else if (left > panelWidth) {
                left -= panelWidth;
            } else if (right > left) {
                panel$.css('width', right);
                left = offset.left;
            } else {
                panel$.css('width', left);
                left = 0;
            }

            // 设置下拉面板位置。
            panel$.css({ top: top, left: left });
        }
    });

    /***********私有方法***********/

    return DropdownPanelClass;
});