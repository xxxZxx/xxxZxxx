var gulp = require('gulp');
// 引入组件
var htmlmin = require('gulp-htmlmin');              //- 压缩html
var cssnano = require('gulp-cssnano');              //- css压缩
var uglify = require('gulp-uglify');                //- js压缩
var imagesMin = require('gulp-imagemin');           //- 图片压缩
var concat = require('gulp-concat');                //- 合并文件
var del = require('del');                             //- 清空文件夹
var less = require('gulp-less');                    //- less转css
var rev = require('gulp-rev');                      //- 对文件名加MD5后缀
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create(); //- 浏览器
var revCollector = require('gulp-rev-collector');     //- 更换MD5后缀
var runSequence =require('gulp-run-sequence');   //- 顺序执行任务


//- 任务

gulp.task('reload', function () {                       //- 刷新浏览器页面
    browserSync.reload();
});
gulp.task('server', function () {                       //- 静态服务器监控
    browserSync.init({
        server: {baseDir: 'src'}
    });
    gulp.watch(['src/**/*.css', 'src/**/*.js', 'src/**/*.html'], ['reload'])
});
gulp.task('bfdel', function () {
    del(['dist/**/*', '!dist/images', '!dist/images/**/*', '!dist/fonts', '!dist/fonts/*'])
});
gulp.task('afdel', function () {
    del(['dist/css/merge.css','dist/js/merge.js'])
});
gulp.task("html", function () {
    return gulp.src("src/index.html")
        .pipe(useref())                                 //- 替换路径
        .pipe(gulp.dest('dist'))                        //- 放入dist文件夹
});
gulp.task('css', function () {
    return gulp.src('src/css/*.css')
        .pipe(concat("merge.css"))
        .pipe(cssnano())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/css'))
});
gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(concat("merge.js"))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'))
});
gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'dist/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': 'css/',
                'js': 'js/'
            }
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('imagesmin', function () {
    return gulp.src("src/images/*")
        .pipe(imagesMin())
        .pipe(gulp.dest('dist/images'))
});
gulp.task('build', function () {
    runSequence('bfdel', 'css','js','html','rev','afdel');
});
