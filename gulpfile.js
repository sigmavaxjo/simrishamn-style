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

var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');
var require_dir = require('require-dir');

require_dir('./gulp');

gulp.task('instructions', function() {
    console.log("NOTICE: Always run 'gulp patch, gulp minor, gulp major' to bump versions in styleguide!");
});

function inc(importance) {
    return gulp.src(['./package.json'])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('Bumps package version'))
        .pipe(filter('package.json'))
        .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); })
gulp.task('minor', function() { return inc('minor'); })
gulp.task('major', function() { return inc('major'); })

gulp.task('build:sass', gulp.series('sass-dev', 'sass-dist', 'sass-json', 'dss-sass'));
gulp.task('build:scripts', gulp.series('scripts', 'dss-scripts'));

gulp.task('watch', function() {
    gulp.watch('source/js/**/*.js', gulp.series('build:scripts'));
    gulp.watch('source/sass/**/*.scss', gulp.series('build:sass'));
});

gulp.task('bem', gulp.series('build:bem', 'watch:bem'));
gulp.task('icons', gulp.series('iconfont', 'build:sass'));
gulp.task('build', gulp.series('sass-font-awesome', 'icons', 'build:bem', 'build:scripts'));
gulp.task('default', gulp.series('instructions', 'build', 'watch'));
