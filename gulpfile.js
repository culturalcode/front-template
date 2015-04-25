var gulp = require("gulp"),
    autoprefixer = require('autoprefixer-core'),
    connect = require("gulp-connect"),
    opn = require("opn"),
    csswring = require("csswring"),
    cssgrace = require("cssgrace"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    postcss = require("gulp-postcss"),
    uglify = require("gulp-uglify"),
    rigger = require("gulp-rigger"),
    sftp = require("gulp-sftp");

// Пути для билда файлов
var build = {
    "html" : "./dist/",
    "css" : "./dist/css/",
    "js" : "./dist/js/",
    "fonts" : "./dist/fonts/",
    "img" : "./dist/img/",
}


// SERVER
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true,
    port: 8888
  });
  opn('http://localhost:8888/build');
});

gulp.task('sftp', function () {
    return gulp.src('./app/build/**/*')
        .pipe(sftp({
            host: 'newdayart.ru',
            user: 'newdayart',
            pass: 'qo4ORscJ',
            remotePath: '/home/newdayart/data/www/newdayart.ru/'
        }));
});

// HTML
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(gulp.dest( build.html ))
    .pipe(connect.reload())
});

// CSS
gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 15 version']}),
        csswring
        // cssgrace,
    ];
  gulp.src('./app/css/style.css')    
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( build.css ))
    .pipe(connect.reload());
});

// JS
gulp.task('js', function () {
  gulp.src('./app/js/main.js')
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( build.js ))
    .pipe(connect.reload());
});

// WATCH FILES 
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/css/style.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);

});


// DEFAULT 
gulp.task('default', ['connect', 'watch', 'html', 'css', 'js']);