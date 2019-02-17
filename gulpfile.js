//Gulp Packages =============================================
var fs = require('fs-extra');
var app = JSON.parse(fs.readFileSync('./package.json'));

var gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    uglifycss = require('gulp-uglifycss'),
    minifyInline = require('gulp-minify-inline'),
    imagemin = require('gulp-imagemin'),
    injectPartials = require('gulp-inject-partials'),
    htmlclean = require('gulp-htmlclean'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    gm = require('gulp-gm'),
    del = require('del'),
    zip = require('gulp-zip'),
    gutil = require('gulp-util'),
    named = require('vinyl-named');


var paths = {
    src: 'app/src/**/*',
    srcHTML: 'app/src/*.html',
    srcCSS: 'app/src/assets/scss/',
    srcJS: 'app/src/assets/js/',
    srcCNAME: 'app/src/CNAME',
    srcPhp: 'app/src/assets/php/**/*',
    srcImages: 'app/src/assets/img/**/*',
    srcVideos: 'app/src/assets/videos/**/*',
    srcFonts: 'app/src/assets/fonts/**/*',


    tmp: 'app/tmp',
    tmpIndex: 'app/tmp/index.html',
    tmpHTML: 'app/tmp/**/*.html',
    tmpCSS: 'app/tmp/assets/css',
    tmpJS: 'app/tmp/assets/js',
    tmpPhp: 'app/tmp/assets/php',
    tmpImages: 'app/tmp/assets/img',
    tmpVideos: 'app/tmp/assets/videos',
    tmpFonts: 'app/tmp/assets/fonts/',

    dist: 'app/dist',
    distIndex: 'app/dist/index.html',
    distCSS: 'app/dist/assets/css/',
    distJS: 'app/dist/assets/js/',
    distCNAME: 'app/dist/',
    distPhp: 'app/dist/assets/php',
    distImages: 'app/dist/assets/img',
    distVideos: 'app/dist/assets/videos',
    distFonts: 'app/dist/assets/fonts'


};

var bases = {
    app: 'app/src/',
    tmp: 'app/tmp/',
    dist: 'app/dist/',
    demoFolder: app.slug + '-' + app.version + '/'


};

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};



// html task =============================================
gulp.task('views', function () {
    return gulp.src(paths.srcHTML)
        .pipe(injectPartials({
            removeTags: true
        }))
        .pipe(gulp.dest(paths.tmp));
});


gulp.task('views-rebuild', gulp.series('views', function (done) {
    browserSync.reload();
    done();
}));

gulp.task('scripts', function () {

    return gulp.src([paths.srcJS+'app.js',paths.srcJS+'panel.js'])
        .pipe(named())
        .pipe(webpack())
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest(paths.tmpJS));
});

gulp.task('styles', function () {
    return gulp.src([paths.srcCSS+'app.scss',paths.srcCSS+'panel.scss'])
        .pipe(named())
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest((paths.tmpCSS)))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('images', function () {
    return gulp.src(paths.srcImages)
        .pipe(gulp.dest(paths.tmpImages));
});
gulp.task('fonts', function () {
    return gulp.src(paths.srcFonts)
        .pipe(gulp.dest(paths.tmpFonts));
});
gulp.task('php', function () {
    return gulp.src(paths.srcPhp)
        .pipe(gulp.dest(paths.tmpPhp));
});
gulp.task('videos', function () {
    return gulp.src(paths.srcVideos)
        .pipe(gulp.dest(paths.tmpVideos));
});
gulp.task('CNAME', function () {
    return gulp.src([paths.srcCNAME])
        .pipe(gulp.dest(bases.dist));
});

gulp.task('clean:tmp', function () {
    return del(bases.tmp + '**', {force: true});
});

/*---------------------------------------
 Command: gulp
 Description:  build dev version...
 ---------------------------------------- */
gulp.task('default', gulp.series(
    'clean:tmp',
    'styles',
    'scripts',
    'views',
    'images',
    'fonts',
    'CNAME',
    'php',
    'videos'
));


// Rerun the task when a file changes
gulp.task('watch', gulp.series('default', function () {
    browserSync.init({
        server: {
            baseDir: bases.tmp
        }
    });
    gulp.watch('app/src/assets/img/**/*.*', gulp.series('images'));
    // gulp.watch('app/src/assets/fonts/**/*',gulp.series('copy'));
    gulp.watch('app/src/assets/php/**/*', gulp.series('php'));
    gulp.watch('app/src/assets/scss/**/*', gulp.series('styles'));
    gulp.watch('app/src/assets/js/**/*', gulp.series('scripts'));
    gulp.watch('app/src/*/*', gulp.series('views-rebuild'));

    gulp.watch('app/src/*.html').on('change', function (file) {
        return gulp.src(file)
            .pipe(injectPartials({
                removeTags: true,
                ignoreError: true
            }))
            .pipe(gulp.dest(paths.tmp))
            .pipe(browserSync.reload({stream: true}));
    });


}));


/*-----------TASKS TO CREATE PRODUCTION VERSION---------- */



/*---------------------------------------
 Command: gulp html:dist
 Description:  Inject partials then copy to dist
 ---------------------------------------- */
gulp.task('html:dist', gulp.series('views', function () {
    return gulp.src(paths.tmpHTML)
        .pipe(gulp.dest(paths.dist));
}));
gulp.task('html:dist-min', gulp.series('views', function () {
    return gulp.src(paths.tmpHTML)
        .pipe(minifyInline())
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
}));


/*---------------------------------------
 Command: gulp css:dist
 Description: Compiles sass which will create app.css in tmp then copy from temp to dist
 ---------------------------------------- */

gulp.task('css:dist', gulp.series('styles', function () {
    return gulp.src([paths.srcCSS+'app.scss',paths.srcCSS+'panel.scss'])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest(paths.distCSS));
}));
gulp.task('css:dist-min', gulp.series('styles', function () {
    return gulp.src([paths.srcCSS+'app.scss',paths.srcCSS+'panel.scss'])
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest(paths.distCSS));
}));

/*---------------------------------------
 Command: gulp js:dist
 Description: copy js from tmp to dist and compress it
 ---------------------------------------- */

gulp.task('js:dist', gulp.series('scripts', function () {
    return gulp.src(paths.tmpJS + '/**/*')
        .pipe(gulp.dest(paths.distJS));
}));

gulp.task('js:dist-min', gulp.series('scripts', function () {
    return gulp.src(paths.tmpJS + '/**/*')
        .pipe(uglify())
        .pipe(gulp.dest(paths.distJS));
}));
/*---------------------------------------
 Command: gulp php:dist
 Description: copy php to dist
 ---------------------------------------- */

gulp.task('php:dist', gulp.series('php', function () {
    return gulp.src(paths.tmpPhp + '/**/*')
        .pipe(gulp.dest(paths.distPhp));
}));
gulp.task('videos:dist', gulp.series('videos', function () {
    return gulp.src(paths.tmpVideos + '/**/*')
        .pipe(gulp.dest(paths.distVideos));
}));
/*---------------------------------------
 Command: gulp fonts:dist
 Description: copy fonts to dist
 ---------------------------------------- */

gulp.task('fonts:dist', gulp.series('fonts', function () {
    return gulp.src(paths.tmpFonts + '/**/*')
        .pipe(gulp.dest(paths.distFonts));
}));

/*---------------------------------------
 Command: gulp img-compress
 Description: compress images : will only compress images in demo folder
 do not add any other file except png,jpg,jpeg
 ---------------------------------------- */

gulp.task('img-compress', gulp.series('images', function () {
    return gulp.src(paths.distImages + '/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImages));
}));

gulp.task('previews-resize', function () {
    return gulp.src('app/src/assets/img/previews/**/*')
        .pipe(gm(function (gmfile) {
            return gmfile.resize(470);
        }, {
            imageMagick: true
        }))
        .pipe(gulp.dest(paths.distImages + '/previews'));
});

/*---------------------------------------
 Command: gulp images:dist
 Description: copy images to destination
 ---------------------------------------- */

gulp.task('images:dist', gulp.series('images', function () {
    return gulp.src(paths.srcImages)
        .pipe(gulp.dest(paths.distImages))
}));

/*---------------------------------------
 Command: gulp placeholder
 Description: Will change images to blur placeholders in dist/assets/img/demo
 ---------------------------------------- */

gulp.task('placeholder', gulp.series(['images'], function () {
    return gulp.src(paths.distImages + '/demo/**/*')
        .pipe(gm(function (gmfile) {
            return gmfile.blur(100, 100);
        }, {
            imageMagick: true
        }))
        .pipe(gulp.dest(paths.distImages + '/demo/'));

}));


/*---------------------------------------
 Command: gulp copy:dist
 Description: Copy to destination folder
 ---------------------------------------- */
gulp.task('clean:dist', function () {
    return del(bases.dist + '**/*', {force: true});
});



/*---------------------------------------
 Command: gulp production
 Description: Create production version
 ---------------------------------------- */



gulp.task('production', gulp.series(
    'clean:dist',
    'html:dist',
    'css:dist',
    'js:dist',
    'fonts:dist',
    'CNAME',
    'php:dist',
    'images:dist',
    'videos:dist'
));


/*---------------------------------------
 Command: gulp production-min
 Description: Create production version
 ---------------------------------------- */


gulp.task('production-min', gulp.series(
    'clean:dist',
    'html:dist-min',
    'css:dist-min',
    'js:dist-min',
    'fonts:dist',
    'php:dist',
    'CNAME',
    'images:dist',
    'videos:dist'
));



function cb (err,data) {
    if (err) {
        return console.log(err);
    }
}
