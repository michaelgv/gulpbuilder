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

gulp.task('builder-bump-version', function () {
    return gulp.src(['./package.json'])
                .pipe(bump({ type: "patch" }).on('error', log.error))
                .pipe(gulp.dest('.'))
})

gulp.task('builder-commit-changes', function () {
    return gulp.src('.')
                .pipe(
                    spawn({
                        cmd: "git",
                        args: [
                            "commit",
                            "-m",
                            "'[Release] Automated release'"
                        ]
                    })
                )
})

gulp.task('builder-add-files', function () {
    return spawn('git', ['add', '-u'], { cwd: cwd, stdio: 'inherit' })
})

gulp.task('builder-push-master', function () {
    spawn({
        cmd: "git",
        args: [
            'push',
            '-u',
            'origin',
            'master'
        ]
    })
})

/** Pre-release tasks */

gulp.task('pre-release-builder', function () {
    spawn('git', ['add', '*'], { cwd: cwd, stdio: 'inherit' })
    spawn('git', ['commit', '-m', '"[Release] Automated builder release"'], { cwd: cwd, stdio: 'inherit'})
    spawn('git', ['push', '-u', 'origin', 'master'], { cwd: cwd, stdio: 'inherit'})
})

/** Default */

gulp.task('default', function (done) {
    spawn('npm', ['install'], { cwd: cwd, stdio: 'inherit' })
        .on('close', done)
})