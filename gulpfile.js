// REQUIRE PACKAGES

var gulp = require("gulp"),
    autoprefixer = require('autoprefixer-core'),
    wiredep = require("wiredep").stream,
    connect = require("gulp-connect"),
    opn = require("opn"),
    csswring = require("csswring"),
    cssgrace = require("cssgrace"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    postcss = require("gulp-postcss"),
    rigger = require("gulp-useref"),
    sftp = require("gulp-sftp"),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    extend = require('gulp-html-extend'),
    minifyCss = require('gulp-minify-css');

// BUILD 
    gulp.task('clean', function () {
        return gulp.src('dist', {read: false})
            .pipe(clean());
    });

    gulp.task('build', ['clean'], function () {
        var assets = useref.assets();
        var processors = [
            autoprefixer({browsers: ['last 15 version']}),
            cssgrace,
            csswring
        ];
        return gulp.src('app/*.html')
            .pipe(assets)
            .pipe(gulpif('*.js', uglify()))
            .pipe(gulpif('*.css', postcss(processors)))
            .pipe(assets.restore())
            .pipe(useref())
            .pipe(gulp.dest('dist'));
    });

// FOR DEVELOP

    // SERVER
    gulp.task('connect', function() {
      connect.server({
        root: 'app',
        livereload: true,
        port: 8888
      });
      opn('http://localhost:8888/index.html');
    });

    // HTML FROM PARTIALS
    gulp.task('extend', function () {
        gulp.src('./app/html/*.html')
            .pipe(extend({annotations:true,verbose:false})) 
            .pipe(gulp.dest('./app'))
     
    })

    // HTML
    gulp.task('html', ['extend'], function () {
      
      gulp.src('./app/*.html')
        .pipe(wiredep({
          directory: './app/bower'
        }))
        .pipe(gulp.dest('./app'))
        .pipe(connect.reload())
    });

    // CSS
    gulp.task('css', function () {
      gulp.src('./app/css/*.css')    
        .pipe(connect.reload());
    });

    // JS
    gulp.task('js', function () {
      gulp.src('./app/js/*.js')
        .pipe(connect.reload());
    });


// FOR DEPLOY
    
    // CSS
    gulp.task('min-css', function () {
        var processors = [
            autoprefixer({browsers: ['last 15 version']}),
            csswring
        ];
      gulp.src('./app/css/main.css')    
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( './dist/css'))
        .pipe(connect.reload());
    });

    // JS
    gulp.task('min-js', function () {
      gulp.src('./app/js/main.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( build.js ))
        .pipe(connect.reload());
    });

// WATCH FILES 
gulp.task('watch', function () {
  
  gulp.watch(['./app/html/**/*.html'], ['html']);

  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);
  gulp.watch(['./bower.json'], ['html']);

});


// DEFAULT 
gulp.task('default', ['connect', 'watch', 'html', 'css', 'js']);