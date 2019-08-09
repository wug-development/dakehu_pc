const gulp = require('gulp'),
    cache = require("gulp-cache"),                  //清除缓存
    cssmin = require("gulp-minify-css"),            //压缩css文件
    imagemin = require("gulp-imagemin"),            //image图片压缩
    rename = require("gulp-rename"),                //重命名文件
    clean = require("gulp-clean"),                  //清除指定目录文件
    order = require("gulp-order"),                  //排序js文件压缩顺序
    concat = require("gulp-concat"),                //合并文件（css,js）
    livereload = require("gulp-livereload"),        //刷新页面
    webserver = require("gulp-webserver"),          //启动本地服务流量页面
    replace = require('gulp-replace-task'),         //替换指定内容
    watch = require('gulp-watch'),                  //监控文件
    fileinclude = require('gulp-file-include'),     //引用公共页面
    sass = require('gulp-sass'),                    //引用Sass样式
    autoprefixer = require('gulp-autoprefixer'),    //css添加兼容前缀
    uglify = require('gulp-uglify'),                //压缩JS
    babel = require("gulp-babel")                   //ES6 转 ES5

const src= {
    html: "source/*.html",
    styleSass: "source/css/*.scss",
    libStyleSass: ["source/css/lib/app.scss","source/css/lib/extends.scss"],
    images: "source/images/*",
    js: "source/js/*.js",
    libjs: ["source/js/lib/jquery-1.9.1.min.js", "source/js/lib/doT.min.js"],
    blljs: "source/js/bll/*.js",
    setjs: "source/js/settings/*.js",
    copyjs: "source/js/lib/*.js",
    copycss: "source/css/*.css",
},
//输出文件路径
dist= {
    html: "dist/",
    style: "dist/css",
    libcss: "dist/css/lib",
    images: "dist/images",
    libjs: "dist/js/lib",
    blljs: "dist/js/bll",
    setjs: "dist/js/settings",
    js: "dist/js",
    all: "./dist/**/*.*"
};

/******处理样式***************/
function styleSassDeal () {
    //处理单页css
    return gulp.src(src.styleSass)
        .pipe(sass())
        .pipe(replace(_reoption))
        .pipe(autoprefixer({
            browsers: ['last 20 versions'], // 重要配置 详见下面
            cascade: true //  是否美化属性值 
        }))
        .pipe(cssmin())//压缩css
        .pipe(rename({suffix:'.min'}))//文件名加.min
        .pipe(gulp.dest(dist.style))//输出css文件到指定目录
        .pipe(livereload());
}

/******处理公用css *************/
function styleLibSassDeal () {   
    return gulp.src(src.libStyleSass)
        .pipe(sass())
        .pipe(replace(_reoption))
        .pipe(autoprefixer({
            browsers: ['last 20 versions'], // 重要配置 详见下面
            cascade: true //  是否美化属性值 
        }))
        .pipe(cssmin())//压缩css
        .pipe(concat('app.css'))//合并文件并重命名
        .pipe(rename({suffix:'.min'}))//文件名加.min
        .pipe(gulp.dest(dist.libcss))//输出css文件到指定目录
        .pipe(livereload());
}

/******处理字体 *************/
function fontDeal () {   
    return gulp.src(src.font)
        .pipe(sass())
        .pipe(replace(_reoption))
        .pipe(autoprefixer({
            browsers: ['last 20 versions'], // 重要配置 详见下面
            cascade: true //  是否美化属性值 
        }))
        .pipe(cssmin())//压缩css
        .pipe(concat('app.css'))//合并文件并重命名
        .pipe(rename({suffix:'.min'}))//文件名加.min
        .pipe(gulp.dest(dist.libcss))//输出css文件到指定目录
        .pipe(livereload());
}

//复制js css
function copy () {
    gulp.src(['source/js/lib/swiper.min.js','source/js/lib/page.min.js'])
        .pipe(gulp.dest(dist.libjs))
        .pipe(livereload());
    gulp.src(['source/js/lib/layui/**'])
            .pipe(gulp.dest('dist/js/lib/layui'))
            .pipe(livereload());
    gulp.src(['source/css/font/**'])
            .pipe(gulp.dest('dist/css/font'))
            .pipe(livereload());
    return gulp.src(['source/css/lib/swiper.min.css','source/css/lib/layui.min.css'])
        .pipe(gulp.dest(dist.libcss))
        .pipe(livereload());
}


//处理脚本
function scriptdeal () {
    var options = {
        mangle:true,//是否修改变量名称
        compress:true//是否全部压缩
    };
    //处理单页js文件
    return gulp.src([src.js])
        .pipe(replace(_reoption))
        .pipe(rename({suffix:'.min'}))//文件名加.min
        .pipe(babel())//es6转es5
        .pipe(uglify(options))//压缩js
        // .pipe(plugins.changed(dist.js)) //只更新修改过的文件
        .pipe(gulp.dest(dist.js))//输出js文件
        .pipe(livereload());
}
//处理公用js文件
function scriptlibdeal () {
    return gulp.src(src.libjs)
        .pipe(order([//文件压缩顺序
            "jquery-1.9.1.min.js",
            "*.js"
        ]))
        .pipe(replace(_reoption))
        .pipe(concat('app.js'))//合并文件并重命名
        .pipe(rename({suffix:'.min'}))//文件名加.min
        //.pipe(babel())//es6转es5
        //.pipe(uglify(options))//压缩js
        .pipe(gulp.dest(dist.libjs))//输出js文件
        .pipe(livereload());
}
//处理公用业务逻辑js文件 
function scriptblldeal () {
    const options = {
        mangle:true,//是否修改变量名称
        compress:true//是否全部压缩
    };
    return gulp.src([src.blljs])
        .pipe(order([//文件压缩顺序
            "app.js",
            "*.js"
        ]))
        .pipe(concat('bll.js'))//合并文件并重命名
        .pipe(rename({suffix:'.min'}))//文件名加.min
        .pipe(replace(_reoption))
        .pipe(babel())//es6转es5
        .pipe(uglify(options))//压缩js
        .pipe(gulp.dest(dist.blljs))//输出js文件
        .pipe(livereload());
}

//处理图片 
function imagedeal () {
    return gulp.src(src.images)
        .pipe(cache(imagemin({optimizationLevel:3, progressive: true, interlaced: true})))
        .pipe(gulp.dest(dist.images))
        .pipe(livereload());
}

//处理html
function htmldeal () {
    const options = {
        removeComments:true,//清除HTML注释
        collapseWhitespace:true,//压缩HTML
        minifyJS:true,//压缩页面JS
        minifyCSS:true//压缩页面CSS
    };

    gulp.src('source/publicpage/*.html')
        .pipe(replace(_reoption))
        //.pipe(htmlmin(options))//压缩html
        .pipe(gulp.dest('dist/publicpage'))//输出html文件
        .pipe(livereload());

    return gulp.src([src.html,'!source/publicpage/*.html'])
        /*.pipe(htmlreplace({//替换html文件内的js和css
            'css':'/css/lib/app.min.css',
            'js':'/js/lib/app.min.js'
        }))*/
        .pipe(replace(_reoption))
        //.pipe(htmlmin(options))//压缩html
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(dist.html))//输出html文件
        .pipe(livereload());
}

//配置文件
function setdeal () {
    const pathset = require('set.json')
    setreplace(pathset)
}

//清理文件
function cleans() {
    return gulp.src(['dist/*'], {read: false}).pipe(clean());
}

let _reoption = {};

function setreplace(_reset){
    _reoption = {
        patterns:[
            { match:'csspath', replacement:_reset.csspath },
            { match:'imgpath', replacement:_reset.imgpath },
            { match:'jspath', replacement:_reset.jspath },
            { match:'pagepath', replacement:_reset.pagepath },
            { match:'apipath', replacement:_reset.apipath }
        ]
    }
}

//本地测试
function watchs () {
    // //监听dist目录下所有文件改变之后刷新页面
    livereload.listen();

    watch(src.html, htmldeal);
    watch(src.styleSass, styleSassDeal);
    watch(src.libStyleSass, styleLibSassDeal);
    watch(src.images, imagedeal);
    watch(src.js, scriptdeal);
    watch(src.libjs, scriptlibdeal);
    watch(src.blljs, scriptblldeal);
    watch(src.copyjs, copy);
    watch(src.copycss, copy);

}

//本地浏览
function webservers () {
    return gulp.src('./dist/').pipe(webserver({
        port:9999,
        host:'www.dakehu.com',
        livereload:true,
        directoryListing:true//,
        //open:true
        })
    );
}

const build = gulp.series(cleans, gulp.parallel(imagedeal, styleSassDeal, styleLibSassDeal, scriptdeal, scriptlibdeal, scriptblldeal, copy, htmldeal, watchs, webservers))
//默认入口
gulp.task('default', build)