import path from 'path'
import { parallel, series } from 'gulp'
import { copyFile, mkdir } from 'fs/promises'
import { withTaskName, run, ariOutput, runTask, ariPackage, ariRoot } from "./src"


export const copyFullStyle = async () => {
  await mkdir(path.resolve(ariOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(ariOutput, 'theme-chalk/index.css'),
    path.resolve(ariOutput, 'dist/index.css')
  )
}

export const cpoyPackage = async () => {
  await copyFile(
    path.resolve(ariPackage),
    path.resolve(ariOutput, 'package.json')
  )
  await copyFile(
    path.resolve(ariRoot,'README.md'),
    path.resolve(ariOutput, 'README.md')
  )
  await copyFile(
    path.resolve(ariRoot,'CHANGELOG.zh-CN.md'),
    path.resolve(ariOutput, 'CHANGELOG.zh-CN.md')
  )
  await copyFile(
    path.resolve(ariRoot,'LICENSE'),
    path.resolve(ariOutput, 'LICENSE')
  )
}


//series 串行(按顺序执行)
export default series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(ariOutput, { recursive: true })),

  parallel(
    runTask('buildModules'),
    // runTask('buildFullBundle'),
    // runTask('generateTypesDefinitions'),
    // runTask('buildHelper'),
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      copyFullStyle,
      withTaskName('buildType', () =>
        run('pnpm run -C packages/type build')
      ),
      withTaskName('patchVersion', () =>
        run('pnpm version -C packages/init patch')
      ),
      cpoyPackage
    )
  ),
)

export * from './src'