var gulp  = require('gulp'),
    less  = require('gulp-less'),
    jade  = require('gulp-jade'),
    bower = require('gulp-bower'),
    minifyCss  = require('gulp-minify-css'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename  = require('gulp-rename'),
    nodemon = require('gulp-nodemon'),
    jshint  = require('gulp-jshint'),
    concat  = require('gulp-concat'),
    gutil   = require('gulp-util'),
    path    = require('path'),
    uglify  = require('gulp-uglify'),
    imagemin   = require('gulp-imagemin'),
    protractor = require('gulp-protractor').protractor,
    jasmine    = require('gulp-jasmine-node'),
    Server   = require('karma').Server,
    mocha   = require('gulp-mocha'),
    source  = require('vinyl-source-stream'),
    paths    = {
      public  : 'public/**',
      jade    : ['!app/shared/**', 'app/**/*.jade'],
      scripts : 'app/scripts/**/*.js',
      images  : 'app/images/**/*',
      styles  : ['app/styles/*.+(less|css|min.css)', '!app/styles/mixin.less'],
      lint    : [
        './index.js', 
        './app/**/*.js', 
        './server/**/*.js', 
        './tests/**/*.js'
      ],
      staticFiles : [
        '!app/**/*.+(less|css|js|jade)',
        '!app/images/**/*',
        'app/**/*.*',
        'app/scripts/**/*.*'
      ],
      unitTests : ['tests/unit/**/*.spec.js', 'public/scripts/**/*.js']
    };

gulp.task('test:fend', function(done) {
  new Server({
    configFile : __dirname + '/karma.conf.js',
    singleRun : true
  }, done).start()
});

gulp.task('test:bend', function() {
  return gulp.src('./tests/server/*.spec.js')
    .pipe(mocha({
      reporter : 'spec',
      timeout: 50000
    }))
    .pipe(jasmine({
      // spec output uses color to indicate passing (green)
      showColors: true, 
      // or failing (red) specs
      // allow execution of .coffee specs
      coffee: true,     
      // verbose output as the specs run
      verbose: true     
    }))
    .once('end', function() {
      process.exit(1);
    })
    .once('end', function () {
      process.exit();
    });
});

gulp.task('less', function() {
  gulp.src(paths.styles)
    .pipe(less({
      paths : [path.join(__dirname, './app/styles')]
    }))
    .pipe(concat('style'))
    .pipe(minifyCss())
    .pipe(rename("doc_style.min.css"))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('jade', function() {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'));
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel : 3,
      progressive : true,
      interlaced : true
    }))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('lint', function() {
  return gulp.src(paths.lint)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('minify', function() {
  gulp.src(paths.scripts)
    .pipe(concat('doc_script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/min/'))
});

gulp.task('concat:controllers', function() {
  gulp.src('app/scripts/controllers/*.js')
    .pipe(concat('controller.js'))
    .pipe(gulp.dest('./public/scripts/controllers/'))
});

gulp.task('concat:services', function() {
  gulp.src('app/scripts/services/*.js')
    .pipe(concat('services.js'))
    .pipe(gulp.dest('./public/scripts/services/'))
});

gulp.task('static-files', function() {
  return gulp.src(paths.staticFiles)
    .pipe(gulp.dest('public/'));
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('public/lib/'));
});

gulp.task('nodemon', function() {
  nodemon({
    script : 'index.js',
    ext    : 'js',
    ignore : [
      'public/**',
      'node_modules/**'
    ]
  })
  .on('change', ['lint']) 
  .on('restart', function() {
    console.log('>> node restart');
  });
});

gulp.task('test:e2e', function(cb) {
  gulp.src('./tests/e2e/**/*.js')
    .pipe(protractor({
      configFile : './protractor.conf.js',
      args : ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', function(e) {
      console.log(e);
    })
    .on('end', cb)
});

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.scripts, ['minify']);
});

gulp.task('watch:fend', function() {
  return gulp.watch(paths.unitTests, ['fend:test'])
})

// 'e2e:test', 'fend:test'
gulp.task('build', ['bower', 'jade', 'less', 'static-files', 'images', 'minify']);
gulp.task('test', ['bend:test']);
gulp.task('concat:development', ['concat:controllers', 'concat:services']);
gulp.task('heroku:production', ['build']);
gulp.task('production', ['nodemon', 'build']);
gulp.task('default', ['nodemon', 'build', 'watch'], function() {
  return gutil.log('Gulp running')
});