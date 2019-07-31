"use strict"

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var posthtml = require('gulp-posthtml');
var autoprefixer = require("autoprefixer");
var svgo = require("gulp-svgo");
var cwebp = require("gulp-cwebp");
var imagemin = require('gulp-imagemin');
var csso = require('gulp-csso');
var rename = require('gulp-rename');
var del = require('del');
var gulpCopy = require('gulp-copy');
var imageminJpegRecompress = require('imagemin-jpeg-recompress');
var imageminPngquant = require('imagemin-pngquant');
var server = require("browser-sync").create();

gulp.task("style", async function() {
 return gulp.src("work/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("work/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("work/css"))
    .pipe(server.stream());
});
gulp.task("normalize", function() {
return gulp.src("work/css/normalize.css")
 .pipe(csso())
 .pipe(rename("normalize.min.css"))
 .pipe(gulp.dest("work/css"));
});
gulp.task("clean", async function() {
  return del("build");
});
gulp.task("copy", async function() {
  return gulp.src([
    "work/fonts/**/*",
    "work/js/**/*",
    "work/css/**/*"], { base: "work" })
  .pipe(gulp.dest("build"));
});
gulp.task("imagemin", async function() {
  return gulp.src("work/img/**/*{jpg,png,svg}")
    .pipe(imagemin([
      imageminPngquant(),
      imageminJpegRecompress({
        progressive: true,
        max: 80,
        min: 70
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});
gulp.task("html", async function() {
  return gulp.src("work/*.html")
  .pipe(posthtml())
  .pipe(gulp.dest("build"));
});
gulp.task("cwebp", async function() {
  gulp.src("work/img/**/*.{png,jpg}")
    .pipe(cwebp())
    .pipe(gulp.dest("build/img"))
    .pipe(gulp.dest("work/img"));
});
gulp.task("serve", async function() {
  server.init({
    server: "work",
    notify: true,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("work/less/**/*.less", gulp.series("style")).on("change", server.reload);
  gulp.watch("work/*.html").on("change", server.reload);
  gulp.watch("work/img/**/*.{jpg,png}", gulp.series("cwebp")).on("change", server.reload);
});
gulp.task("go", gulp.series("style", "cwebp", "serve"));
gulp.task("build", gulp.series("clean", "style", "normalize", "copy", "html", "imagemin", "cwebp"));
