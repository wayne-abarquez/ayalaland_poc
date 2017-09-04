'use strict';

var gulp = require('gulp'),
    paths = gulp.paths;

var //browserSync = require('browser-sync'),
    runSequence = require('run-sequence');

//browserSync({
//    notify: true,
//    proxy: "127.0.0.1:81" // TODO: Change Port (dev port)
//});

gulp.task('watch', function(event) {
    // Watch HTML Files
    gulp.watch(paths.templates + '**/*.html');

    // Watch App JS Files
    gulp.watch([
        paths.srcJs + 'app/*.js',
        paths.srcJs + 'app/**/*.js'
    ], function (event) {
        runSequence('app-scripts');
    });

    gulp.watch(paths.srcLibJs + 'login.js', function (event) {
        runSequence('login-scripts');
    });

    gulp.watch(paths.bower + '**/*.js');

    // Watch Sass Files
    gulp.watch(paths.srcSass + '**/*.scss',
        function (event) {
            runSequence('sass');
        });
});