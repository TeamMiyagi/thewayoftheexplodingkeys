var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var babel = require('babel/register');
var uglify = require('gulp-uglify');

var paths = {
    client: ['client/js/game/*.js']
};

gulp.task('copy-client', function() {
    gulp.src('client/js/lib/phaser.min.js')
        .pipe(gulp.dest('./public/js/'));

    gulp.src('client/assets/**/*')
        .pipe(gulp.dest('./public/assets/'));
})

gulp.task('build-client', ['copy-client'], function() {
    var b = browserify();

    b.transform(babelify);
    b.add('client/js/game/game.js');
    b.add('client/js/game/login-page.js');
    return b.bundle()
            .pipe(source('main.min.js'))
            .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
    gulp.watch(paths.client, ['build-client']);
});

gulp.task('default', ['build-client'], function() {});
