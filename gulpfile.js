/**
 * Gulp Packages
 */

var pkg          = require('./package.json');

var gulp         = require('gulp');
var concat       = require('gulp-concat');
var minify       = require('gulp-minify');
var cleancss     = require('gulp-clean-css');
var useref       = require('gulp-useref');
var jshint       = require('gulp-jshint');
var csslint      = require('gulp-csslint');
var rev          = require('gulp-rev');
var revreplace   = require('gulp-rev-rewrite');
var revdelete    = require('gulp-rev-delete-original');
var del          = require('del');

/**
 * Gulp Tasks
 */

// Make a new revision of build css/js files
gulp.task('revision', function() {
  return gulp.src(['./build/assets/*.js','./build/assets/*.css'], {base: 'build'})
    .pipe(gulp.dest('./build/'))
    .pipe(rev())
    .pipe(revdelete()) // Remove the unrevved files
    .pipe(gulp.dest('./build/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./build/assets/'));
});

// Replace build css/js assets with current revision
gulp.task('revRewrite', function() {
  const manifest = gulp.src('./build/assets/rev-manifest.json');
  return gulp.src('./build/index.html')
    .pipe(revreplace({
      manifest: manifest,
      replaceInExtensions: ['.html']
    }))
    .pipe(gulp.dest('./build/'));
});


// Clean up js build
gulp.task('clean:js', function () {
  return del('./build/assets/*.js');
});

// Clean up css build
gulp.task('clean:css', function () {
  return del('./build/assets/*.css');
});

// Clean up files in build
gulp.task('clean:static', function () {
  return del([
    './build/*.html',
    './build/assets/rev-manifest.json'
  ]);
});

// Copy static php files into build folder
gulp.task('copy:static', function () {
  return gulp
    .src([
      './source/index.html',
      './source/vexp.pde'
    ])
    .pipe(useref())
    .pipe(gulp.dest('./build/'));
});

// Copy static favicon files into build folder
gulp.task('copy:favicon', function () {
  return gulp
    .src(['./source/icon/**'])
    .pipe(gulp.dest('./build/icon/'));
});

// Concatenate and minify JS
gulp.task('build:js', function () {    
  return gulp.src([
      './source/assets/js/bootstrap.min.js',
      './source/assets/js/processing.min.js',
      './source/assets/js/vexp.js'
    ])
    .pipe(concat('bundle.js'))
    .pipe(minify({
        ext:{
            min:'.min.js'
        },
        noSource: true
    }))
    .pipe(gulp.dest('./build/assets/'));
});

// Concatenate and minify CSS
gulp.task('build:css', function () {    
  return gulp.src([
      './source/assets/css/bootstrap.min.css',
      './source/assets/css/design.css'
    ])
    .pipe(concat('styles.css'))
    .pipe(cleancss())
    .pipe(gulp.dest('./build/assets/'));
});

// Lint javascript
gulp.task('lint:js', function () {    
  return gulp.src(['./source/assets/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Lint CSS
gulp.task('lint:css', function () {    
  return gulp.src(['./source/assets/css/*.css'])
    .pipe(csslint())
    .pipe(csslint.formatter());
});

// Watch css changes
gulp.task('watch:css', function () {
  gulp.watch("./source/assets/css/**/*.css", styles);
});

// Watch js changes
gulp.task('watch:js', function () {
  gulp.watch("./source/assets/js/**/*.js", scripts);
});

// Watch static changes
gulp.task('watch:static', function () {
  gulp.watch("./source/*.html", gulp.series('copy:static'));
});

// Define complex tasks
const lints     = gulp.series('lint:css', 'lint:js');
const files     = gulp.series('copy:static', 'copy:favicon');
const styles    = gulp.series('clean:css', 'build:css');
const scripts   = gulp.series('clean:js', 'build:js');
const clean     = gulp.series('clean:static', 'clean:css', 'clean:js');
const build     = gulp.series('clean:static', styles, scripts, files, 'revision', 'revRewrite');
const watch     = gulp.parallel('watch:css','watch:js','watch:static');

// Export tasks
exports.default = watch;
exports.watch = watch;
exports.check = lints;
exports.clean = clean;
exports.build = build;
