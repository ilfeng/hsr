define(['jquery', 'core'], function ($, hsr) {
    'use strict';

    return {
        /**
         * 生成对象的配置属性集合。
         * 
         * @param {object} 要扫描的对象。
         * 
         * @return {array} 配置属性集合。
         */
        createOptionProperties: function (obj) {
            var properties = [], _parent = Object.getPrototypeOf(obj);
            
            // 依次扫描父类。
            // 构建有效的属性集合：子类属性有效值大于父类。
            while (_parent && _parent._createOptionProperties) {
                var pps = _parent._createOptionProperties();
                if (!Array.isArray(pps)) continue;

                pps.forEach(function (o) {
                    var name = o.name, isBreak = false;

                    // 找到存在的，合并属性。
                    for (var i = 0, l = properties.length; i < l; i++) {
                        if (name == properties[i].name) {
                            $.extend(o, properties[i]);
                            isBreak = true;
                            break;
                        }
                    }

                    // 没有找到存在的，直接放入。
                    if (!isBreak) {
                        properties.push(o);
                    }
                });

                _parent = Object.getPrototypeOf(_parent);
            }

            return properties;
        },
        /**
         * 生成默认配置。
         * 
         * @param {array} 配置属性集合。
         * 
         * @return {object} 生成的默认配置。
         */
        parseDefaultOptions: function (properties) {
            var options = {};

            if (!Array.isArray(properties)) {
                throw ('配置设置必须是数组');
            }

            properties.forEach(function (o) {
                var name = o.name, defaultValue = o.value, kind = o.kind, scope = o.scope || window;

                if (typeof o == 'string') {
                    name = o;
                }

                if (hsr.StringUtils.isBlank(name)) {
                    throw ('无效的配置名称');
                }
                
                // 已经存在属性。
                if (options.hasOwnProperty(name)) return;
                
                // 赋值。
                if (defaultValue != null) {
                    if (kind === 'function') {
                        // 从上下文（默认 window）中获取方法。
                        defaultValue = scope[defaultValue];
                    }
                    options[name] = defaultValue;
                }
            });

            return options;
        },
        /**
         * 生成数据配置（来自于 HTML data 属性、HTML 属性、定义的方法等）。
         * 
         * @param {array} 配置属性集合。
         * 
         * @return {object} 生成的数据配置。
         */
        parseDataOptions: function (element$, properties) {
            var options = {};

            // 无元素，退出。
            if (!element$ || element$.length == 0) return options;

            if (!Array.isArray(properties)) {
                throw ('配置设置必须是数组');
            }

            // 获取元素的所有附加值。
            var elementData = element$.data();

            properties.forEach(function (o) {
                var name = o.name, defaultValue = o.value, kind = o.kind, scope = o.scope || window, value;

                if (typeof o == 'string') {
                    name = o;
                }

                if (hsr.StringUtils.isBlank(name)) {
                    throw ('无效的配置名称');
                }
                
                // 已经存在属性。
                if (options.hasOwnProperty(name)) return;

                // 先从数据字典里获取值。
                value = elementData[name];

                // 根据类型获取值。
                if (kind === 'function') {
                    // 从上下文（默认 window）中获取方法。
                    value = scope[value];
                } else if (kind === 'attr') {
                    // 从元素属性中获取值。
                    value = element$.attr(name);
                    if (value) {
                        // 根据默认值类型格式化属性值。
                        switch (typeof defaultValue) {
                            case 'number':
                                var v = Number(value);
                                if (isNaN(v)) {
                                    value = undefined;
                                } else {
                                    value = v;
                                }
                                break;
                            case 'boolean':
                                // 布尔值只要存在就是 true，比如： required checked selected readonly disabled multiple 等属性。
                                // value = (value == 'true' || value == true);
                                value = true;
                                break;
                        }
                    }
                }
                
                // 赋值。
                if (value != null) {
                    options[name] = value;
                }
            });

            return options;
        }
    };
});