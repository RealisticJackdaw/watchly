var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var clean = require('gulp-clean');

var paths = {
  sass: ['./scss/**/*.scss']
};

var filesToMove = [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/angular-sanitize/angular-sanitize.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/ionic/css/ionic.min.css',
        './bower_components/ionic/js/ionic-angular.min.js',
        './bower_components/ionic/js/ionic.bundle.min.js',
        './manifest.json'
    ];
gulp.task('default', ['sass', 'move']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('clean', function(){
  return gulp.src(['./www/lib/*'], {read:false})
  .pipe(clean());
});

gulp.task('move',['clean'], function(){
  gulp.src(filesToMove)
  .pipe(gulp.dest('./www/lib/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
