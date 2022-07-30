import consola from 'consola'
import type { OutputOptions, RollupBuild } from 'rollup'
import { ariPackage } from './paths'
import { getPackageDependencies } from './pkg'

export const generateExternal = async (options: { full: boolean }) => {
  const { dependencies, peerDependencies } = getPackageDependencies(ariPackage)
  return (id: string) => {
    const packages: string[] = peerDependencies
    if (!options.full) {
      packages.push('@vue', ...dependencies)
    }
    return [...new Set(packages)].some(
      (pkg) => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map((option) => bundle.write(option)))
}

export function formatBundleFilename(
  name: string,
  minify: boolean,
  ext: string
) {
  return `${name}${minify ? '.min' : ''}.${ext}`
}
