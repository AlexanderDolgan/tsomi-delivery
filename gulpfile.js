// series parallel
const gulp = require('gulp');

const { series, parallel, src, dest, watch } = require('gulp');

// js
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const sourcemaps = require('gulp-sourcemaps');

// html
const pug = require('gulp-pug');

// css
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');

//Minify PNG, JPEG, GIF and SVG images
const	imagemin = require('gulp-imagemin');
// const jpegtran = require('imagemin-jpegtran');
const gifsicle = require('imagemin-gifsicle');
const optipng = require('imagemin-optipng');
const svgo = require('imagemin-svgo');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const newer = require('gulp-newer');

// const spritesmith = ('gulp.spritesmith');

// util
const rename = require('gulp-rename');
const rimraf = require('gulp-rimraf'); //The UNIX command rm -rf for node. - clean
const rigger = require('gulp-rigger')  // concat files /==

// server
const browserSync = require('browser-sync');

//config for the web server
const config = {
	server: {
		baseDir: "./build"
	},
	//tunnel: true,
	host: 'localhost',
	port: 8888,
	logPrefix: "tsomi-delivery"
};

function reload(done) {
  server.reload();
	done();
}

function webserver() {
	browserSync(config);
};

function javaScript(cb) {
	return src('src/js/*.js')
		.pipe(rigger())
		.pipe (sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe (sourcemaps.write('.'))
		.pipe(dest('build/js/'));
}

function css() {
	return src('src/style/main.scss')
		.pipe (sourcemaps.init())
		.pipe (sass().on( 'error', sass.logError ))
		.pipe (postcss([ autoprefixer() ]))
		.pipe (cleanCSS({ compatibility: 'ie8' }))
		.pipe (rename({ suffix: '.min' }))
		.pipe (sourcemaps.write('.'))
		.pipe(dest('build/style/'));
}

function html() {
	return src('src/pug/**/*.pug')
		.pipe(pug({pretty: true}))
		.pipe(dest('build/'))
}

function images() {
	return src('src/img/**/*.*')
		// .pipe(newer('src/img/**/*.*'))
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			// imagemin.jpegtran({progressive: true}),
			imageminJpegRecompress(),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: true},
					{cleanupIDs: false}
				]
			})
		], 
			{
				verbose: true
			}
		))
		.pipe(dest('build/img/'))
}

function fonts() {
	return src('src/fonts/**/*.*')
		.pipe(dest('build/fonts'))
}

function clean() {
	return src('./build')
		.pipe(rimraf());
}

function watcher() {
	watch('src/style/', css).on('change', browserSync.reload);
	
	watch('src/js/', javaScript).on('change', browserSync.reload);

	watch('src/pug/', html).on('change', browserSync.reload);

	watch('src/img/', images).on('change', browserSync.reload);

	watch('src/fonts/**/*.*', fonts).on('change', browserSync.reload);

	webserver();
}


// livereload server sprites plumber gulp-concat gulp-concat

exports.build = series(javaScript, css, html, fonts, watcher);
exports.js = series(javaScript);
exports.images = series(images);

exports.clean = series(clean);
exports.images = series(images);

// if (process.env.Node_ENV === 'production') {
// 	exports.build = parallel(calculateJavaScript, calculateCss);
// } else {
// 	exports.build = parallel(calculateJavaScript, calculateCss);
// }


