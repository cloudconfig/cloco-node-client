"use strict";

var
    eventStream = require("event-stream"),
    gulp = require("gulp"),
    jasmine = require("gulp-jasmine"),
    reporters = require("jasmine-reporters"),
    sourcemaps = require("gulp-sourcemaps"),
    tscconfigDev = require("./tsconfig.json"),
    tslint = require('gulp-tslint'),
    typescript = require("gulp-typescript");

// Entry point into the gulp build tasks.
gulp.task("build-all", ['tslint', 'tsc']);

// linting
gulp.task('tslint', function() {
    return gulp.src('src/**/*.ts')
      .pipe(tslint({
        formatter: "verbose"
      }))
      .pipe(tslint.report());
});

// Compile typescript sources
gulp.task('tsc', function() {
    var result = gulp
        .src(tscconfigDev.include)
        .pipe(typescript(tscconfigDev.compilerOptions));

        return eventStream.merge(
          result.dts.pipe(gulp.dest("lib")),
          result.js.pipe(gulp.dest("lib"))
        );
});

gulp.task("jasmine", function() {
    return gulp.src('lib/**/*.[Ss]pec.js')
        .pipe(jasmine({
            includeStackTrace: true,
            reporter: [new reporters.TerminalReporter({
                color: true,
                showStack: true,
                verbosity: 3
            })],
            verbose: true
        }));
});
