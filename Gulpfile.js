var gulp 	= require('gulp');
var connect = require('gulp-connect');


gulp.task('serve', function() {
	connect.server({
		root		: '',
		port 		: 8080,
		livereload	: true,
	});

	gulp.watch('js/**/*.js'	, ['reload']);
	gulp.watch('css/**/*.css'	, ['reload']);
	gulp.watch('**/*.html'	, ['reload']);
});

gulp.task('reload', function() {
	gulp
	.src('')
	.pipe(connect.reload());
});


gulp.task('default', ['serve']);