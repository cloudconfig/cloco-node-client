'use strict';

var
    eventStream = require('event-stream'),
    gulp = require('gulp'),
    istanbul = require('gulp-istanbul'),
    jasmine = require('gulp-jasmine'),
    reporters = require('jasmine-reporters'),
    sourcemaps = require('gulp-sourcemaps'),
    tscconfigDev = require('./tsconfig.json'),
    tslint = require('gulp-tslint'),
    typescript = require('gulp-typescript');

// Entry point into the gulp build tasks.
gulp.task('build-all', ['tslint', 'tsc']);

// linting
gulp.task('tslint', function() {
    return gulp.src('src/**/*.ts')
      .pipe(tslint({
        formatter: 'verbose'
      }))
      .pipe(tslint.report());
});

// Compile typescript sources
gulp.task('tsc', function() {
    var result = gulp
        .src(tscconfigDev.include)
        .pipe(typescript(tscconfigDev.compilerOptions));

        return eventStream.merge(
          result.dts.pipe(gulp.dest('lib')),
          result.js.pipe(gulp.dest('lib'))
        );
});

gulp.task('jasmine', function() {
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

gulp.task('istanbul', ['istanbul:pre-test'], function() {
  var istanbulCoverageOutputDirectory = 'test/output';
    console.log('Finding specs at: lib/**/*.[Ss]pec.js');
    console.log('Writing coverage reports to: ' + istanbulCoverageOutputDirectory);
    return gulp.src('lib/**/*.[Ss]pec.js')
        .pipe(jasmine({
            includeStackTrace: true,
            reporter: [new reporters.TerminalReporter({
                color: true,
                showStack: true,
                verbosity: 3
            })],
            verbose: true
        }))
        // create the reports after tests ran
        .pipe(istanbul.writeReports({
                                      dir: istanbulCoverageOutputDirectory,
                                      reporters: [ 'lcovonly', 'json', 'text', 'text-summary', 'html'],
                                      reportOpts: {
                                                    dir: istanbulCoverageOutputDirectory,
                                                    lcov: {dir: istanbulCoverageOutputDirectory + '/lcovonly', file: 'lcov.info'},
                                                    json: {dir: istanbulCoverageOutputDirectory + '/json', file: 'coverage.json'},
                                                    html: {dir: istanbulCoverageOutputDirectory + '/html'},
                                                  }
                                    }))
        // Enforce a coverage of at least 90%.
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

// don't run me on my own. this just prepares istanbul before the jasmine test run, it's meaningless without the jasmine run afterwards.
gulp.task('istanbul:pre-test', function () {
  var serverCoverageGlob = ['lib/**/*.js', '!lib/**/*.[Ss]pec.js', '!lib/test/*.js'];
  console.log('Istanbul Covering the following code: ' + serverCoverageGlob);
  return gulp.src(serverCoverageGlob)
    .pipe(sourcemaps.init())
    // includeUntested makes it include files that aren't covered by any specs.
    .pipe(istanbul({includeUntested: true}))
    .pipe(sourcemaps.write('.'))
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('jasmine:ci', function() {
    return gulp.src('lib/**/*.[Ss]pec.js')
    .pipe(jasmine({
        includeStackTrace: true,
        reporter: [new reporters.JUnitXmlReporter({
            savePath: "shippable/testresults/",
            showStack: true,
        })],
        verbose: true
    }));
});

gulp.task('istanbul:ci', ['istanbul:pre-test'], function() {
  var istanbulCoverageOutputDirectory = 'shippable/codecoverage/';
    console.log('Finding specs at: lib/**/*.[Ss]pec.js');
    console.log('Writing coverage reports to: ' + istanbulCoverageOutputDirectory);
    return gulp.src('lib/**/*.[Ss]pec.js')
        .pipe(jasmine({
            includeStackTrace: true,
            reporter: [new reporters.TerminalReporter({
                color: true,
                showStack: true,
                verbosity: 3
            })],
            verbose: true
        }))
        // create the reports after tests ran
        // create the reports after tests ran
        .pipe(istanbul.writeReports({
                                      dir: 'shippable/codecoverage/',
                                      reporters: [ 'cobertura'],
                                    }))
        // Enforce a coverage of at least 90%.
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});
