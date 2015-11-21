var gulp = require('gulp');

// será que como load plugins, não precisa disso?
var sass = require('gulp-ruby-sass');
var notify = require("gulp-notify");
var bower = require('gulp-bower');

var plugins = require('gulp-load-plugins')();

// A basic node module used to remove directories in clean tasks.
var del = require('del');

// A toolkit for working with streams, the objects processed by the Gulp API.
var es = require('event-stream');

// Gets a list of all the project's main bower files. Great for discovering and injecting third-party dependencies automatically.
var bowerFiles = require('main-bower-files');

// Gulp plugin to print what's in the pipe. Nice for debugging. Didn't work with gulp-load-plugins for some reason.
var print = require('gulp-print');

// promessas :)
var Q = require('q');

var livereload = require('gulp-livereload');

// -----------------

var paths = {
    scripts: 'app/**/*.js',
    assets: './app/assets/*',
    fontsList: './fonts.list',
    styles: ['./app/**/*.css', './app/**/*.scss'],
    index: './app/index.html',
    partials: ['app/**/*.html', '!app/index.html'],
    distDev: './dist.dev',
    distDevStyles: './dist.dev/styles',
    distDevAssets: './dist.dev/assets',
    distProd: './dist.prod',
    distProdStyles: './dist.prod/styles',
    distProdAssets: './dist.prod/assets',
    distScriptsProd: './dist.prod/scripts',

    server: './app.js',
    serverScripts: ['./bin/*', './routes/**/*.js', './models/**/*.js']

};

var pipes = {};

pipes.nodemonDev = function() {
    return plugins.nodemon({
        script: paths.server,
        env: {
            'NODE_ENV': 'development'
        }
    })
        .on('restart');
};



pipes.assetsDev = function() {
    return gulp.src(paths.assets)
        // @todo como renomear as imagens para forçar atualização?
        .pipe(gulp.dest(paths.distDevAssets));
};

pipes.assetsProd = function() {
    return gulp.src(paths.assets)
        // @todo como renomear as imagens para forçar atualização?
        .pipe(gulp.dest(paths.distProdAssets));
};


// Ordering scripts
// These return streams that have scripts correctly ordered.
pipes.orderedVendorScripts = function() {
    return plugins.order(['angular.js', 'angular-router.js', 'angular-scroll.js', 'jquery.js', 'bootstrap.js']);
    //return plugins.order(['jquery.js', 'angular.js', 'angular-router.js']);
};

// gulp-angular-filesort is a neat plugin that reads angular scripts and figures out the correct loading order.
pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

// Renaming files
// Returns a stream that has renamed arbitrary files to have .min before the existing file extension.
pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

// Building application scripts
// Returns a stream of app scripts that check out with jshint.
// * JSHint is a tool that helps to detect errors and potential problems in your JavaScript code. (http://jshint.com/)
pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

// For development, validated scripts are simply moved to the dev environment. Returns a stream of the newly moved files.
pipes.builtAppScriptsDev = function() {
    return pipes.validatedAppScripts()
        .pipe(gulp.dest(paths.distDev));
};

// Returns a stream of one script called app.min.js that contains validated, correctly ordered, concatenated, and
// uglyfied application scripts. Also includes validated HTML partials that have been converted to JavaScript
// to pre-load the Angular template cache.
//
// This one is interesting because we use es.merge, which combines the two dependent streams, scriptedPartials and
// validatedAppScripts, into a single stream. The downstream pipes.orderedAppScripts will block until this stream is
// complete, but makes no guarantees about the order of the events emmitted by the constituent streams. Also note
// that we're adding a sourcemap to the final script. The concat and uglify pipes have to be attached between
// sourcemaps.init() and sourcemaps.write().
pipes.builtAppScriptsProd = function() {
    var scriptedPartials = pipes.scriptedPartials();
    var validatedAppScripts = pipes.validatedAppScripts();

    return es.merge(scriptedPartials, validatedAppScripts)
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distScriptsProd)).on('error', function(e){
            console.log(e);
        });
};

// Vendor scripts
// a stream of third-party scripts in dist.dev/bower_components.
pipes.builtVendorScriptsDev = function() {
    return gulp.src(bowerFiles())
        .pipe(gulp.dest('dist.dev/bower_components'));
};

// For production, we order third-party scripts, then concatenate and uglify them into a single file.
// I chose not to create a sourcemap for this one, because it ended up being too large.
pipes.builtVendorScriptsProd = function() {
    return gulp.src(bowerFiles('**/*.js'))
        //return gulp.src(bowerFiles()) // @todo This way fires an error. Check out why.
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify().on('error', function(e){console.log(e)})) // @todo tá dando erro. por ora, deixa assim
        .pipe(gulp.dest(paths.distScriptsProd));
};

// Returns a stream of HTML files validated with htmlhint.
pipes.validatedPartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter());
};

// For development, this segment returns validated partials in the dev environment.
pipes.builtPartialsDev = function() {
    return pipes.validatedPartials()
        .pipe(gulp.dest(paths.distDev));
};

// Skipped validatedDevServerScripts
pipes.validatedDevServerScripts = function() {
    return gulp.src(paths.serverScripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

// ngHtml2js converts all partials to JavaScript and preloads them into the Angular template cache.
// returns a stream of one JavaScript file that will execute the preloading
// This stream is merged into pipes.builtAppScriptsProd
// the moduleName value should be the name of the Angular app which uses the partials.
pipes.scriptedPartials = function() {
    return pipes.validatedPartials()
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(plugins.ngHtml2js({
            moduleName: "ukeSongbookApp",
            declareModule: false // https://github.com/marklagendijk/gulp-ng-html2js/issues/19
        }));
};

// DEV STYLES
pipes.builtGeneralStylesDev = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sass())
        .pipe(gulp.dest(paths.distDev));
};

// For more fonts: https://github.com/battlesnake/gulp-google-webfonts
pipes.builtFontStylesDev = function() {
    return gulp.src(paths.fontsList)
        .pipe(plugins.googleWebfonts())
        .pipe(gulp.dest(paths.distDevStyles));
};

// Building styles!
pipes.builtStylesDev = function() {
    return es.merge(pipes.builtFontStylesDev(), pipes.builtGeneralStylesDev());
};

// PROD STYLES
pipes.builtGeneralStylesProd = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sourcemaps.init()) // @todo pra que isso?
        .pipe(plugins.sass())
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.distProd))
};
// For more fonts: https://github.com/battlesnake/gulp-google-webfonts
pipes.builtFontStylesProd = function() {
    return gulp.src(paths.fontsList)
        .pipe(plugins.googleWebfonts())
        .pipe(gulp.dest(paths.distProdStyles))
};
pipes.builtStylesProd = function() {
    return es.merge(pipes.builtFontStylesProd(), pipes.builtGeneralStylesProd());
};

// Building the index
// Because the index (shell page) pulls together many different streams, we have some special,
// more complicated pipe segments for it. This segment returns a stream of index.html, validated with htmlhint.
pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter());
};

// This stream outputs an index.html in the dev environment which references all the files built for development.
// Notice that there are three pipe segments that feed into the index stream.
pipes.builtIndexDev = function() {

    var orderedVendorScripts = pipes.builtVendorScriptsDev()
        .pipe(pipes.orderedVendorScripts()); // @todo ??

    var orderedAppScripts = pipes.builtAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var appStyles = pipes.builtStylesDev();

    var appAssets = pipes.assetsDev();

    // The gulp-inject plugin is used to write
    // references into the index file in the places denoted.
    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.inject(appAssets, {relative: true}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexProd = function() {

    var vendorScripts = pipes.builtVendorScriptsProd();
    var appScripts = pipes.builtAppScriptsProd();
    var appStyles = pipes.builtStylesProd();
    var appAssets = pipes.assetsProd();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(appScripts, {relative: true}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.inject(appAssets, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

// Build everything!
// DEV: merge the index and partials streams because there's no direct reference to the partial files in index.html.
pipes.builtAppDev = function() {
    return es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev());
};

// PROD: simply forward the stream from pipes.builtIndexProd because the partials are included in the app scripts.
pipes.builtAppProd = function() {
    return pipes.builtIndexProd();
};

// GULP TASKS
// removes all compiled dev files
gulp.task('clean-dev', function() {
    return del(paths.distDev).then(function(paths) {
        if (paths && paths != '') {
            console.log('[gulp][clean] Deleted dev files/folders:\n', paths.join('\n'));
        }
    });
});

// removes all compiled prod files
gulp.task('clean-prod', function() {
    return del(paths.distProd).then(function(paths) {
        if (paths && paths != '') {
            console.log('[gulp][clean] Deleted prod files/folders:\n', paths.join('\n'));
        }
    });
});


gulp.task('nodemon-dev', pipes.nodemonDev);

gulp.task('move-assets-dev', pipes.assetsDev);

// checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatedPartials);

// checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// converts partials to javascript using html2js
gulp.task('convert-partials-to-js', pipes.scriptedPartials);

// runs jshint on the dev server scripts
gulp.task('validate-devserver-scripts', pipes.validatedDevServerScripts);

// runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// compiles app sass and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);

// compiles and minifies app sass to css and moves to the prod environment
gulp.task('build-styles-prod', pipes.builtStylesProd);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// validates and injects sources into index.html and moves it to the dev environment
gulp.task('build-index-dev', pipes.builtIndexDev);

// validates and injects sources into index.html, minifies and moves it to the dev environment
gulp.task('build-index-prod', pipes.builtIndexProd);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);
//gulp.task('clean-build-app-dev', [], pipes.builtAppDev);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod'], pipes.builtAppProd);

// ERROR -- não está sendo usado afinal
// Handle an error based on its severity level.
// Log all levels, and exit the process for fatal levels.
function handleError(level, error) {
    gutil.log(error.message);
    if (isFatal(level)) {
        process.exit(1);
    }
}

// Convenience handler for error-level errors.
function onError(error) { handleError.call(this, 'error', error);}

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev', 'validate-devserver-scripts'], function() {
    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: './server.js', ext: 'js', watch: ['models/', 'routes/', 'bin/'], env: {NODE_ENV : 'development'} })
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted dev server');
        });

    // start live-reload server
    livereload.listen({ start: true, port: 35729}); // essa é a porta padrão

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexDev()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsDev()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch html partials
    gulp.watch(paths.partials, function() {
        return pipes.builtPartialsDev()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesDev()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch assets
    gulp.watch(paths.assets, function() {
        return pipes.assetsDev()
            .pipe(livereload())
            .on('error', onError);
    });

});


// clean, build, and watch live changes to the prod environment
gulp.task('watch-prod', ['clean-build-app-prod', 'validate-devserver-scripts'], function() {
    // start nodemon to auto-reload the dev server
    plugins.nodemon({ script: './server.js', ext: 'js', watch: ['models/', 'routes/', 'bin/'], env: {NODE_ENV : 'production'} })
        .on('change', ['validate-devserver-scripts'])
        .on('restart', function () {
            console.log('[nodemon] restarted prod server');
        });

    // start live-reload server
    livereload.listen({ start: true, port: 35729}); // essa é a porta padrão

    // watch index
    gulp.watch(paths.index, function() {
        return pipes.builtIndexProd()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch app scripts
    gulp.watch(paths.scripts, function() {
        return pipes.builtAppScriptsProd()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch hhtml partials
    gulp.watch(paths.partials, function() {
        return pipes.builtAppScriptsProd()
            .pipe(livereload())
            .on('error', onError);
    });

    // watch styles
    gulp.watch(paths.styles, function() {
        return pipes.builtStylesProd()
            .pipe(livereload())
            .on('error', onError);
    });

});

// default task builds for prod
gulp.task('default', ['clean-build-app-prod']);
