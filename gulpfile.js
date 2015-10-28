var gulp    = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', ['server']);

// npm install supervisor -g
gulp.task('server', function () {
  return gulp.src('').pipe(shell([ 'node-supervisor app.js' ]));
});

gulp.task('put', function() {
  return gulp.src('').pipe(shell(["curl -X PUT -v localhost:3000/user"]));
});

gulp.task('delete', function() {
  return gulp.src('').pipe(shell("curl -X DELETE -v localhost:3000/user"));
});

gulp.task('post', function() {
  return gulp.src('').pipe(shell("curl -X POST -v -d 'ignored data' localhost:3000"));
});

gulp.task('put', function() {
  return gulp.src('').pipe(shell(["curl -X PUT -v localhost:3000/user"]));
});

gulp.task('secretdelete', function() {
  return gulp.src('').pipe(shell("curl -X DELETE -v localhost:3000/secret"));
});

gulp.task('secretpost', function() {
  return gulp.src('').pipe(shell("curl -X POST -v -d 'ignored data' localhost:3000/secret"));
});

gulp.task('cookie', function() {
  return gulp.src('').pipe(shell("curl --cookie chuchu=4 localhost:3000/usuario/casiano"));
});

var del = require('del');
gulp.task('clean', function(cb) {
  del(['node_modules/*'], cb);
});
