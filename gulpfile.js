var gulp	= require('gulp'),
	gutil	= require('gulp-util'),
	uglify  = require('gulp-uglify'),
	concat  = require('gulp-concat'),
	iife = require("gulp-iife"),
	htmlreplace = require('gulp-html-replace');

var process = function(){
	gulp.src('./development/js/*.js')
        .pipe(concat('multivariant.min.js'))
        .pipe(iife())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));

    gulp.src('./development/index.html')
    .pipe(htmlreplace({
        'css': 'css/chart.css',
        'js': 'js/multivariant.min.js'
    }))
    .pipe(gulp.dest('./public/'));

	gulp.src('./development/css/chart.css')
    .pipe(concat('chart.css'))
    .pipe(gulp.dest('./public/css/'));

	gulp.src('./development/app.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public'));


    console.log("File build; See output at 'public'")
}

gulp.task('build', function () {
	process();
});

gulp.task('default', function(){
    //gulp.run('js'); 
});

//gulp.watch('./development/*.js', process);