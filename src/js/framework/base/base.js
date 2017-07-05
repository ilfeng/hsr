define([
    'jquery', 'core', 'base-ns',

    'base-application',
    
    'base-page-base',
    'base-page-list',
    'base-page-edit',
    'base-page-selector',
    'base-page-chart'
], function($, hsr, ns) {
    'use strict';

    return (hsr[ns.name] = ns);
});