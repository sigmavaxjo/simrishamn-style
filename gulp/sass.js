const {
    src,
    dest,
    watch: gulpWatch,
    parallel
} = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var browserSync = require('browser-sync').create();
var sassJsonTask = require('gulp-sass-json');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var gzip = require('gulp-gzip');

var node_modules = 'node_modules/';

function sassDist() {
    return src('source/sass/themes/*.scss')
            .pipe(plumber())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
            .pipe(rename({prefix: 'hbg-prime-', suffix: '.min'}))
            .pipe(cleanCSS({debug: true}))
            .pipe(gzip({append: false, level: 9}))
            .pipe(dest('dist/css'))
            .pipe(browserSync.stream());
}

function sassDev() {
    return src('source/sass/themes/*.scss')
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass({ sourceComments: true }).on('error', sass.logError))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
            .pipe(rename({prefix: 'hbg-prime-', suffix: '.dev'}))
            .pipe(sourcemaps.write())
            .pipe(gzip({append: false, level: 9}))
            .pipe(dest('dist/css'))
            .pipe(browserSync.stream());
}

function sassJson() {
    return src('source/sass/themes/*.scss')
        .pipe(sassJsonTask())
        .pipe(dest('dist/vars'));
}

function sassFontAwesome() {
    const streams = [];

    streams.push(
        new Promise((resolve, reject) => {
            src(node_modules + 'font-awesome/css/font-awesome.min.css')
                .pipe(dest('source/sass'))
                .on('end', resolve)
                .on('error', reject);
        })
    );

    streams.push(
        new Promise((resolve, reject) => {
            src(node_modules + 'font-awesome/fonts/*')
                .pipe(dest('dist/fonts/'))
                .on('end', resolve)
                .on('error', reject);
        })
    );

    return Promise.all(streams);
}

function broserSync() {
    return browserSync.init({
        proxy: "hbgprime.local"
    });
}

function watch() {
    gulpWatch('source/js/**/*.js', ['build:scripts', browserSync.reload]);
    gulpWatch('source/sass/**/*.scss', ['build:sass']);
}

const watchLive = parallel(broserSync, watch);

module.exports = {
    sassFontAwesome,
    sassDev,
    sassDist,
    sassJson,
}
