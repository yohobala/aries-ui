import path from 'path'
import { dest, parallel, series, src } from 'gulp'
import { ariOutput, run, withTaskName } from '../../build/src'

const distFolder = path.resolve(__dirname, 'dist')
const distBundle = path.resolve(ariOutput, 'type')

/**
 * 处理ts
 */
function copyType() {
  // 从src下单fonts文件夹下的所有文件开始=>压缩=>最终输出到当前目录下dist下的font目录
  return src(path.resolve(__dirname, './src/**'))
    .pipe(dest(path.resolve(distBundle)))
}


export const build = parallel(
  series(withTaskName('clean', () => run('rimraf dist')), copyType)
)

export default build
