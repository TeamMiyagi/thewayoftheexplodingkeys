var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var babel = require('babel/register');
var uglify = require('gulp-uglify');

var paths = {
    client: ['client/js/**/*.js']
};

gulp.task('build-client', function () {
    var b = browserify();
    b.transform(babelify);
    b.add('client/js/game/game.js');
    return b.bundle()
            .pipe(source('main.min.js'))
            .pipe(gulp.dest('./client/js/'));
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['browserify']);
});
