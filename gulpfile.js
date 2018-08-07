const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglifyJS = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('test',()=>{
	console.log('yes');
})

gulp.task('sass',()=>{
	gulp.src('./public/sass/**/*.scss')
		.pipe(sass({outputStyle:'compressed'}))
		.pipe(gulp.dest('./public/sass'));
})

gulp.task('expressjs',()=>{
	gulp.src('./public/js/main.js')
	.pipe(concat('buddle.js'))
	.pipe(babel({
            presets: ['env']
        }))
	.pipe(uglifyJS())
	.pipe(gulp.dest('./public/js'));
})

gulp.task('watch',()=>{
	gulp.watch(['./public/sass/**/*.scss'],['sass']);
	gulp.watch('./public/js/main.js',['expressjs']);
})

gulp.task('default',()=>{
	gulp.start('watch');
});
