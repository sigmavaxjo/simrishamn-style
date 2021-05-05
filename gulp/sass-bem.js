const {
    series,
    src,
    dest,
    watch: gulpWatch
} = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const gzip = require('gulp-gzip');

const inject = require('gulp-inject');

const node_modules = 'node_modules/';

const buildSassBem = series(sassDevBem, sassDistBem);

function watchBem() {
    gulpWatch('source/sass-bem/**/*.scss', buildSassBem);
    gulpWatch('source/sass/**/*.scss', buildSassBem);
}

function sassDistBem() {
    return src('source/sass-bem/_themes/*.scss')
            .pipe(plumber())
            .pipe(sass().on('error', sass.logError))
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
            .pipe(rename({prefix: 'hbg-prime-', suffix: '.min'}))
            .pipe(cleanCSS({debug: true}))
            .pipe(gzip({append: false, level: 9}))
            .pipe(dest('dist/css-bem'))
            .pipe(browserSync.stream());
}

function sassDevBem() {
    return src('source/sass-bem/_themes/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ sourceComments: true }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(rename({prefix: 'hbg-prime-', suffix: '.dev'}))
        .pipe(sourcemaps.write())
        .pipe(gzip({append: false, level: 9}))
        .pipe(dest('dist/css-bem'))
        .pipe(browserSync.stream());
}

function injectConfig(layer) {
    return {
        starttag: '// inject:' + layer,
        endtag: '// endinject',
        transform: function (filepath) {return '@import ".' + filepath + '";';}
    };
}

function injectTools() {
    const layer = 'tools';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src(['./source/sass/' + layer + '/**/*.scss', './source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

function injectGeneric() {
    const layer = 'generic';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src(['./source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

function injectElements() {
    const layer = 'elements';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src(['./source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

function injectObjects() {
    const layer = 'objects';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src(['./source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

function injectComponents() {
    const layer = 'components';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src([node_modules + 'hamburgers/_sass/hamburgers/hamburgers.scss', './source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

function injectScope() {
    const layer = 'scope';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src(['./source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

function injectUtilities() {
    const layer = 'utilities';
    const config = injectConfig(layer);

    return src('./source/sass-bem/_bootstrap.scss')
        .pipe(inject(src(['./source/sass-bem/' + layer + '/**/*.scss'], {read: false}, {relative: false}), config))
        .pipe(dest('./source/sass-bem'));
}

const injectBem = series(injectTools, injectGeneric, injectElements, injectObjects, injectComponents, injectScope, injectUtilities);

const buildBem = series(injectBem, buildSassBem);

module.exports = {
    buildBem,
    sassDevBem,
    sassDistBem,
    watchBem,
};
