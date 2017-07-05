/**
 * 工具方法。
 */
define(['ns'], function (ns) {
    /**
     * 实现类的继承。
     *
     * @param childClass 子类。
     * @param superClass 父类。
     */
    ns.inherit = function (childClass, superClass) {
        // 不存在父类，直接退出。
        if (!superClass) return;

        // 复制父类属性到子类中。
        for (var prop in superClass) {
            if (superClass.hasOwnProperty(prop)) {
                childClass[prop] = superClass[prop];
            }
        }

        // 更改子类的继承关系。
        function __() {
            this.constructor = childClass;
        }

        __.prototype = superClass.prototype;

        childClass.prototype = new __();
    };
});
