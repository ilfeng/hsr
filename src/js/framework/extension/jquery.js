/**
 * jQuery 扩展模块。
 */
define(['jquery'], function ($) {

    /**
	 * Form 数据转换为 JSON 对象。
	 */
    $.serializeObject = function (form$) {
        var o = {};
        $.each(form$.serializeArray(), function (index) {
			var name = this['name'], value = this['value'], cache = o[name];
            if (cache) {
                o[name] = cache + ',' + value;
            } else {
                o[name] = value;
            }
        });
        return o;
    };
	
	
});