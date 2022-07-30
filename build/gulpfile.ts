import path from 'path'
import { parallel, series } from 'gulp'
import { copyFile, mkdir } from 'fs/promises'
import { withTaskName, run, ariOutput, runTask, ariPackage } from "./src"


export const copyFullStyle = async () => {
  await mkdir(path.resolve(ariOutput, 'dist'), { recursive: true })
  await copyFile(
    path.resolve(ariOutput, 'theme-chalk/index.css'),
    path.resolve(ariOutput, 'dist/index.css')
  )
}

export const cpoyPackage = async () => {
  withTaskName('patchVersion', () =>
    run('pnpm version -C packages/init patch')
  )
  await copyFile(
    path.resolve(ariPackage),
    path.resolve(ariOutput, 'package.json')
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
      cpoyPackage
    )
  ),
)

export * from './src'