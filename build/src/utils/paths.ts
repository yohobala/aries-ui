import { resolve } from 'path'

export const projectRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projectRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const themeRoot = resolve(pkgRoot, 'theme-chalk')
export const hookRoot = resolve(pkgRoot, 'hooks')
export const localeRoot = resolve(pkgRoot, 'locale')
export const directiveRoot = resolve(pkgRoot, 'directives')
export const ariRoot = resolve(pkgRoot, 'aries-ui')
export const utilRoot = resolve(pkgRoot, 'utils')
export const buildRoot = resolve(projectRoot, 'build')

// Docs
export const docsDirName = 'docs'
export const docRoot = resolve(projectRoot, docsDirName)
export const vpRoot = resolve(docRoot, '.vitepress')

/** `/dist` */
export const buildOutput = resolve(projectRoot, 'dist')
/** `/dist/aries-ui` */
export const ariOutput = resolve(buildOutput, 'aries-ui')

export const projPackage = resolve(projectRoot, 'package.json')
export const compPackage = resolve(compRoot, 'package.json')
export const themePackage = resolve(themeRoot, 'package.json')
export const hookPackage = resolve(hookRoot, 'package.json')
export const localePackage = resolve(localeRoot, 'package.json')
export const directivePackage = resolve(directiveRoot, 'package.json')
export const ariPackage = resolve(ariRoot, 'package.json')
export const utilPackage = resolve(utilRoot, 'package.json')
export const docPackage = resolve(docRoot, 'package.json')
