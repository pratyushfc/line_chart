var gulp	= require('gulp'),
	gutil	= require('gulp-util'),
	uglify  = require('gulp-uglify'),
	concat  = require('gulp-concat'),
	iife = require("gulp-iife");

var process = function(){
	gulp.src('./source/*.js')
        .pipe(concat('multivariant.js'))
        .pipe(iife())
        //.pipe(uglify())
        .pipe(gulp.dest('./public/js'));
    console.log("processing")
}

gulp.task('js', function () {
	process();
});

gulp.task('default', function(){
    gulp.run('js'); 
});

gulp.watch('./source/*.js', process);