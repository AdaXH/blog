const gulp = require('gulp');
const concat = require('gulp-concat');
const uglifyJS = require('gulp-uglify');
const babel = require('gulp-babel');
const fs = require('fs');

gulp.task('test', () => {
  console.log('yes');
});

gulp.task('expressjs', () => {
  gulp
    .src('./koa.js')
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(uglifyJS())
    .pipe(concat('buddle.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('expresscon', () => {
  const files = fs.readdirSync(__dirname + '/controllers');
  files.forEach((item) => {
    const controller = require(__dirname + '/controllers/' + item);
    if (controller) {
      gulp
        .src(`./controllers/${item}`)
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(uglifyJS())
        .pipe(concat(`${item}`))
        .pipe(gulp.dest('./controllers/dist/'));
    }
  });
});

gulp.task('watch', () => {
  gulp.watch('./koa.js', () => {
    return gulp
      .src('./koa.js')
      .pipe(babel({ presets: ['@babel/preset-env'] }))
      .pipe(uglifyJS())
      .pipe(concat('app-buddle.js'))
      .pipe(gulp.dest('./'));
  });
  gulp.watch('./controllers/*.js', () => {
    const files = fs.readdirSync(__dirname + '/controllers');
    files.forEach((item) => {
      const controller = require(__dirname + '/controllers/' + item);
      if (controller) {
        return gulp
          .src(`./controllers/${item}`)
          .pipe(babel({ presets: ['@babel/preset-env'] }))
          .pipe(uglifyJS())
          .pipe(concat(`${item}`))
          .pipe(gulp.dest('./controllers/dist/'));
      }
    });
  });
});

gulp.task('default', () => {
  gulp.task('watch');
});
