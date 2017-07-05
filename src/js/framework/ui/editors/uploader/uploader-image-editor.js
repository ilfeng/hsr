/**
 * Uploader 模块。
 * 
 * @author wl
 * 
 * @since 2015-05-05
 */
define([ 'jquery', 'core', 'ui-editor', 'ui-tool-manager' ], function($, hsr,
		_super, ToolUtils) {
	'use strict';

	var _superMethods = _super.prototype;

	/**
	 * 构造方法。
	 * 
	 * @param {HTMLElement |jQuery} element 主元素。
	 * @param {object}options 配置项。
	 * 
	 * @constructor
	 */
	function UploaderImageEditorClass(element, options) {
		// 私有属性。
		var self = this;

		// 特权属性。

		// 继承父类。
		_super.call(self, element, options);
	}

	// 继承父类。
	hsr.inherit(UploaderImageEditorClass, _super);

	/** *********元数据********** */
	var metedata = {
		/**
		 * 版本。
		 * 
		 * @type {string}
		 * @readonly
		 */
		version : '@VERSION@',
		/**
		 * 样式类。
		 * 
		 * @type {string}
		 * @readonly
		 */
		cssClass : '@CSS_PREFIX@editor-image-uploader',
		/**
		 * 名称。
		 * 
		 * @type {string}
		 * @readonly
		 */
		typeName : 'UploaderImageEditor'
	};

	$.extend(UploaderImageEditorClass, metedata);

	// 注册组件。
	ToolUtils.regiest(UploaderImageEditorClass);

	/** *********公共(及特权)方法********** */
	$.extend(UploaderImageEditorClass.prototype, metedata, {
		/**
		 * 创建配置属性。
		 * 
		 * @returns {array} 配置属性信息。
		 * 
		 * @protected
		 */
		_createOptionProperties : function() {
			return [];
		},
		/**
		 * 创建控件。
		 * 
		 * @param {jQuery}
		 *            element$ 主元素。
		 * @param {object}
		 *            options 配置项。
		 * 
		 * @protected
		 */
		_create : function(element$, options) {

			_super.prototype._create.call(this, element$);

			var self = this;

			self._previewPanel$ = $('.preview', element$);
			self._uploadPanel$ = $('.upload', element$);
			self._uploadInput$ = $('input[type="file"]', element$);
			self._uploadValue$ = $('input.hsrui-upload-value', element$);

			// 删除。
			$('.hsrui-btn-delete', element$).on('click', function() {
				// 切换面板。
				self._previewPanel$.hide();
				self._uploadPanel$.show();

				// 更改上传输入状态。
				self._uploadInput$.prop('disabled', false);
				self._uploadValue$.val(self._uploadValue$.val()+'-x');
			});

			// 恢复。
			$('.hsrui-btn-recover', element$).on('click', function() {
				// 切换面板。
				self._previewPanel$.show();
				self._uploadPanel$.hide();

				// 更改上传输入状态。
				self._uploadInput$.prop('disabled', true);
				self._uploadValue$.val(self._uploadValue$.val().replace("-x", ""));
			});
		},
		/**
		 * 关闭控件。
		 * 
		 * @param {jQuery}
		 *            element$ 主元素。
		 * @param {object}
		 *            options 配置项。
		 * 
		 * @protected
		 */

		_destroy : function() {
			_superMethods._destroy.call(this);
		}
	});

	/** *********私有方法********** */

	return UploaderImageEditorClass;
});