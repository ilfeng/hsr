/**
 * 卡片控件。
 *
 * @type {class}
 */
define(['jquery', 'core', 'ui-control', 'tabbed-label'], function ($, hsr, _super, TabbedLabelClass) {
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
    function TabbedBarClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._labelOs = new hsr.Dictionary();
        self._labelActiveO = null;

        // 继承父类。
        _super.call(self, element, options);
    }

    // 继承父类。
    hsr.inherit(TabbedBarClass, _super);

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
        cssClass: '@CSS_PREFIX@tabbed-bar',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'TabbedBar'
    };

    $.extend(TabbedBarClass, metedata);

    /***********公共(及特权)方法***********/
    $.extend(TabbedBarClass.prototype, metedata, {
        /**
         * 添加标签。
         *
         * @param {TabOptions} options 标签配置。
         */
        addLabel: function () {

        },
        /**
         * 移除标签。
         *
         * @param {string} id 标签标识。
         */
        removeLabel: function (id) {

        },
        /**
         * 移除所有标签。
         */
        clearLabels: function () {

        },
        /**
         * 获取所有标签。
         * @returns {Dictionary} 标签集合。
         */
        getLabels: function () {
            return this._labelOs;
        },
        /**
         * 获取标签数量。
         *
         * @returns {int} 标签数量。
         */
        getLabelCount: function () {
            return this._labelOs.size();
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
            
            // 加载已有标签。
            self._labelContainer$ = $('.@CSS_PREFIX@tabbed-nav > li', element$);

            self._labelContainer$.each(function () {
                var labelO = self._createLabel($(this));

                if (labelO.isActive()) {
                    self._labelActiveO = labelO;
                }
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

            if (self._labelActiveO) {
                self._labelActiveO = null;
            }
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
         * 生成标签。
         * @param {jQuery} label$ 标签元素。
         * @param {PlainObject} options 标签配置。
         * @returns {TabbedLabel} 标签。
         * @private
         */
        _createLabel: function (label$, options) {
            var self = this, labelO = new TabbedLabelClass(label$, options);

            labelO.on('@EVENT_TABBED_LABEL_CLICK@', function (e, sender) {
                self._showLabel(sender);
                return false;
            }).on('@EVENT_TABBED_LABEL_ACTIVATED@', function (e, sender) {
                self._onLabelActivated(sender);
                return false;
            }).on('@EVENT_TABBED_LABEL_CLOSE@', function (event, sender, data) {
                self._removeLabel(sender);
                return false;
            });

            self._labelOs.set(labelO.getId(), labelO);

            return labelO;
        },
        _addLabel: function (options) {
            var label$ = $('li').appendTo(this._element$);
            var labelO = this._createLabel(label$, options);
            this._onLabelAdded(labelO);
        },
        /**
         * 显示标签。
         * @param {TabbedLabel} labelO 标签。
         * @private
         */
        _showLabel: function (labelO) {
            // 标签不是激活的，激活之。
            if (!labelO.isActive()) {
                this._labelActiveO.removeActive();
                this._labelActiveO = labelO;

                labelO.setActive();
            }
        },
        /**
         * 移除标签。
         * @param {TabbedLabel} labelO 标签。
         * @private
         */
        _removeLabel: function (labelO) {
            this._labelOs.remove(labelO.getId());
            labelO.destroy();
            this._onLabelRemoved(labelO);
        },
        _clearLabels: function () {
        },
        _onLabelAdded: function (labelO) {
            this._labelOs.set(labelO.getId(), labelO);
            this._fireEvent('@EVENT_TABBED_LABEL_ADDED@', labelO);
        },
        _onLabelActivated: function (labelO) {
            this._fireEvent('@EVENT_TABBED_LABEL_ACTIVATED@', labelO);
        },
        _onLabelRemoved: function (labelO) {
            this._fireEvent('@EVENT_TABBED_LABEL_REMOVED@', labelO);
        }
    });

    /***********私有方法***********/

    return TabbedBarClass;
});