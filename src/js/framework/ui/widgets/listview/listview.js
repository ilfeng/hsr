/**
 * 列表视图控件。
 *
 * @type {class}
 * 
 * @remark 
 *     一般情况下不需要加载列表视图控件，使用 CSS 样式即可。
 *     加载列表视图控件主要为了进行横向分组显示。
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
    function ListViewClass(element, options) {
        // 私有属性。
        var self = this;

        // 特权属性。

        // 继承父类。
        _super.call(self, element, options);
    }
        
    // 继承父类。
    hsr.inherit(ListViewClass, _super);

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
        cssClass: '@CSS_PREFIX@listview',
        /**
         * 名称。
         * @type {string}
         * @readonly
         */
        typeName: 'ListView'
    };

    $.extend(ListViewClass, metedata);

    // 注册组件。
    ToolUtils.regiest(ListViewClass);

    /***********公共(及特权)方法***********/
    $.extend(ListViewClass.prototype, metedata, {
        /**
         * 创建配置属性。
         * 
         * @returns {array} 配置属性信息。
         * 
         * @protected
         */
        _createOptionProperties: function () {
            return [
                { name: 'fit', value: true },
                { name: 'transverse', value: false }   // 横向扩展模式。
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

            // 横向模式。
            if (options.transverse) {
                self._enableMouseWheel();
            }
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

            // 横向模式。
            if (options.transverse) {
                self._transverse();
            }
        },
        /**
         * 启用鼠标滚轮。
         */
        _enableMouseWheel: function () {
            var element = this._element$[0];
            if (!element) return;
            
            // 滚动条。
            var mousewheel_event = function (e) {
                var ee = e || window.event, v;
                ee.wheelDelta ? v = ee.wheelDelta : v = ee.detail;
                if (v > 3 || -v > 3) v = -v;
                v > 0 ? element.scrollLeft += 100 : element.scrollLeft -= 100;
            };

            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', mousewheel_event, false); // FF
            }

            element.onmousewheel = mousewheel_event; // IE/Opera/Chrome
        },
        /**
         * 横向排列。
         * 
         * @remark
         *    对于每一个 hsrui-list，逐次循环子项，计算宽度和高度，以及排列位置（使用相对父元素定位）。
         */
        _transverse: function() {
            var element$ = this._element$;
            
			$('.hsrui-list', element$).each(function() {
				var list$ = $(this);
				
				// 滚动条 20px 。
				var maxHeight = element$.height() - list$.parent().find('.hsrui-listgroup-title').outerHeight() - 20;

				var top = 0, left = 0, h = 0, w = 0;

				list$.children('li').css({
					position : 'absolute'
				}).each(function() {
					var li$ = $(this);

					h = li$.outerHeight(true);
					w = li$.outerWidth(true);
					
					if(top + h > maxHeight) {
						top = 0;
						left += w;
					}

					li$.css({
						top : top,
						left : left
					});
					
					top += h;
				});
				
				list$.css({
					height: maxHeight,
					width: left + w
				});
			});
        }
    });

    /***********私有方法***********/

    return ListViewClass;
});