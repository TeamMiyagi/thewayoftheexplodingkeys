var gulp = require('gulp');
var watch = require('gulp-watch');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var run = require('gulp-run');
var babelify = require('babelify');
var babel = require('babel/register');
var uglify = require('gulp-uglify');

var paths = {
    client: ['client/js/**/*.js']
};

gulp.task('browserify', function () {
    var b = browserify();
    b.transform(babelify);
    return b.bundle()
            .pipe(source('client/js/**/*.js'))
            .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['browserify']);
});
