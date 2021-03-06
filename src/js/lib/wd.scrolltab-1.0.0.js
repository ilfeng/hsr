/**
 * 可以滚动的Tab控件。
 */
var wd=window.wd||{};
wd.Fader=function(config){this.element=config.element;this.elementID=config.elementID;this.style=config.style;this.num=config.num;this.maxMove=config.maxMove;this.finishNum="string";this.interval=config.interval||10;this.step=config.step||20;this.onFinish=config.onFinish;this.isFinish=false;this.timer=null;this.method=this.num>=0;this.c=this.elementID?$("#"+this.elementID):this.element;this.run=function(){clearInterval(this.timer);this.fade();if(this.isFinish){this.onFinish&&this.onFinish()}else{var f=this;this.timer=setInterval(function(){f.run()},this.interval)}};this.fade=function(){if(this.finishNum=="string"){this.finishNum=(parseInt(this.c.css(this.style))||0)+this.num}var a=parseInt(this.c.css(this.style))||0;if(this.finishNum>a&&this.method){a+=this.step;if(a>=0){this.finishNum=a=0}}else{if(this.finishNum<a&&!this.method){a-=this.step;if(a*-1>=this.maxMove){this.finishNum=a=this.maxMove*-1}}}if(this.finishNum<=a&&this.method||this.finishNum>=a&&!this.method){this.c.css(this.style,this.finishNum+"px");this.isFinish=true;this.finishNum="string"}else{this.c.css(this.style,a+"px")}}};
Math.uuid=(function(){var $="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");return function(_,G){var C=$,F=[],D=Math.random;G=G||C.length;if(_){for(var B=0;B<_;B++)F[B]=C[0|D()*G]}else{var A=0,E;F[8]=F[13]=F[18]=F[23]="-";F[14]="4";for(B=0;B<36;B++)if(!F[B]){E=0|D()*16;F[B]=C[(B==19)?(E&3)|8:E&15]}}return F.join("")}})();var randomUUID=Math.uuid;
/**
 * @description {Class} TabPanel
 * This is the main class of tab panel.
 */
wd.TabPanel = function(config) {
    /**
     * @description {Config} renderTo
     * {String or JQuery object} To specify where tab panel will be placed. It could be a DOM id or jquery object.
     */
    this.renderTo = config.renderTo || $(document.body);
    /**
     * @description {Config} border
     * {Boolean} To show border or not.
     */
    this.border = config.border;
    this.render = typeof this.renderTo == 'string' ? $('#' + this.renderTo) : this.renderTo;
    /**
     * @description {Config} widthResizable
     * {Boolean} Whether end user can change panel width by mouse dragging.
     */
    this.widthResizable = config.widthResizable;
    /**
     * @description {Config} heightResizable
     * {Booean} Whether end user can change panel height by mouse dragging.
     */
    this.heightResizable = config.heightResizable;
    /**
     * @description {Config} autoResizable
     * {Boolean} Whether panel resizes itself according to content.
     */
    this.autoResizable = config.autoResizable ? true : false;
    /**
     * @description {Config} width
     * {String} Initialization width.
     * @sample // width config, in px or percentage.
     * width : '200px'// or '100%'.
     */
    this.width = config.width || '100%';
    /**
     * @description {Config} height
     * {String} Initialization height.
     * @sample //heigh config
     * height : '200px'// or '100%'.
     */
    this.height = config.height || '100%';
    /**
     * @description {Config} items
     * {Array} Tab items array.
     */
    this.items = config.items;
    /**
     * @description {Config} active
     * {Number} Active tab index. Base on 0.
     */
    this.active = config.active || 0;
    //this is tab array.
    this.tabs = [];
    this.scrolled = false;
    this.tabWidth = 112;
    this.tabTitleHeight = 0;
    this.fixNum = 2;
    this.scrollFinish = true;
    this.maxLength = config.maxLength || -1;
    this.maxzindex = 0;
    this.isCollapse = false;

    this.init();
};

wd.TabPanel.prototype = {
    //initialization
    init : function() {

        var tabEntity = this;

        if (this.autoResizable) {
            this.widthResizable = this.heightResizable = true;
            this.render.css('overflow', 'hidden');
            $(window).resize(function() {
                window.setTimeout(function() {
                    tabEntity.resize();
                }, 200);
            });
        }

        this.render.width(this.width);
        this.render.height(this.height);

        var hwFix = this.border != 'none' ? 2 : 0;

        this.tabpanel = $('<div></div>');
        this.tabpanel.addClass('tabpanel');
        this.tabpanel.width(this.render.width() - hwFix);
        this.tabpanel.height(this.render.height() - hwFix);
        this.render.append(this.tabpanel);

        //construct container
        this.tabpanel_tab_content = $('<div></div>');
        this.tabpanel_tab_content.addClass('tabpanel_tab_content');
        this.tabpanel_tab_content.appendTo(this.tabpanel);

        //construct left scroll button
        this.tabpanel_left_scroll = $('<div><i class="fa fa-caret-left"></i></div>');
        this.tabpanel_left_scroll.bind('click', function() {
            tabEntity.moveLeft();
        });
        this.tabpanel_left_scroll.addClass('tabpanel_left_scroll');
        this.tabpanel_left_scroll.addClass('tab_display_none');
        this.tabpanel_left_scroll.bind('mouseover', function() {
            var l = $(this);
            l.addClass('tabpanel_scroll_over');
            l.bind('mouseout', function() {
                l.unbind('mouseout');
                l.removeClass('tabpanel_scroll_over');
            });
        });
        this.tabpanel_left_scroll.appendTo(this.tabpanel_tab_content);

        //construct right scroll button
        this.tabpanel_right_scroll = $('<div><i class="fa fa-caret-right"></i></div>');
        this.tabpanel_right_scroll.bind('click', function() {
            tabEntity.moveRight();
        });
        this.tabpanel_right_scroll.addClass('tabpanel_right_scroll');
        this.tabpanel_right_scroll.addClass('tab_display_none');
        this.tabpanel_right_scroll.bind('mouseover', function() {
            var r = $(this);
            r.addClass('tabpanel_scroll_over');
            r.bind('mouseout', function() {
                r.unbind('mouseout');
                r.removeClass('tabpanel_scroll_over');
            });
        });
        this.tabpanel_right_scroll.appendTo(this.tabpanel_tab_content);

        this.tabpanel_move_content = $('<div></div>');
        this.tabpanel_move_content.addClass('tabpanel_move_content');
        this.tabpanel_move_content.appendTo(this.tabpanel_tab_content);

        this.tabpanel_mover = $('<ul></ul>');
        this.tabpanel_mover.addClass('tabpanel_mover');
        this.tabpanel_mover.appendTo(this.tabpanel_move_content);
        
        //construct controls
        this.tabpanel_controls = $('<div></div>');
        this.tabpanel_controls.addClass('tabpanel_controls');
        this.tabpanel_controls.appendTo(this.tabpanel_tab_content);
        
        this.tabpanel_button_resize = $('<div><i class="fa fa-minus"></i></div>');
        this.tabpanel_button_resize.addClass('tabpanel_button tabpanel_button_resize_min');
        this.tabpanel_button_resize.appendTo(this.tabpanel_controls).on('click',function(){
        	var i = $(this).find('i');
        	if(tabEntity.isCollapse){
        		var h = tabEntity.render.data('height');
        		tabEntity.tabpanel.height(h);
        		tabEntity.render.height(h);
        		
            	tabEntity.tabpanel_content.slideDown(function(){
            		i.removeClass('fa-retweet').addClass('fa-minus');
            		
            		tabEntity.isCollapse = false;
            	});
        	} else {
            	var tH = tabEntity.tabpanel_tab_content.outerHeight();
            	tabEntity.tabpanel_content.slideUp(function(){
            		tabEntity.render.data('height', tabEntity.render.height());
            		
            		tabEntity.tabpanel.height(tH - hwFix);
            		tabEntity.render.height(tH);
            		
            		i.removeClass('fa-minus').addClass('fa-retweet');
            		
            		tabEntity.isCollapse = true;
            	});
        	}
        });
        
        this.tabpanel_button_close = $('<div><i class="fa fa-close"></i></div>');
        this.tabpanel_button_close.addClass('tabpanel_button tabpanel_button_close');
        this.tabpanel_button_close.appendTo(this.tabpanel_controls).on('click',function(){
        	// 依次关闭所有标签，然后隐藏。
        	for(var i = tabEntity.tabs.length - 1; i >= 0 ; i--){
        		tabEntity.killTab(i);
        	}
        });

        //
        this.tabpanel_tab_spacer = $('<div></div>');
        this.tabpanel_tab_spacer.addClass('tabpanel_tab_spacer');
        this.tabpanel_tab_spacer.appendTo(this.tabpanel_tab_content);

        //content div
        this.tabpanel_content = $('<div></div>');
        this.tabpanel_content.addClass('tabpanel_content');
        this.tabpanel_content.appendTo(this.tabpanel);

        var t_w = this.tabpanel.width();
        var t_h = this.tabpanel.height();
        this.tabTitleHeight = this.tabpanel_tab_content.outerHeight(true);

        if (this.border == 'none') {
            this.tabpanel.css('border', 'none');
        }

        this.tabpanel_tab_content.width(t_w);
        this.tabpanel_content.width(t_w);
        this.tabpanel_content.height(t_h - this.tabTitleHeight);

        this.update();

        for (var i = 0; i < this.items.length; i++) {
            this.items[i].notExecuteMoveSee = true;
            this.addTab(this.items[i]);
        }
        //activate tab
        if (this.active >= 0){
            this.showTab(this.active, false);
        }
        if(this.items.length == 0){
            this.render.hide();
        }
    },
    //scroll left
    moveLeft : function() {
        if (this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            wd.Fader.apply(this, new Array({
                element : this.tabpanel_mover,
                style : 'marginLeft',
                num : this.tabWidth,
                maxMove : this.maxMove,
                onFinish : this.useableScroll
            }));
            this.run();
        }
    },
    //scroll right
    moveRight : function() {
        if (this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            wd.Fader.apply(this, new Array({
                element : this.tabpanel_mover,
                style : 'marginLeft',
                num : this.tabWidth * -1,
                maxMove : this.maxMove,
                onFinish : this.useableScroll
            }));
            this.run();
        }
    },
    //scroll to end of left side
    moveToLeft : function() {
        //no scroll button show
        if (this.scrolled && this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            var marginLeft = parseInt(this.tabpanel_mover.css('marginLeft')) * -1;
            wd.Fader.apply(this, new Array({
                element : this.tabpanel_mover,
                style : 'marginLeft',
                num : marginLeft,
                maxMove : this.maxMove,
                interval : 20,
                step : (marginLeft / 10) < 10 ? 10 : marginLeft / 10,
                onFinish : this.useableScroll
            }));
            this.run();
        }
    },

    //scroll to end of left side
    moveToRight : function() {
        if (this.scrolled && this.scrollFinish) {
            this.disableScroll();
            this.scrollFinish = false;
            var marginLeft = parseInt(this.tabpanel_mover.css('marginLeft')) * -1;
            var liWidth = this.tabpanel_mover.children().length * this.tabWidth;
            var cWidth = this.tabpanel_move_content.width();
            var num = (liWidth - cWidth - marginLeft + this.fixNum) * -1;
            wd.Fader.apply(this, new Array({
                element : this.tabpanel_mover,
                style : 'marginLeft',
                num : num,
                maxMove : this.maxMove,
                step : (num * -1 / 10) < 10 ? 10 : num * -1 / 10,
                onFinish : this.useableScroll
            }));
            this.run();
        }
    },

    //move to visible position/////////////////////////////////////////////////////////
    moveToSee : function(position) {
        if (this.scrolled) {
            var liWhere = this.tabWidth * position;
            var ulWhere = parseInt(this.tabpanel_mover.css('marginLeft'));
            var moveNum;
            if (ulWhere <= 0) {
                moveNum = (ulWhere + liWhere) * -1;
                if (((moveNum + ulWhere) * -1) >= this.maxMove)
                    this.moveToRight();
                else {
                    this.disableScroll();
                    this.scrollFinish = false;
                    wd.Fader.apply(this, new Array({
                        element : this.tabpanel_mover,
                        style : 'marginLeft',
                        num : moveNum,
                        maxMove : this.maxMove,
                        step : (moveNum / 10) < 10 ? 10 : moveNum / 10,
                        onFinish : this.useableScroll
                    }));
                    this.run();
                }
            } else {
                moveNum = (liWhere - ulWhere) * -1;
                if ((moveNum * -1) >= this.maxMove)
                    this.moveToRight();
                else {
                    this.disableScroll();
                    this.scrollFinish = false;
                    wd.Fader.apply(this, new Array({
                        element : this.tabpanel_mover,
                        style : 'marginLeft',
                        num : moveNum,
                        maxMove : this.maxMove,
                        onFinish : this.useableScroll
                    }));
                    this.run();
                }
            }
        }
    },
    //disable scroll buttons
    disableScroll : function() {
        this.tabpanel_left_scroll.addClass('tabpanel_left_scroll_disabled');
        this.tabpanel_left_scroll.attr('disabled', true);
        this.tabpanel_right_scroll.addClass('tabpanel_right_scroll_disabled');
        this.tabpanel_right_scroll.attr('disabled', true);
    },

    //to determin whether we can still scroll
    useableScroll : function() {
        var tabEntity = this;
        if (this.scrolled) {
            //we came to the end of left side
            if (parseInt(tabEntity.tabpanel_mover.css('marginLeft')) == 0) {
                //disble left scroll button
                tabEntity.tabpanel_left_scroll.addClass('tabpanel_left_scroll_disabled');
                tabEntity.tabpanel_left_scroll.attr('disabled', true);
                //
                tabEntity.tabpanel_right_scroll.removeClass('tabpanel_right_scroll_disabled');
                tabEntity.tabpanel_right_scroll.removeAttr('disabled');
            }
            //we came to the end of right side
            else if (parseInt(tabEntity.tabpanel_mover.css('marginLeft')) * -1 == tabEntity.maxMove) {
                tabEntity.tabpanel_left_scroll.removeClass('tabpanel_left_scroll_disabled');
                tabEntity.tabpanel_left_scroll.removeAttr('disabled', true);
                tabEntity.tabpanel_right_scroll.addClass('tabpanel_right_scroll_disabled');
                tabEntity.tabpanel_right_scroll.attr('disabled');
            } else {
                tabEntity.tabpanel_left_scroll.removeClass('tabpanel_left_scroll_disabled');
                tabEntity.tabpanel_left_scroll.removeAttr('disabled', true);
                tabEntity.tabpanel_right_scroll.removeClass('tabpanel_right_scroll_disabled');
                tabEntity.tabpanel_right_scroll.removeAttr('disabled');
            }
        }

        tabEntity.scrollFinish = true;
    },
    //update style
    update : function() {
        var cWidth = this.tabpanel_tab_content.width() - this.tabpanel_controls.outerWidth(true);
        if (this.scrolled){
            cWidth -= (this.tabpanel_left_scroll.outerWidth(true) + this.tabpanel_right_scroll.outerWidth(true));
            this.tabpanel_right_scroll.css('left', cWidth + 11);
        }
        this.tabpanel_move_content.width(cWidth);
        this.maxMove = (this.tabpanel_mover.children().length * this.tabWidth) - cWidth + this.fixNum;
    },
    //to show scroll button if needed.
    showScroll : function() {
        var liWidth = this.tabpanel_mover.children().length * this.tabWidth;
        var tabContentWidth = this.tabpanel_tab_content.width() - this.tabpanel_controls.outerWidth(true);
        if (liWidth > tabContentWidth && !this.scrolled) {
            this.tabpanel_move_content.addClass('tabpanel_move_content_scroll');
            this.tabpanel_left_scroll.removeClass('tab_display_none');
            this.tabpanel_right_scroll.removeClass('tab_display_none');
            this.scrolled = true;
        } else if (liWidth < tabContentWidth && this.scrolled) {
            this.moveToLeft();
            this.tabpanel_move_content.removeClass('tabpanel_move_content_scroll');
            this.tabpanel_left_scroll.addClass('tab_display_none');
            this.tabpanel_right_scroll.addClass('tab_display_none');
            this.scrolled = false;
            this.scrollFinish = true;
        }
    },

    /**
     * @description {Method} addTab To add a new tab.
     * @param {Object} item Object for item profile.
     * @sample  //to add a new tab
     * addTab({id:"newtabid",
     *    title:"I am new" ,
     *    html:"some new message goes here",
     *    closable: true,
     *    disabled:false,
     *    icon:"image/new.gif"
     * });
     */
    addTab : function(tabitem) {

        if (this.maxLength != -1 && this.maxLength <= this.tabs.length) {
            return false;
        }

        tabitem.id = tabitem.id || Math.uuid();

        //if id exist, switch to that one
        if ($('#' + tabitem.id).length > 0) {
            this.showTab(tabitem.id, false);
        } else if (this.scrollFinish) {
            var tabEntity = this;

            var tab = $('<li></li>');
            tab.attr('id', tabitem.id);

            tab.appendTo(this.tabpanel_mover);

            var title = $('<div></div>');
            
            var wFix = tabitem.closable == false ? 0 : 15;
            if (tabitem.icon && tabitem.icon.length > 0) {
                title.addClass('tab_icon_title');
                //title.css('background-image', 'url("' + tabitem.icon + '")');
                title.append('<i class="tab_icon ' + tabitem.icon + '"></i>');
                if (title.width() > (this.tabWidth - 35 - wFix)) {
                    title.width(this.tabWidth - 50 - wFix);
                    title.attr('title', tabitem.title);
                    title.append('<div>...</div>');
                }
            } else {
                title.addClass('tab_title');
                if (title.width() > (this.tabWidth - 19 - wFix)) {
                    title.width((this.tabWidth - 30 - wFix));
                    title.attr('title', tabitem.title);
                    title.append('<div>...</div>');
                }
            }
            
            title.append('<span>' + tabitem.title + '</span>');
            title.appendTo(tab);

            var closer = $('<div></div>');
            closer.addClass('closer fa fa-close');
            closer.attr('title', '关闭标签');
            closer.appendTo(tab);

            var content = $('<div></div>');
            content.addClass('html_content');
            content.appendTo(this.tabpanel_content);

            var child_frame = content.find('iframe');
            /*
             if(child_frame.length==1)
             {
             child_frame.attr('id', tabitem.id+'Frame');
             child_frame.attr('name', tabitem.id+'Frame');
             }*/

            var activedTabIndex = this.tabpanel_mover.children().index(this.tabpanel_mover.find('.active')[0]);

            if (activedTabIndex < 0)
                activedTabIndex = 0;
            if (this.tabs.length > activedTabIndex)
                tabitem.preTabId = this.tabs[activedTabIndex].id;
            else
                tabitem.preTabId = '';
            tabitem.tab = tab;
            tabitem.title = title;
            tabitem.closer = closer;
            tabitem.content = content;
            tabitem.disable = tabitem.disable == undefined ? false : tabitem.disable;
            tabitem.closable = tabitem.closable == undefined ? true : tabitem.closable;
            if (tabitem.closable == false)
                closer.addClass('tab_display_none');

            if (tabitem.disabled == true) {
                tab.attr('disabled', true);
                title.addClass('tab_disabled');
            }

            this.tabs.push(tabitem);

            tab.bind('click', function(position) {
                return function() {
                    tabEntity.showTab(position, false);
                };
            }(this.tabs.length - 1));

            closer.bind('click', function(position) {
                return function() {
                    tabEntity.killTab(position);
                };
            }(this.tabs.length - 1));

            if (tabitem.closable) {
                tab.bind('dblclick', function(position) {
                    return function() {
                        tabEntity.killTab(position);
                    };
                }(this.tabs.length - 1));
            }

            if (!tabitem.lazyload) {
                this.showTab(this.tabs.length - 1, tabitem.notExecuteMoveSee);
            }

            this.showScroll();
            this.update();

            if (!tabitem.lazyload && !tabitem.notExecuteMoveSee) {
                this.moveToRight();
            }
            
            return tabitem;
        }
    },
    /**
     * @description {Method} getTabPosision To get tab index.
     * @param {String} id item id.
     * @return {Number} index of tab.
     */
    getTabPosision : function(tabId) {
        if ( typeof tabId == 'string') {
            for (var i = 0; i < this.tabs.length; i++) {
                if (tabId == this.tabs[i].id) {
                    tabId = i;
                    break;
                }
            }
        }
        return tabId;
    },
    /**
     * @description {Method} refresh To refresh tab content.
     * @param {String} id item id.
     */
    refresh : function(position) {
        position = this.getTabPosision(position);
        if ( typeof position == 'string')
            return false;
        else {
            //if IFRAME exists, refresh the sub frames
            var iframes = this.tabs[position].content.find('iframe');
            if (iframes.length > 0) {
                var frameId = this.tabs[position].id + 'Frame';
                this.iterateFlush(window.frames[frameId]);
            }
        }
    },

    iterateFlush : function(iframeObj) {

        if (iframeObj.window.frames.length > 0) {
            for (var i = 0; i < iframeObj.window.frames.length; i++) {
                this.iterateFlush(iframeObj.window.frames[i]);
            }
        } else {
            if (iframeObj.document.forms.length > 0) {
                for (var i = 0; i < iframeObj.document.forms.length; i++) {
                    try {
                        iframeObj.document.forms[i].submit();
                    } catch(e) {
                        iframeObj.location.reload();
                    }
                }
            } else {
                iframeObj.location.reload();
            }
        }
    },
    showTab : function(position, notExecuteMoveSee) {
        if (this.tabs.length < 1)
            return false;
        this.render.show();
        position = this.getTabPosision(position);
        if ( typeof position == 'string')
            position = 0;
        if (this.scrollFinish) {
            if (position >= this.tabs.length) {
                position = 0;
            }
            
            
            //this.tabs[position].content.css('z-index', ++this.maxzindex);
            $.each(this.tabs, function(i, o){
            	o.content.hide();
            	//o.content.css('visibility', 'hidden');
            });
            this.tabs[position].content.show();
            //this.tabs[position].content.css('visibility', 'visible');
            
            if (this.tabs[position].tab.hasClass('active')) {
                if (!notExecuteMoveSee) {
                    this.moveToSee(position);
                }
            } else {
                //load those never loaded
                if (this.tabs[position].content.html() == '') {
                    this.tabs[position].content.html(this.tabs[position].html);
                }
                this.tabpanel_mover.find('.active').removeClass('active');
                this.tabs[position].tab.addClass('active');
                if (!notExecuteMoveSee) {
                    this.moveToSee(position);
                }
            }
        }
    },
    /**
     * @description {Method} kill To close tab.
     * @param {String} id item id.
     */
    killTab : function(position) {

        var tabEntity = this;
        //get tab index
        position = this.getTabPosision(position);

        var preTabId = this.tabs[position].preTabId;

        //detroy DOM
        this.tabs[position].closer.remove();
        this.tabs[position].title.remove();
        this.tabs[position].tab.remove();
        this.tabs[position].content.remove();
        //remove from tabs
        this.tabs.splice(position, 1);
        
        //tabs is 0, hide 
        if(this.tabs.length == 0){
            this.render.hide();
        }

        //rebind event handler because index changed.
        for (var i = 0; i < this.tabs.length; i++) {
            this.tabs[i].tab.unbind('click');
            this.tabs[i].tab.bind('click', function(i) {
                return function() {
                    tabEntity.showTab(i, false);
                };
            }(i));
            this.tabs[i].closer.unbind('click');
            this.tabs[i].closer.bind('click', function(i) {
                return function() {
                    tabEntity.killTab(i);
                };
            }(i));
            if (this.tabs[i].closable) {
                this.tabs[i].tab.unbind('dblclick');
                this.tabs[i].tab.bind('dblclick', function(i) {
                    return function() {
                        tabEntity.killTab(i);
                    };
                }(i));
            }
        }
        //update width
        this.update();
        //to scroll bar
        this.showScroll();
        //show last
        this.showTab(preTabId, false);
    },

    /**
     * @description {Method} getTabsCount To get how many tabs are in the panel.
     * @return {Number} Number of tabs .
     */
    getTabsCount : function() {
        return this.tabs.length;
    },

    /**
     * @description {Method} setTitle To set tab title.
     * @param {String} id Item id.
     * @param {String} title Tab title.
     */
    setTitle : function(position, title) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length)
            this.tabs[position].title.text(title);
    },

    /**
     * @description {Method} getTitle To get tab title.
     * @param {String} id item id.
     */
    getTitle : function(position) {
        position = this.getTabPosision(position);
        return this.tabs[position].title.text();
    },

    /**
     * @description {Method} setContent To set tab title.
     * @param {String} id Item id.
     * @param {String} title Tab inner html.
     */
    setContent : function(position, content) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length)
            this.tabs[position].content.html(content);
    },

    /**
     * @description {Method} getContent To get tab inner html.
     * @param {String} id item id.
     */
    getContent : function(position) {
        position = this.getTabPosision(position);
        return this.tabs[position].content.html();
    },

    /**
     * @description {Method} setDisable To enable or disable tab.
     * @param {String} id Item id.
     * @param {Booleaan} True for disabled, false for enabled.
     */
    setDisable : function(position, disable) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length) {
            this.tabs[position].disable = disable;
            if (disable) {
                this.tabs[position].tab.attr('disabled', true);
                this.tabs[position].title.addClass('tab_disabled');
            } else {
                this.tabs[position].tab.removeAttr('disabled');
                this.tabs[position].title.removeClass('tab_disabled');
            }
        }
    },

    /**
     * @description {Method} getDisable To determine whether tab is disabled or not.
     * @param {String} id item id.
     */
    getDisable : function(position) {
        position = this.getTabPosision(position);
        return this.tabs[position].disable;
    },

    /**
     * @description {Method} setClosable To enable or disable end user to close tab.
     * @param {String} id Item id.
     * @param {Booleaan} True for closable, false for not.
     */
    setClosable : function(position, closable) {
        position = this.getTabPosision(position);
        if (position < this.tabs.length) {
            this.tabs[position].closable = closable;
            if (closable) {
                this.tabs[position].closer.addClass('tab_display_none');
            } else {
                this.tabs[position].closer.addClass('closer fa fa-close');
                this.tabs[position].closer.removeClass('tab_display_none');
            }
        }
    },

    /**
     * @description {Method} getClosable To determine whether tab is closable or not.
     * @param {String} id item id.
     */
    getClosable : function(position) {
        position = this.getTabPosision(position);
        return this.tabs[position].closable;
    },

    /**
     * @description {Method} getActiveIndex To get index of active tab.
     * @return {Number} index of active tab.
     */
    getActiveIndex : function() {
        return this.tabpanel_mover.children().index(this.tabpanel_mover.find('.active')[0]);
    },

    /**
     * @description {Method} getActiveTab To get active tab.
     * @return {Object} Profile of active tab.
     */
    getActiveTab : function() {
        var activeTabIndex = this.tabpanel_mover.children().index(this.tabpanel_mover.find('.active')[0]);
        if (this.tabs.length > activeTabIndex)
            return this.tabs[activeTabIndex];
        else
            return null;
    },
    resize : function() {
        var hwFix = this.border == 'none' ? 0 : 2;

        if (this.widthResizable) {
            this.width = this.render.width();
            this.tabpanel.width(this.width - hwFix);
            this.tabpanel_tab_content.width(this.width - hwFix);
            this.tabpanel_content.width(this.width - hwFix);
        }
        if (this.heightResizable) {
            this.height = this.render.height();
            this.render.data('height', this.height);
            this.tabpanel.height(this.height - hwFix);
            this.tabpanel_content.height(this.height - this.tabTitleHeight - hwFix);
            
            if(this.isCollapse) {
            	var tH = this.tabpanel_tab_content.outerHeight();
            	this.render.data('height', this.render.height());

            	this.tabpanel.height(tH - hwFix);
            	this.render.height(tH);
            } 
        }

        this.showScroll();
        this.useableScroll();
        this.update();

        var entity = this;
        setTimeout(function() {
            entity.moveToSee(entity.getActiveIndex());
        }, 200);

    },

    /**
     * @description {Method} setRenderWH To set width and height of the panel.
     * @param {Object} wh width and height.
     * @sample //To set tab height and width
     * setRenderWH({width:'200px', height:'400px'});
     */
    setRenderWH : function(wh) {
        if (wh) {
            if (wh.width != undefined) {
                this.render.width(wh.width);
            }
            if (wh.height != undefined) {
                this.render.height(wh.height);
            }
            this.resize();
        }
    },
    show: function() {
    	//this.tabpanel
    	this.render.show();
    },
    hide: function(){
    	this.render.hide();
    }
}; 