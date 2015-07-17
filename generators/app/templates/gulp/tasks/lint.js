const gulp = require('gulp');
const eslint = require('gulp-eslint');
const config = require('../config');
const empty = require('gulp-empty');

const testConfig = {
    rules: {
        'no-unused-expressions': 0,
    },
    env: {
        'mocha': true,
    },
};

function lint(glob, eslintConf = {}, tdd = false) {
    return () => {
        return gulp.src(glob)
            .pipe(eslint(eslintConf))
            .pipe(eslint.format())
            .pipe(tdd ? empty() : eslint.failAfterError());
    };
}

function defineLintingTasks(taskName, root) {
    gulp.task(`lint-${taskName}-source`, lint(root.source));
    gulp.task(`lint-${taskName}-test`, lint(root.test, testConfig));
    gulp.task(`lint-${taskName}-source-tdd`, lint(root.source, {}, true));
    gulp.task(`lint-${taskName}-test-tdd`, lint(root.test, true, testConfig));

    // Aggregated Tasks
    gulp.task(`lint-${taskName}`, [`lint-${taskName}-source`, `lint-${taskName}-test`]);
    gulp.task(`lint-${taskName}-tdd`, [`lint-${taskName}-source-tdd`, `lint-${taskName}-test-tdd`]);
}

defineLintingTasks('client', config.client);
defineLintingTasks('server', config.server);
gulp.task('lint-build', lint(config.build));
gulp.task('lint', ['lint-client', 'lint-server', 'lint-build']);
