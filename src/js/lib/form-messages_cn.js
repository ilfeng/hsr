jQuery.extend(jQuery.validator.messages, {
	    required:"此项必填。",
	    remote:"请修正此项。",
	    email:"请输入一个合法的电子邮件地址。",
	    url:"请输入合法网址。",
	    date:"请输入合法日期。",
	    dateISO:"请输入合法日期（ISO格式）。",
	    number:"请输入合法数字。",
	    digits:"请只输入数字。",
	    creditcard:"请输入一个有效的信用卡号。",
	    equalTo:"请再次输入相同的值。",
	    accept: "请选择一个有效扩展名的文件。",
	    maxlength:jQuery.validator.format("请输入不超过{0}个字符。"),
	    minlength:jQuery.validator.format("请输入至少{0}个字符。"),
	    rangelength:jQuery.validator.format("请输入介于{0}和{1}个长的字符值。"),
	    range:jQuery.validator.format("请输入介于{0}和{1}的值。"),
	    max:jQuery.validator.format("请输入一个小于或等于{0}的值。"),
	    min:jQuery.validator.format("请输入一个大于或等于{0}的值。")
	});

$.extend(jQuery.validator.defaults, {
	doNotHideMessage: true, //个选项可以显示错误/成功信息选项卡切换
    errorElement: 'span', //容器默认输入错误消息
    errorClass: 'help-block', // 默认的输入错误消息类
    focusInvalid: true, //最后一个无效输入焦点

    invalidHandler: function (event, validator) { //显示在表单提交错误警报   
     //   success.hide();
    //    error.show();
    },

    highlight: function (element) { // hightlight error inputs
        $(element)
            .parents('.help-block').removeClass('ok'); // display OK icon
        $(element)
            .parents('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
    },

    unhighlight: function (element) { // revert the change dony by hightlight
        $(element)
            .parents('.form-group').removeClass('has-error'); // set error class to the control group
    },

    success: function (label) {
        if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radip buttons, no need to show OK icon
            label
                .parents('.form-group').removeClass('has-error').addClass('has-success');
            label.remove(); 
        } else { // 成功图标显示为其他输入
            label
                .addClass('valid ok') // 当前的输入标记为有效和显示ok的图标
            .parents('.form-group').removeClass('has-error').addClass('has-success'); // class 对照置成功组
        }
    },

    submitHandler: function (form) {
      //  success.show();
      //  error.hide();
      formSubmit();
      //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
    }

})