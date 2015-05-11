var gulp = require('gulp');
var babel = require('gulp-babel');
var watchify = require('gulp-watchify');
var babelify = require('babelify');

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

gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['babel', 'browserify']);
});

gulp.task('default', ['babel', 'browserify', 'watch']);
