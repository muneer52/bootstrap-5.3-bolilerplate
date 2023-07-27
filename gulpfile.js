const { src, dest, watch, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

// Sass Task
function scssTask() {
  const plugins = [
    autoprefixer(),
    cssnano(),
  ];

  return src("assets/scss/styles.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(dest("assets/css/", { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
  return src("assets/js/script.js", { sourcemaps: true, allowEmpty: true })
    .pipe(terser())
    .pipe(dest("assets/js/", { sourcemaps: "." }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["assets/scss/**/*.scss", "assets/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
