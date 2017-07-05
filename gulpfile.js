/* global process */
/*!
 * 项目任务脚本。
 */

var gulp = require('gulp-param')(require('gulp'), process.argv),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace-task'),
    requirejsOptimize = require('gulp-requirejs-optimize'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    qunit = require('gulp-qunit'),
    connect = require('gulp-connect'),
    util = require('gulp-util'),
    less = require('gulp-less'),
    //minifycss = require('gulp-minify-css'),
    minifycss = require('gulp-clean-css'),
    fs = require('fs'),
    merge = require('deeply'),
    path = require('path'),
    webserver = require('gulp-webserver');
    
/* 扩展方法。 */
function mergeArray(a, b) {
    var r = [].concat(a || []);
    // 覆盖合并。
    for (var j = 0, bo; bo = b[j]; j++) {
        var updated = false;
        for (var i = 0, ao; ao = r[i]; i++) {
            if (typeof ao == 'object' && ao.match && ao.match == bo.match) {
                ao.replacement = bo.replacement;
                updated = true;
            }
        }
        if (!updated) {
            r.push(bo);
        }
    }
    return r;
}

// 基本目录。
var buildBaseUrl = '';
var scriptBaseUrl = 'dist/js';
var styleBaseUrl = 'dist/css';
var scriptBaseSrcUrl = 'src/js';
var styleBaseSrcUrl = 'src/css';

// requirejs 配置。
var defaultCfg = require('./build/default-cfg.json');
var requireCfgs = { framework: {}, fixed: {}, app: {} };

requireCfgs.framework.extension = merge(defaultCfg, require('./build/framework/extension-cfg.json'), mergeArray);
requireCfgs.framework.core = merge(defaultCfg, require('./build/framework/core-cfg.json'), mergeArray);
requireCfgs.framework.ui = merge(defaultCfg, require('./build/framework/ui-cfg.json'), mergeArray);
requireCfgs.framework.base = merge(defaultCfg, require('./build/framework/base-cfg.json'), mergeArray);

requireCfgs.app.main = merge(defaultCfg, require('./build/application/main-cfg.json'), mergeArray);

// 要替换的变量。
var defaultVar = require('./build/default-var.json');
var replaceVars = {};

replaceVars.extension = merge(defaultVar, require('./build/framework/extension-var.json'), mergeArray);
replaceVars.core = merge(defaultVar, require('./build/framework/core-var.json'), mergeArray);
replaceVars.ui = merge(defaultVar, require('./build/framework/ui-var.json'), mergeArray);
replaceVars.base = merge(defaultVar, require('./build/framework/base-var.json'), mergeArray);

replaceVars.main = merge(defaultVar, require('./build/application/main-var.json'), mergeArray);
replaceVars.app = merge(defaultVar, require('./build/application/app-var.json'), mergeArray);
/* 私有方法 */

function findRequireCfg(cfgName) {
    if (typeof (cfgName) != 'string') return;

    var nn = cfgName.split('.'), nc = requireCfgs;
    for (var i = 0, len = nn.length, name; i < len, name = nn[i]; i++) {
        nc = nc[name];
    }
    return nc;
}

function build(dir, cfg, v, debug) {
    var requireCfg = findRequireCfg(cfg);
    var moduleName = requireCfg.name;
    var fileName = requireCfg.out;
    var replaceCfg = replaceVars[v];
    var source = 'src/js/' + dir + '/' + moduleName + '.js';
    
    return gulp.src(source)
        .pipe(requirejsOptimize(requireCfg))
        .pipe(replace(replaceCfg))
        .pipe(concat(fileName))
        .pipe(gulpif(!debug, uglify()))
        .pipe(gulpif(!debug, rename({ suffix: '.min' })))
        .pipe(gulp.dest(scriptBaseUrl));
}

function buildThemeStyle(kind, theme, debug) {
    kind += '/';

    var src = 'src/css/application/' + kind + theme + '/theme.less';

    kind = kind
        //.replace('shell', 'home')
        //.replace('modules', '');

    var dsc = styleBaseUrl+'/' + kind + 'themes/' + theme;

    return gulp.src(src)
        .pipe(less())
        .pipe(gulpif(!debug, minifycss()))
        .pipe(gulpif(!debug, rename({ suffix: '.min' })))
        .pipe(gulp.dest(dsc));
}

function buildSkinStyle(kind, theme, skin, debug) {
    kind += '/';

    var src = 'src/css/application/' + kind + theme + '/skins/' + skin + '/skin.less';

    kind = kind
        //.replace('shell', 'home')
        //.replace('modules', '');

    var dsc = styleBaseUrl+'/' + kind + 'themes/' + theme + '/skins/' + skin;

    return gulp.src(src)
        .pipe(less())
        .pipe(gulpif(!debug, minifycss()))
        .pipe(gulpif(!debug, rename({ suffix: '.min' })))
        .pipe(gulp.dest(dsc));
}

/* 子任务 */

//== 脚本
gulp.task('extension', function (debug) {
    return build('framework/extension', 'framework.extension', 'extension', debug);
});

gulp.task('core', function (debug) {
    return build('framework/core', 'framework.core', 'core', debug);
});

gulp.task('ui', function (debug) {
    return build('framework/ui', 'framework.ui', 'ui', debug);
});

gulp.task('base', function (debug) {
    return build('framework/base', 'framework.base', 'base', debug);
});

gulp.task('app-main', function (debug) {
    return build('application', 'app.main', 'application', debug);
});

//== 样式
gulp.task('framework-style', function (debug) {
    return gulp.src('src/css/framework/**/framework.less')
        .pipe(less())
        .pipe(gulpif(!debug, minifycss()))
        .pipe(gulpif(!debug, rename({ suffix: '.min' })))
        .pipe(gulp.dest(styleBaseUrl));
});

gulp.task('login-theme-default', function (debug) {
    return buildThemeStyle('login', 'default', debug);
});

gulp.task('login-skin-skin0101', function (debug) {
    return buildSkinStyle('login', 'default', 'skin0101', debug);
});

gulp.task('login-style', [
    'login-theme-default', 'login-skin-skin0101'
]);

gulp.task('home-theme-default', function (debug) {
    return buildThemeStyle('home', 'default', debug);
});

gulp.task('home-skin-skin0101', function (debug) {
    return buildSkinStyle('home', 'default', 'skin0101', debug);
});

gulp.task('home-style', [
    'home-theme-default', 'home-skin-skin0101'
]);

gulp.task('modules-theme-default', function (debug) {
    return buildThemeStyle('modules', 'default', debug);
});

gulp.task('modules-skin-skin0101', function (debug) {
    return buildSkinStyle('modules', 'default', 'skin0101', debug);
});

gulp.task('modules-style', [
    'modules-theme-default', 'modules-skin-skin0101'
]);

// 编译。
gulp.task('build-framework', ['extension', 'core', 'ui', 'base', 'framework-style'], function (debug) {
    var min = debug ? '' : '.min';

    return gulp.src(scriptBaseUrl + '/@(extension|core|ui|base)' + min + '.js')
        .pipe(clean({ force: true }))
        .pipe(concat('framework' + min + '.js'))
        .pipe(gulp.dest(scriptBaseUrl));
});

//
gulp.task('build-i', function() {
    return gulp.src('./src/i/**')
        .pipe(gulp.dest('./dist/i/'));
});

//
gulp.task('build-img', function() {
    return gulp.src('./src/img/**')
        .pipe(gulp.dest('./dist/img/'));
});

//
gulp.task('build-html', function() {
    return gulp.src('./src/html/**')
        .pipe(gulp.dest('./dist/html/'));
});

//js lib
gulp.task('build-jslib', function() {
    return gulp.src('./src/js/lib/**')
        .pipe(gulp.dest('./dist/js/lib/'));
});

//css lib
gulp.task('build-csslib', function() {
    return gulp.src('./src/css/lib/**')
        .pipe(gulp.dest('./dist/css/lib/'));
});

//widgets
gulp.task('build-widgets', function() {
    return gulp.src('./src/widgets/**')
        .pipe(gulp.dest('./dist/widgets/'));
});
//静态文件处理
gulp.task('build-static', ['build-jslib','build-csslib', 'build-widgets', 'build-i', 'build-img', 'build-html']);
gulp.task('build-login', ['login-style']);
gulp.task('build-main', ['home-style', 'modules-style', 'app-main']);
gulp.task('build-app', ['build-login', 'build-main']);

//npm 调用
gulp.task('build', ['build-static','build-framework', 'build-app']);

gulp.task('webserver', function() {
    gulp.src('')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});
// 默认任务。
gulp.task('default', function () {
    console.log('啥也不是');
    //console.log(replaceVars['ui']);
});
