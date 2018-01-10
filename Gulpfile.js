/**
 * -----------------------------------
 * - Gulp File for deployment cycles -
 * -----------------------------------
 */

const gulp = require('gulp')
const bump = require('gulp-bump')
const log = require('gulplog')
const git = require('gulp-git')
const { spawn } = require('child_process')

gulp.task('builder-bump-version', function () {
    return gulp.src(['./package.json'])
                .pipe(bump({ type: "patch" }).on('error', log.error))
                .pipe(gulp.dest('/'))
})

gulp.task('builder-commit-changes', function () {
    return gulp.src('.')
                .pipe(git.commit('[Builder] Pre-release', { args: '-m'}))
})

gulp.task('builder-add-files', function () {
    return gulp.src('.')
                .pipe(
                    git.add()
                )
})

gulp.task('builder-push-master', function () {
    git.push('origin', ['master'], {}, function (err) {
        if(err) throw err
    })
})

/** Pre-release tasks */

gulp.task('pre-release-builder', ['builder-add-files', 'builder-commit-changes', 'builder-push-master'], function () {
})