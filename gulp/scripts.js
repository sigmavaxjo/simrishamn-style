const {
    src,
    dest,
} = require('gulp');

const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const node_modules = 'node_modules/';

function scripts() {
    return src([
        node_modules + 'packery/dist/packery.pkgd.js',
        node_modules + 'jquery/dist/jquery.js',
        'plugins/jquery-ui-1.11.4/jquery-ui.js',
        node_modules + 'es6-weakmap/dist/weakmap.min.js',
        node_modules + 'hyperform/dist/hyperform.js',
        node_modules + 'flickity/dist/flickity.pkgd.min.js',
        'source/js/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('hbg-prime.dev.js'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
    .pipe(rename('hbg-prime.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js'));
}

module.exports = {
    scripts,
};
