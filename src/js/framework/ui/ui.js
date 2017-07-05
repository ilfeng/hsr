define([
    'jquery', 'core', 'ui-ns', 'ui-tool-api',

    'ui-panel',
    'ui-window',
    'ui-dialog',

    'ui-editor',
    'ui-editor-combo',
    'ui-editor-autocomplate',
    'ui-editor-lookup',
    'ui-editor-lookup-tree',
    'ui-editor-popup',
    'ui-editor-date',
    'ui-editor-color',
    'ui-editor-image-uploader',
    'ui-editor-file-uploader',
    'ui-editor-select',
    
    'ui-accordion',
    'ui-box',
    'ui-box-chart',
    'ui-box-remind',
    'ui-breadcrumb-tree',
    'ui-calendar',
    'ui-calendar-lunar',
    'ui-chart',
    'ui-clock-text',
    'ui-favorite',
    'ui-gridview',
    'ui-fancybox',
    'ui-listview',
    'ui-loading',
    'ui-browse-danger',
    'ui-menu-dropdown',
    'ui-messagebox',
    'ui-paging',
    'ui-splitter',
    'ui-tabbed',
    'ui-tabbed-adv'
], function ($, hsr, ns) {
    'use strict';
    
    hsr[ns.name] = ns;
    
    hsr.ui.get = function(selector) {
        return $(selector).api();
    };

    return ns; // (hsr[ns.name] = ns);
});