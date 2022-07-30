import findWorkspacePackages from '@pnpm/find-workspace-packages'
import { projectRoot } from './paths'

import type { ProjectManifest } from '@pnpm/types'
import consola from 'consola'
import { buildConfig, Module } from '../config'
import { PKG_PREFIX } from '../constants'

export const getWorkspacePackages = () => findWorkspacePackages(projectRoot)
export const getWorkspaceNames = async (dir = projectRoot) => {
  const pkgs = await findWorkspacePackages(projectRoot)
  return pkgs
    .filter((pkg) => pkg.dir.startsWith(dir))
    .map((pkg) => pkg.manifest.name)
    .filter((name): name is string => !!name)
}

export const getPackageManifest = (pkgPath: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(pkgPath) as ProjectManifest
}

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist','d.ts']
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  )
}

/** used for type generator */
export const pathRewriter = (module: Module) => {
  const config = buildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, 'element-plus/theme-chalk')
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}