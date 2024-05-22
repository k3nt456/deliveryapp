import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

// CSS y SASS
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';
// Dependencias de imágenes.
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

function css( done ) {
  // Compilar SASS.
  // Pasos: 1.- Identificar archivo. 2.- Compilarlo. 3.- Guardarlo.
  src('src/scss/app.scss')
      .pipe( sourcemaps.init() )//Inicia el sourcemaps.
      .pipe( sass( {outputStyle:'expanded'}) )
      .pipe( postcss([ autoprefixer(), cssnano() ]) )
      .pipe( sourcemaps.write('.') ) // Guarda el sourcemaps.
      .pipe( dest('build/css') )

  done();
}

function imagenes() {
  return src('src/img/**/*')
      .pipe( imagemin({ optimizationLevel: 3 }) )
      .pipe( dest('build/img') )
}

function versionWebp() {
  const opciones = {
      quality: 50
  }
  return src('src/img/**/*.{png,jpg}')
      .pipe( webp( opciones ) )
      .pipe( dest('build/img') )
}

function versionAvif() {
  const opciones = {
      quality: 50
  }
  return src('src/img/**/*.{png,jpg}')
      .pipe( avif( opciones ) )
      .pipe( dest('build/img'))
}

function dev() {
  watch( 'src/scss/**/*.scss', css );
  watch( 'src/img/**/*', imagenes );
}

export {
  css as css,
  dev as dev,
  imagenes as imagenes,
  versionWebp as versionWebp,
  versionAvif as versionAvif
}

export default series(imagenes, versionWebp, versionAvif, css, dev);

// series - Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo
