const gulp=require('gulp');
const cssmin=require('gulp-cssmin');
const uglify=require('gulp-uglify');
const concat=require('gulp-concat');
const rename=require('gulp-rename');
const babel=require('gulp-babel');
const sourcemaps=require('gulp-sourcemaps');

gulp.task('js', ()=>{
  return gulp
    .src(['./src/js/**/*.js'])
    //.pipe(concat('bundle.min.js'))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())

    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('style', ()=>{
  return gulp
    .src(['./src/css/**/*.css'])
    .pipe(concat('style.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('default', ['js', 'style']);
