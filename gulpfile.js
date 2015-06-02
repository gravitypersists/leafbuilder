var gulp = require('gulp');
var gutil = require('gulp-util');
var babel = require('gulp-babel');
var watchify = require('watchify');
var babelify = require('babelify');
var chug = require('gulp-chug');
var install = require('gulp-install');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var brfs = require('brfs');

var bundler = watchify(browserify('./index.js', watchify.args));
bundler.transform('babelify');
bundler.transform(brfs);
gulp.task('browserify', bundle);
bundler.on('update', bundle);

function bundle() {
  var start = new Date().getTime();

  var b = bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build'));

  var end = new Date().getTime();
  var time = end - start;

  gutil.log('[browserify]', 'rebundle took ', gutil.colors.cyan(time + ' ms'));
  return b;
}

// gulp.task('babel', function () {
//   return gulp.src('src/**/*.js')
//     .pipe(babel())
//     .pipe(gulp.dest('build'));
// });

// gulp.task('chug-children', function () {
//     // Find and run all gulpfiles under all subdirectories 
//     return gulp.src('./submodules/**/gulpfile.js')
//         .pipe(chug())
// });

// gulp.task('install', function() {
//   gulp.src(['./package.json', 
//             './submodules/leaf/package.json', 
//             './submodules/formsmith/package.json',])
//     .pipe(install());
// });


// gulp.task('default', ['install', 'chug-children', 'babel', 'browserify', 'watch']);
gulp.task('default', ['browserify']);
