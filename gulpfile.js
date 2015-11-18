var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var babel = require('babel/register');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');

var paths = {
    client: ['client/js/game/*.js']
};

gulp.task('copy-client', function() {
    gulp.src('client/js/lib/phaser.min.js')
        .pipe(gulp.dest('./public/js/'));

    gulp.src('client/assets/**/*')
        .pipe(gulp.dest('./public/assets/'));
})

gulp.task('css', function() {
    gulp.src('client/css/main.css')
        .pipe(gulp.dest('./public/css'));
})

gulp.task('jshint-client', function() {
    gulp.src('./client/js/game/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

gulp.task('jshint-server', function() {
    gulp.src('./server/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    gulp.src('./server/gameservice/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
})

gulp.task('test-server', function() {
    return gulp.src('server/gameservice/spec/GameServiceSpec.js')
        .pipe(jasmine());
})

gulp.task('build-client', ['jshint-client', 'copy-client', 'css'], function() {
    var b = browserify();

    b.transform(babelify);
    b.add('client/js/game/game.js');
    b.add('client/js/game/login-page.js');
    return b.bundle()
            .pipe(source('main.min.js'))
            .pipe(gulp.dest('./public/js/'));
});

gulp.task('build-server', ['jshint-server', 'test-server'], function() {});

gulp.task('watch', function() {
    gulp.watch(paths.client, ['build-client']);
});

gulp.task('default', ['build-client', 'build-server'], function() {});
