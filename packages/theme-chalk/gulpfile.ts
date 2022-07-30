import path from 'path'
import chalk from 'chalk'
import { dest, parallel, series, src } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import rename from 'gulp-rename'
import consola from 'consola'
import { ariOutput } from '../../build/src'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(ariOutput, 'theme-chalk')

/**
 * compile theme-chalk scss & minify
 * not use sass.sync().on('error', sass.logError) to throw exception
 * @returns
 */
function buildThemeChalk() {
  const sass = gulpSass(dartSass)
  const noAriPrefixFile = /(index|base|display)/
  // 从src下的scss文件开始=>编译成css=>添加前缀=>压缩=>最终输出到当前目录下dist下的css目录
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(
      cleanCSS({}, (details) => {
        consola.success(
          `${chalk.cyan(details.name)}: ${chalk.yellow(
            details.stats.originalSize / 1000
          )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
        )
      })
    )
    .pipe(
      rename((path) => {
        if (!noAriPrefixFile.test(path.basename)) {
          path.basename = `ari-${path.basename}`
        }
      })
    )
    .pipe(dest(distFolder))
}

/**
 * 处理font文件
 */
function copyfont() {
  // 从src下单fonts文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的font目录
  return src(path.resolve(__dirname, './src/font/**')).pipe(cleanCSS({}, (details) => {
    consola.success(
      `${chalk.cyan(details.name)}: ${chalk.yellow(
        details.stats.originalSize / 1000
      )} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
    )
  })).pipe(dest(path.resolve(distFolder, 'font')))
}

/**
 * copy from packages/theme-chalk/dist to dist/element-plus/theme-chalk
 */
export function copyThemeChalkBundle() {
  return src(`${distFolder}/**`).pipe(dest(distBundle))
}

/**
 * copy source file to packages
 */

export function copyThemeChalkSource() {
  return src(path.resolve(__dirname, 'src/**')).pipe(
    dest(path.resolve(distBundle, 'src'))
  )
}

export const build = parallel(
  copyThemeChalkSource,
  series(buildThemeChalk, copyfont, copyThemeChalkBundle)
)

export default build
