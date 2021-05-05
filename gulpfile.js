// ==========================================================================
//
// TASKS:
//
// "gulp"                       -   Build and watch combined
// "gulp watch"                 -   Watch for file changes and compile changed files
// "gulp build"                 -   Build assets
// "gulp icons"                 -   Build icons
// "gulp patch/minor/major"     -   Bump package version
//
// ==========================================================================

const {
    series,
    src,
    dest,
    watch: gulpWatch
} = require('gulp');

const bump = require('gulp-bump');
const git = require('gulp-git');
const filter = require('gulp-filter');
const tag_version = require('gulp-tag-version');

const tasks = require('require-dir')('./gulp');

const buildSass = series(tasks.sass.sassDev, tasks.sass.sassDist, tasks.sass.sassJson, tasks.dss.dssSass);

const buildScripts = series(tasks.scripts.scripts, tasks.dss.dssScripts);

const icons = series(tasks.icons.iconfont, buildSass);

const build = series(tasks.sass.sassFontAwesome, icons, tasks['sass-bem'].buildBem, buildScripts);

function watch() {
    gulpWatch('source/js/**/*.js', buildScripts);
    gulpWatch('source/sass/**/*.scss', buildSass);
}

function instructions() {
    console.log("NOTICE: Always run 'gulp patch, gulp minor, gulp major' to bump versions in styleguide!");
}

function inc(importance) {
    return src(['./package.json'])
        .pipe(bump({type: importance}))
        .pipe(dest('./'))
        .pipe(git.commit('Bumps package version'))
        .pipe(filter('package.json'))
        .pipe(tag_version());
}

function patch() {
    return inc('patch');
}

function minor() {
    return inc('minor');
}

function major() {
    return inc('major');
}

const bem = series(tasks['sass-bem'].buildBem, tasks['sass-bem'].watchBem);

exports.build = build;
exports.watch = watch;
exports.icons = icons;
exports.patch = patch;
exports.minor = minor;
exports.major = major;
exports.bem = bem;
exports.default = series(instructions, build, watch);
