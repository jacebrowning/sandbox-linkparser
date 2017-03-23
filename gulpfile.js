// requirements

var gulp = require('gulp');
var gulpBrowser = require('gulp-browser');
var rename = require('gulp-rename');
var size = require('gulp-size');
var reactify = require('reactify');
var del = require('del');


// tasks

gulp.task('build', function () {
  var stream = gulp.src('./project/static/scripts/jsx/*.jsx')
    .pipe(gulpBrowser.browserify({transform: ['reactify']}))
    .pipe(rename({extname: '.js'}))
    .pipe(gulp.dest('./project/static/scripts/js/'))
    .pipe(size());
  return stream;
});

gulp.task('clean', function () {
  return del(['./project/static/scripts/js/']);
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
  gulp.watch('./project/static/scripts/jsx/*.jsx', ['build']);
});
