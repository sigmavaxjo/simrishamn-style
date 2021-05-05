const {
    src,
    dest,
} = require('gulp');

var svgscaler = require('svg-scaler');
var svgo = require('gulp-svgo');
var svgSprite = require('gulp-svg-sprite');
var iconfontTask = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

function iconsprite() {
    return src('source/icons/**/*.svg')
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: '',
                    prefix: 'icon-%s',
                    bust: false,
                    sprite: 'dist/images/icons.svg'
                }
            }
        }))
        .pipe(dest(''));
}

function iconsScale() {
    return src('source/icons/**/*.svg')
        .pipe(svgo())
        .pipe(svgscaler({ width: 1000 }))
        .pipe(dest('source/icons/'))
}

function iconfont() {
    return src('source/icons/**/*.svg')
        .pipe(iconfontTask({
            fontName: 'hbg-pricons',
            prependUnicode: true,
            formats: ['eot', 'svg', 'ttf', 'woff', 'woff2', 'otf'],
            normalize: true,
            ascent: 0
        }))
        .on('glyphs', function (glyph, options) {
            src('source/icons/_pricons.scss')
              .pipe(consolidate('lodash', {
                glyphs: glyph,
                fontName: 'hbg-pricons',
                fontPath: '../fonts/',
                className: 'pricon'
              }))
              .pipe(dest('source/sass/'));

            src('source/icons/pricons.json')
              .pipe(consolidate('lodash', {
                glyphs: glyph,
                fontName: 'hbg-pricons',
                fontPath: '../fonts/',
                className: 'pricon'
              }))
              .pipe(dest('dist/'))
        })
        .pipe(dest('dist/fonts/'));
}

module.exports = {
    iconsprite,
    iconsScale,
    iconfont,
};
