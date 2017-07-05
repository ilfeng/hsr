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
    function TabbedScrollBarClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。
        self._labelOs = [];                      // 所有标签。
        self._scrollVisiblity = false;           // 滚动条是否可见。
        self._labelMaxWidthTotal = 0;            // 所以标签宽度。
        self._labelActiveO = null;               // 当前选择的标签。
        self._labelActiveOIndex = 0;             // 当前选择的标签序号。
        self._labelLeftIndex = 0;                // （标签可视区域中）最左边标签序号。
        self._labelRightIndex = 0;               // （标签可视区域中）最右边标签序号。
        self._scrollAnimateFinish = true;        // 滚动动画是否已经播放完毕。

        // 继承父类。
        _super.call(self, element, options);

        // 初始化滚动条。
        self._updateSize();
        self._showScroll();
        self._updateSize();
    }

    // 继承父类。
    hsr.inherit(TabbedScrollBarClass, _super);

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
        typeName: 'TabbedScrollBar'
    };

    $.extend(TabbedScrollBarClass, metedata);

    /***********公共(及特权)方法***********/
    $.extend(TabbedScrollBarClass.prototype, metedata, {
        /**
         * 添加卡片。
         *
         * @param {TabOptions} options 标签配置。
         */
        addLabel: function (options) {
            this._addLabel(options);
        },
        /**
         * 移除标签。
         *
         * @param {string} id 标签标识。
         */
        removeLabel: function (id) {
            var labelO = this._getLabelById(id);
            if (labelO) {
                this._removeLabel(labelO);
            }
        },
        /**
         * 移除所有标签。
         */
        clearLabels: function () {
            this._clearLabel();
        },
        /**
         * 获取所有标签。
         * @returns {Dictionary} 标签集合。
         */
        getLabels: function () {
            return this._labelOs;
        },
        /**
         * 获取被激活的标签。
         *
         * @returns {TabLabel} 标签。
         */
        getActiveLabel: function () {
            return this._getActiveLabel();
        },
        /**
         * 获取标签数量。
         *
         * @returns {int} 标签数量。
         */
        getLabelCount: function () {
            return this._labelOs.size;
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

            self._scrollBar$ = $('<div />').addClass('@CSS_PREFIX@tabbed-scrollbar').appendTo(self._element$);
            self._spacer$ = $('<div />').addClass('@CSS_PREFIX@tabbed-spacer').appendTo(self._element$);

            self._scrollLeft$ = $('<div />').addClass('@CSS_PREFIX@tabbed-scroll-button left').addClass('none').appendTo(self._scrollBar$);
            self._scrollSight$ = $('<div />').addClass('@CSS_PREFIX@tabbed-scroll-sight').appendTo(self._scrollBar$);
            self._scrollRight$ = $('<div />').addClass('@CSS_PREFIX@tabbed-scroll-button right').addClass('none').appendTo(self._scrollBar$);

            self._labelContainer$ = $('<ul />').addClass('@CSS_PREFIX@tabbed-nav').appendTo(self._scrollSight$);

            // 根据配置项进行设置。
            if (!self._options.allowScroll) {
                self._scrollLeft$.addClass('none');
                self._scrollRight$.addClass('none');
                self._scrollVisiblity = false;
            }

            // 绑定事件。
            // 向左移动。
            this._scrollLeft$.on('click', function () {
                self._moveLeft();
                return false;
            });
            // 向右移动。
            this._scrollRight$.on('click', function () {
                self._moveRight();
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

            self._updateSize();
            self._useableScroll();
            self._showScroll();
            self._updateSize();

            var labelActivedO = self._getActiveLabel();
            if (labelActivedO) {
                self._showLabel(labelActivedO);
            }
        },
        /**
         * 计算所有标签宽度。
         */
        _reckonLabelWidth: function () {
            var width = 0;
            this._labelOs.forEach(function (o) {
                width += o.getWidth();
            });
            return width;
        },
        /**
         * 更新滚动区域大小。
         */
        _updateSize: function () {
            var self = this, scrollBarWidth = self._element$.width(), scrollButtonWidth = 0;
            self._scrollBar$.css('width', scrollBarWidth + 'px');
            if (self._scrollVisiblity) {
                scrollButtonWidth = self._scrollLeft$.outerWidth() + self._scrollRight$.outerWidth();
            }
            self._scrollSight$.css('width', (scrollBarWidth - scrollButtonWidth) + 'px');
        },
        /**
         * 获取当前激活的索引。
         */
        _getActiveLabel: function () {
            var labelO = null;
            this._labelOs.forEach(function (o) {
                if (o.isActive()) {
                    labelO = o;
                    return false;
                }
            });
            return labelO;
        },
        /**
         * 向左移动一个标签。
         */
        _moveLeft: function () {
            // 偏移量。
            var self = this,
                marginLeft = self._getLabelMarginLeft(),
                leftTabIndex = 0;

            // 获取最左边索引。
            self._labelOs.forEach(function (o, i) {
                var vRight = o.getRight() + marginLeft;

                if (vRight > 0) {
                    leftTabIndex = i;

                    var vLeft = o.getLeft() + marginLeft;
                    if (vLeft >= 0) {
                        leftTabIndex--;
                        if (leftTabIndex < 0) {
                            leftTabIndex = 0;
                        }
                    }
                    return false;
                }
            });

            if (leftTabIndex >= 0 && self._scrollVisiblity && self._scrollAnimateFinish) {
                var labelO = self._labelOs[leftTabIndex];
                self._moveLabel(labelO.getLeft() * -1);
            }
        },
        /**
         * 向右移动一个标签。
         */
        _moveRight: function () {
            // 偏移量。
            var self = this,
                rightTabIndex = 0,
                labelOLength = self._labelOs.length,
                marginLeft = self._getLabelMarginLeft(),
                viewportWidth = self._scrollSight$.width();

            self._labelOs.forEach(function (o, i) {
                var vLeft = o.getLeft() + marginLeft;
                var vRight = o.getRight() + marginLeft;

                if (vLeft > viewportWidth || vRight >= viewportWidth) {
                    rightTabIndex = i;
                    if (vRight == viewportWidth) {
                        rightTabIndex++;
                        if (rightTabIndex >= labelOLength) {
                            rightTabIndex = labelOLength - 1;
                        }
                    }
                    return false;
                }
            });

            if (rightTabIndex < self._labelOs.length && self._scrollVisiblity && self._scrollAnimateFinish) {
                var labelO = self._labelOs[rightTabIndex], liRight = labelO.getRight();

                self._moveLabel(viewportWidth - liRight);
            }
        },
        /**
         * 
         */
        _isInViewport: function (labelO) {
            // 偏移量。
            var marginLeft = this._getLabelMarginLeft(),
                viewportWidth = this._scrollSight$.width(),
                vLeft = labelO.getLeft() + marginLeft,
                vRight = labelO.getRight() + marginLeft;

            if (vLeft >= 0 && vRight <= viewportWidth) {
                return true;
            }

            return false;
        },
        /**
         * 向左移动到最左边。
         */
        _moveToLeft: function () {
            var self = this;
            if (self._scrollVisiblity && self._scrollAnimateFinish) {
                self._moveLabel(0);
            }
        },
        /**
         * 向右移动到最右边。
         */
        _moveToRight: function () {
            var self = this;
            if (self._scrollVisiblity && self._scrollAnimateFinish) {
                var lisWidth = self._reckonLabelWidth(),
                    viewportWidth = self._scrollSight$.width();

                self._moveLabel(viewportWidth - lisWidth);
            }
        },
        /**
         * 移动标签页可见。
         */
        _moveToSee: function (labelO) {
            var self = this;
            if (self._scrollVisiblity) {
                var marginLeft = self._getLabelMarginLeft(),
                    viewportWidth = self._scrollSight$.width(),
                    liLeft = labelO.getLeft(),
                    liRight = liLeft + labelO.getWidth(),
                    vLeft = liLeft + marginLeft,
                    vRight = liRight + marginLeft;

                if (vLeft >= 0 && vRight <= viewportWidth) {
                    // 标签在视口范围内。
                    // 如果有右侧空余量，向右移动到尽可能填满。
                    var labelMaxWidthTotal = self._reckonLabelWidth(),
                        spaceWidth = viewportWidth - labelMaxWidthTotal - marginLeft;
                    if (spaceWidth > 0) {
                        if (spaceWidth < Math.abs(marginLeft)) {
                            self._moveLabel(marginLeft + spaceWidth);
                        } else {
                            self._moveLabel(0);
                        }
                    }
                } else if (vLeft < 0) {
                    // 标签在视口左边且不可见（部分或全部）。
                    self._moveLabel(liLeft * -1);
                } else if (vRight > viewportWidth) {
                    // 标签在视口右边且不可见（部分或全部）。
                    self._moveLabel(viewportWidth - liRight);
                }
            }
        },
        /**
         * 移动标签。
         * @param {number} marginLeft 左偏移量。
         * @private
         */
        _moveLabel: function (marginLeft) {
            var self = this;
            self._disableScroll();
            self._scrollAnimateFinish = false;

            self._labelContainer$.animate({
                marginLeft: marginLeft
            }, 1000, function () {
                self._useableScroll();
            });
        },
        /**
         * 
         */
        _getLabelMarginLeft: function () {
            return parseInt(this._labelContainer$.css('marginLeft'));
        },
        /**
         * 显示滚动条。
         */
        _showScroll: function () {
            var self = this, viewportWidth = self._scrollSight$.width();
            // 计算所有卡片的宽度。
            self._labelMaxWidthTotal = self._reckonLabelWidth();

            if (self._labelMaxWidthTotal > viewportWidth) {
                // 所有标签宽度大于可视宽度：显示滚动按钮。
                self._scrollLeft$.removeClass('none');
                self._scrollRight$.removeClass('none');
                self._scrollVisiblity = true;
            } else if (this._labelMaxWidthTotal <= viewportWidth) {
                // 所有标签宽度小于可视宽度：先移动到左边，移除滚动条。
                self._moveToLeft();
                self._scrollLeft$.addClass('none');
                self._scrollRight$.addClass('none');
                self._scrollVisiblity = false;
                self._scrollAnimateFinish = true;
            }

            // 设置间距宽度。
            if (self._scrollVisiblity) {
                self._spacer$.css('width', this._element$.width());
            } else {
                self._spacer$.css('width', self._labelMaxWidthTotal + 2);
            }
        },
        /**
         * 滚动是否有效。
         */
        _useableScroll: function () {
            var self = this;
            if (self._scrollVisiblity) {
                // 偏移量。
                var marginLeft = self._getLabelMarginLeft(),
                    viewportWidth = self._scrollSight$.width();

                if (marginLeft == 0) {
                    // 滚动到了左边，禁用向左移动按钮。
                    self._scrollLeft$.addClass('disable');
                    self._scrollLeft$.attr('disabled', true);
                    self._scrollRight$.removeClass('disable');
                    self._scrollRight$.attr('disabled', false);
                }
                else if (marginLeft * -1 == self._labelMaxWidthTotal - viewportWidth) {
                    // 滚动到了右边，禁用向右移动按钮。
                    self._scrollLeft$.removeClass('disable');
                    self._scrollLeft$.attr('disabled', false);
                    self._scrollRight$.addClass('disable');
                    self._scrollRight$.attr('disabled', true);
                } else {
                    // 滚动到中间，向左向右滚动按钮可用。
                    self._scrollLeft$.removeClass('disable');
                    self._scrollLeft$.attr('disabled', false);
                    self._scrollRight$.removeClass('disable');
                    self._scrollRight$.attr('disabled', false);
                }
            }

            // 滚动动画结束。
            self._scrollAnimateFinish = true;
        },
        /**
         * 禁用滚动。
         */
        _disableScroll: function () {
            var self = this;
            self._scrollLeft$.addClass('disable');
            self._scrollLeft$.prop('disabled', true);
            self._scrollRight$.addClass('disable');
            self._scrollRight$.prop('disabled', true);
        },
        /**
         * 根据配置添加标签。
         *
         * @param {object} options 标签配置。
         */
        _addLabel: function (options) {
            var self = this,
                id = options.id = self._createLabelId(options),
                labelO = this._getLabelById(id);

            if (labelO) {
                // 存在标签，直接显示。
                self._showLabel(labelO);
            } else if (self._scrollAnimateFinish) {
                // 超过最大数量不再添加。
                if (self._labelOs.length >= self._options.max) {
                    self._onLabelsOverflow();
                    return;
                }

                // 创建标签。
                var label$ = $('#' + id);
                if (label$.length == 0) {
                    label$ = $('<li />').attr('id', id).addClass('@CSS_PREFIX@tabbed-label').appendTo(self._labelContainer$);
                }

                labelO = self._createLabel(label$, options);

                //
                self._showScroll();
                self._updateSize();
                self._showLabel(labelO);
            }
        },
        /**
         * 生成标签序号。
         * @param {PlainObject} options 标签配置。
         * @returns {string} 标签序号。
         * @private
         */
        _createLabelId: function (options) {
            return options.id || 'tl-' + options.tab;
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
            self._labelOs.push(labelO);

            self._onLabelAdded(labelO);

            // 事件绑定。
            labelO.on('@EVENT_TABBED_LABEL_CLICK@', function (e, sender) {
                self._showLabel(sender);
                return false;
            }).on('@EVENT_TABBED_LABEL_ACTIVATED@', function (e, sender) {
                self._onLabelActivated(sender);
                return false;
            }).on('@EVENT_TABBED_LABEL_CLOSE@', function (e, sender) {
                self._removeLabel(sender);
                return false;
            });

            return labelO;
        },
        /**
         * 显示标签。
         * @param {TabbedLabel} labelO 标签。
         * @private
         */
        _showLabel: function (labelO) {
            var self = this;
            // 显示主容器。
            self._element$.show();

            // 标签不是激活的，设置内容并激活。
            if (!labelO.isActive()) {
                // 移除原来的激活卡片。
                var activeLabelO = self._getActiveLabel();
                if (activeLabelO) {
                    activeLabelO.removeActive();
                }

                // 设置为激活状态。
                labelO.setActive();
            }

            self._moveToSee(labelO);
        },
        /**
         * 移除标签。
         * @param {TabbedLabel} labelO 标签。
         * @private
         */
        _removeLabel: function (labelO) {
            var self = this, nextLabelO;
            // 从集合中移除。
            var index = self._getLabelIndex(labelO);
            if (index >= 0) {
                self._labelOs.splice(index, 1);
            }

            // 如果移除的是焦点标签，则获取前一个标签；否则获取焦点标签。
            if (labelO.isActive()) {
                if (self._labelOs.length > 0) {
                    index = index == 0 ? 0 : index - 1;
                    nextLabelO = self._labelOs[index];
                }
            } else {
                nextLabelO = self._getActiveLabel();
            }

            // TODO: 必须放到获取 NextTab 的后边，否则 isActive 方法抛出异常。
            labelO.destroy();
            self._onLabelRemoved(labelO);

            if (nextLabelO) {
                self._showLabel(nextLabelO);
            } else {
                // 找不到其它标签。
                self._onLabelsEmpty();
            }

            self._showScroll();
            self._updateSize();
        },
        /**
         * 清空标签。
         * @private
         */
        _clearLabels: function () {
            var self = this;
            self._labelOs.forEach(function (o) {
                o.destroy();
            });

            self._labelOs.length = 0;
            self._onLabelsEmpty();

            self._showScroll();
            self._updateSize();
        },
        /**
         * 根据编号获取卡片。
         */
        _getLabelById: function (labelId) {
            var labelO;
            this._labelOs.forEach(function (o) {
                if (labelId == o.getId()) {
                    labelO = o;
                    return false;
                }
            });
            return labelO;
        },
        /**
         * 根据卡片获取卡片序号。
         */
        _getLabelIndex: function (labelO) {
            var index = -1;
            this._labelOs.forEach(function (o, i) {
                if (labelO.getId() == o.getId()) {
                    index = i;
                    return false;
                }
            });
            return index;
        },
        /**
         * 
         */
        _onLabelActivated: function (labelO) {
            this._fireEvent('@EVENT_TABBED_LABEL_ACTIVATED@', labelO);
        },
        /**
         * 
         */
        _onLabelAdded: function (labelO) {
            this._fireEvent('@EVENT_TABBED_LABEL_ADDED@', labelO);
        },
        /**
         * 
         */
        _onLabelRemoved: function (labelO) {
            this._fireEvent('@EVENT_TABBED_LABEL_REMOVED@', labelO);
        },
        /**
         * 
         */
        _onLabelsEmpty: function () {
            this._fireEvent('@EVENT_TABBED_LABELS_EMPTY@');
        },
        /**
         * 
         */
        _onLabelsOverflow: function () {
            this._fireEvent('@EVENT_TABBED_LABELS_OVERFLOW@');
        }
    });

    /***********私有方法***********/

    return TabbedScrollBarClass;
});