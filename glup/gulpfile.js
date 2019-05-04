// const gulp=require('gulp');
// const uglify=require('gulp-uglify');

// gulp.task('js', ()=>{
//   return gulp.src(['./src/js/*.js'])
//     .pipe(uglify())
//     .pipe(gulp.dest('./build/js/'));
// });

// gulp.task('default', ['js']);
const gulp=require('gulp');
const less=require('gulp-less');
// 压缩后的代码报错，会将原始代码恢复，便于查找错误
const sourcemaps=require('gulp-sourcemaps');
const concat=require('gulp-concat');
const cssmin=require('gulp-cssmin');

gulp.task('less', ()=>{
  return gulp
    .src(['./src/less/**/*.less']) // ** 代表匹配任意目录
    .pipe(sourcemaps.init()) // 先进行babel编译后才能压缩es6
    .pipe(concat('main.less.min.css')) // 打包
    .pipe(less())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('default', ['less']);
