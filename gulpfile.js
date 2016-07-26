var gulp        = require('gulp')
var browserify  = require('browserify')
var watchify    = require('watchify')
var babelify    = require('babelify')
var source      = require('vinyl-source-stream')
var buffer      = require('vinyl-buffer')
var merge       = require('utils-merge')
var rename      = require('gulp-rename')
var uglify      = require('gulp-uglify')
var sourcemaps  = require('gulp-sourcemaps')
var gutil       = require('gulp-util')
var chalk       = require('chalk')
var es          = require('event-stream')
var watch       = require('gulp-watch')

gulp.task('dev', function () {
  var args = merge(watchify.args, { debug: true })
  var bundler = watchify(browserify('./src/main.js', args))
  .transform(babelify, {presets: ['es2015']})
  bundlePipeline(bundler)
  bundler.on('update', function () {
    bundlePipeline(bundler)
  })
})

gulp.task('test', function () {
  compileToTest('./src/warp-worker.js')
  compileToTest('./src/warp-main.js')
  watch('./src/warp-worker.js', compileToTest.bind(this, './src/warp-worker.js'))
  watch('./src/warp-main.js', compileToTest.bind(this, './src/warp-main.js'))
})

function compileToTest(file) {
  return browserify(file)
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .on('error', beautifyError)
    .pipe(source(file))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(rename(file.split("/")[2]))
    .pipe(rename({
      extname: '.bundle.js'
    }))
    .pipe(gulp.dest('./test/build'))
}

gulp.task('build', function () {
  browserify('./src/warp-worker.js', { debug: true })
  .transform(babelify, {presets: ['es2015']})
  bundler = browserify('./src/warp-main.js', { debug: true })
  .transform(babelify, {presets: ['es2015']})
  return bundlePipeline(bundler)
})

gulp.task('prod', function () {
  var bundler = browserify('./src/index.js')
  .transform(babelify, {presets: ['es2015']})
  return bundler.bundle()
    .on('error', beautifyError)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(rename('warpvm.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
})

function bundlePipeline(bundler) {
  return bundler.bundle()
    .on('error', beautifyError)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./test/build'))
    .pipe(rename('warpvm.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./test/build'))
}

function beautifyError(err) {
  if (err.fileName) {
    // build error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }
  this.end()
}
