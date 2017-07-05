define(['jquery', 'core'], function ($, hsr) {
	
	// 私有方法。
	var createEntry = function (v, x, y) {
        var entry = new Object();
        entry.v = v;
        entry.x = x;
        entry.y = y;
        return entry;
    };
	
    return {
        
        /**
         * 合并表格所用到
         * */
        formatTable: function (table$) {
            var c_map = new hsr.Dictionary();
            var r_map = new hsr.Dictionary();
            
            var t = $(table$).eq(0);
            var trs = t.find("tr");
            
            trs.each(function (i, e) {
                var tds = $(this).find("td");
                tds.each(function (j, e) {
                    var values = new Array();
                    if ($(this).attr("c") != undefined) {
                        var t_entry = createEntry($(this).attr("c"), i, j);
                        if (c_map.has(t_entry.v)) {
                            values = c_map.get(t_entry.v);
                            values.push(t_entry);
                        } else {
                            values.push(t_entry);
                            c_map.set(t_entry.v, values);
                        }
                    }
                    if ($(this).attr("r") != undefined) {
                        var t_entry = createEntry($(this).attr("r"), i, j);
                        if (r_map.has(t_entry.v)) {
                            values = r_map.get(t_entry.v);
                            values.push(t_entry);
                        } else {
                            values.push(t_entry);
                            r_map.set(t_entry.v, values);
                        }
                    }
                });
            });
            
            c_map.forEach(function(value, key){
            	t.find("tr:eq(" + value[0].x + ") td:eq(" + value[0].y + ")").attr("colspan", value.length).attr("align","center");;
                for (var i = 1; i < value.length; i++) {
                    t.find("tr:eq(" + value[i].x + ") td:eq(" + value[i].y + ")").attr("remove", true);
                }
            });
            r_map.forEach(function(value, key){
            	t.find("tr:eq(" + value[0].x + ") td:eq(" + value[0].y + ")").attr("rowspan", value.length).attr("valign","middle");
                for (var i = 1; i < value.length; i++) {
                    t.find("tr:eq(" + value[i].x + ") td:eq(" + value[i].y + ")").attr("remove", true);
                }
            });
            $("[remove='true']").each(function (i, e) {
                $(this).remove();
            });
        },
        
        /**
         * 合并列表单元格-表头
         */
        formatTableTh: function (table$) {
            var c_map = new hsr.Dictionary();
            var r_map = new hsr.Dictionary();
            var t = $(table$).eq(0);
            var trs = t.find("tr");
            trs.each(function (i, e) {
                var tds = $(this).find("th");
                tds.each(function (j, e) {               
                    var values_c = new Array();
                    if ($(this).attr("c") != undefined) {
                        var t_entry = createEntry($(this).attr("c"), i, j);
                        if (c_map.has(t_entry.v)) {
                        	values_c = c_map.get(t_entry.v);
                        	values_c.push(t_entry);
                        } else {
                        	values_c.push(t_entry);
                            c_map.set(t_entry.v, values_c);
                        }
                    }
                });
            });
            c_map.forEach(function(value, key){
            	var obj_th=  t.find("tr:eq(" + value[0].x + ") th:eq(" + value[0].y + ")")
            	//计算宽度
            	//$(obj_th).width($(obj_th).width()*kkk.length);
            	obj_th.css('width', obj_th.outerWidth() * value.length)
            		  .attr("colspan", value.length)
            		  .attr("align","center");;
                for (var i = 1; i < value.length; i++) {
                    t.find("tr:eq(" + value[i].x + ") th:eq(" + value[i].y + ")")
                     .attr("oper", "remove");
                }
            });
            $("th[oper='remove']").each(function (i, e) {
                $(this).remove();
            });
            trs.each(function (i, e) {
                var tds = $(this).find("th");
                tds.each(function (j, e) {               
                    var values_r = new Array();
                    if ($(this).attr("r") != undefined) {
                        var t_entry = createEntry($(this).attr("r"), i, j);
                        if (r_map.has(t_entry.v)) {
                        	values_r = r_map.get(t_entry.v);
                        	values_r.push(t_entry);
                        } else {
                        	values_r.push(t_entry);
                            r_map.set(t_entry.v, values_r);
                        }
                    }
                });
            });
            r_map.forEach(function(value, key){
            	t.find("tr:eq(" + value[0].x + ") th:eq(" + value[0].y + ")").attr("rowspan", value.length).attr("valign","middle");
                for (i = 1; i < value.length; i++) {
                    t.find("tr:eq(" + value[i].x + ") th:eq(" + value[i].y + ")").attr("oper", "remove");
                }
            });
            $("th[oper='remove']").each(function (i, e) {
                $(this).remove();
            });
        }
    };
});