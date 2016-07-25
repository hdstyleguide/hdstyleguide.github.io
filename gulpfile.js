'use strict';

// === Required Variables === //
var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    rename		    = require('gulp-rename'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer'),
    browserSync   = require('browser-sync'),
    browserslist  = require('browserslist'),
    opts          = require('Orchestrator'),
    sourcemaps    = require('gulp-sourcemaps');

// === CONFIG === //
var config = {
  views: "../../BuildaSignWeb/Views/",
  defaultAddress: "10.17.50.154:8005/"
}

// === Generates Static Server === //
gulp.task('browserSync', ['sass'], function () {

  browserSync.init({
    proxy: "http://local.m.easycanvasprints.com",
    port: 8005,
    //Default page BS opens on
    open: config.defaultAddress + "portal",
    rewriteRules: [
      {
        match: /local.static.easycanvasprints.com/g,
          fn: function (match) {
              return config.defaultAddress;
        }
      },
      {
        match: /local.upload.easycanvasprints.com/g,
        fn: function (match) {
            return config.defaultAddress;
        }
      },
      {
        match: /local.pdf.easycanvasprints.com/g,
        fn: function (match) {
            return config.defaultAddress;
        }
      }
    ]
  });

  gulp.watch('./scss/styles.scss', ['sass']);
  gulp.watch('./scss/*/*.scss', ['sass']);
  gulp.watch('./scss/*/*/*.scss', ['sass']);
  gulp.watch(config.views + "Shared/*.cshtml").on('change', browserSync.reload);
  gulp.watch(config.views + "*/*.cshtml").on('change', browserSync.reload);
});

// === Compiles sass and injects CSS into browsers === //
gulp.task('sass', function() {
  var processors = [
    autoprefixer
  ];

  var browsers = browserslist(opts.browsers, { path: opts.file });
  return gulp.src("scss/styles.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss(processors))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./css-maps'))
    .pipe(gulp.dest("../../BuildaSignWeb/Content/EasyCanvasPrints/Styles/responsivesite/"))
    .pipe(browserSync.stream());
});

gulp.task('test', function() {
  console.log(sourcemaps);
});


gulp.task('default', ['browserSync']);
