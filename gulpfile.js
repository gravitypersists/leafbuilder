var gulp = require('gulp');
var babel = require('gulp-babel');
var watchify = require('gulp-watchify');
var babelify = require('babelify');
var chug = require('gulp-chug');
var install = require("gulp-install");

gulp.task('browserify', watchify(function (watchify) {
  return gulp.src(['src/leafbuilder.js'])
    .pipe(watchify({
      watch: false,
      setup: function (bundle) {
        bundle.transform(babelify);
      }
    }))
    .pipe(gulp.dest('build/'));
}));

gulp.task('babel', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build'));
});

gulp.task('chug-children', function () {
    // Find and run all gulpfiles under all subdirectories 
    return gulp.src('./submodules/**/gulpfile.js')
        .pipe(chug())
});

gulp.task('install', function() {
  gulp.src(['./package.json', 
            './submodules/leaf/package.json', 
            './submodules/formsmith/package.json',])
    .pipe(install());
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'submodules/leaf/src/**'], ['babel', 'browserify']);
});


// gulp.task('default', ['install', 'chug-children', 'babel', 'browserify', 'watch']);
gulp.task('default', ['babel', 'browserify', 'watch']);
