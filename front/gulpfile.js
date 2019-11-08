var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var imagemin = require('gulp-imagemin');
var cache = require("gulp-cache");
var watch = require("gulp-watch");
var bs = require("browser-sync").create();
var sass = require("gulp-sass")

var path = {
    'css': './src/css/**/',
    'js': './src/js/',
    'images': './src/images/',
    'html': './templates/**/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};


//定义css任务
gulp.task("css", function () {
    gulp.src(path.css + '*.scss')
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano())
        .pipe(rename({"suffix": ".min"}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream())
});

//定义js任务
gulp.task("js", function () {
    gulp.src(path.js + '*.js')
        .pipe(uglify())
        .pipe(rename({"suffix": ".min"}))
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())

});

//定义处理图片的任务
gulp.task('images', function () {
    gulp.src(path.images + '*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())
});

//定义html任务
gulp.task('html', function () {
    gulp.src(path.html + '*.html')
        .pipe(bs.stream())
});

//自动检测文件修改任务
gulp.task("watch", function(){
	watch(path.css + '*.scss',gulp.series("css"));
	watch(path.js + '*.js',gulp.series("js"));
	watch(path.images + '*.*',gulp.series("images"));
	// watch(path.html + '*.html',gulp.series("html"))
});

//初始化自动刷新浏览器
gulp.task("bs", function(){
	bs.init({
		'server': {
			'baseDir': './'
		}
	})
});

//自动刷新浏览器任务
// gulp.task("default", gulp.parallel('bs', 'watch'));
gulp.task("default", gulp.parallel('watch'));
