var gulp = require('gulp');

// 引入组件
var imgMin = require('gulp-imagemin'); // 图片压缩
var concat = require('gulp-concat');  // 合并文件
var uglify = require('gulp-uglify'); // js压缩
var rename = require('gulp-rename'); // 重命名
var clean = require('gulp-clean'); // 清空
var htmlmin = require('gulp-htmlmin'); // 压缩html
var cssnano = require('gulp-cssnano'); // css压缩
var less = require('gulp-less');  // less转css
var rjs = require('gulp-requirejs-optimize'); // rjs打包
var browserSync = require('browser-sync'); // 浏览器
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var filter = require('gulp-filter');


gulp.task('clean-css', function () {
    return gulp.src('dist/css')
        .pipe(clean());
});
gulp.task('clean-js', function () {
    return gulp.src('dist/js/app')
        .pipe(clean());
});
gulp.task('clean-html', function () {
    return gulp.src('dist/index.html')
        .pipe(clean());
});
gulp.task('clean-img', function () {
    return gulp.src('dist/img')
        .pipe(clean());
});
gulp.task('htmlmin', ['clean-html'], function () {
    return gulp.src('src/index.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('dist'))
});
gulp.task('css', ['clean-css'], function () {
    return gulp.src('src/css/*.css')
        .pipe(concat('merge.css'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/css/'))
});
gulp.task('js', ['clean-js'], function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('merge.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest('dist/js/'))
});
gulp.task('image', ['clean-img'], function () {
    return gulp.src('src/img/*')
        .pipe(imgMin())
        .pipe(gulp.dest('dist/img/'))
});


gulp.task('build', ['css', 'js', 'image']);

gulp.task('watch', function () {
    gulp.watch("src/**/**", ['build'])
});