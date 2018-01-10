/**
 * -----------------------------------
 * - Gulp File for deployment cycles -
 * -----------------------------------
 */

const gulp = require('gulp')
const bump = require('gulp-bump')
const log = require('gulplog')
const git = require('gulp-git')
const spawn = require('child_process').spawn;
const cwd = process.cwd()

/** Version Bumping */
gulp.task('builder-bump-version', function () {
    return gulp.src(['./package.json'])
                .pipe(bump({ type: "patch" }).on('error', log.error))
                .pipe(gulp.dest('.'))
})

/** Pre-release tasks */
gulp.task('pre-release-builder-internal', function () {
    let commit = () => {
        log.info('commit')
        spawn('git', ['commit', '-m', '"[Release] Automated builder release version '+require('./package.json').version+'"'], { cwd: cwd, stdio: 'inherit'})
            .on('close', push)
    }
    let push = () => {
        log.info('push')
        spawn('git', ['push', '-u', 'origin', 'master'], { cwd: cwd, stdio: 'inherit'})
    }
    spawn('git', ['add', '*'], { cwd: cwd, stdio: 'inherit' })
        .on('close', commit)
})

gulp.task('pre-release-builder', gulp.series('builder-bump-version', 'pre-release-builder-internal', function (done) {
    done()
}))

/** Default */

gulp.task('default', function (done) {
    spawn('npm', ['install'], { cwd: cwd, stdio: 'inherit' })
        .on('close', done)
})