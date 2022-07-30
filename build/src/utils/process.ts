import { projectRoot } from "./paths";
import consola from 'consola'
import chalk from 'chalk'
import { spawn } from 'child_process'


// 在node中开启一个子进程来运行脚本
export const run = async (command: string, cwd: string = projectRoot) =>
    new Promise<void>((resolve, reject) => {
        // 将命令分割 例如：rm -rf 分割为['rm', '-rf'],进行解构[cmd,...args]
        const [cmd, ...args] = command.split(' ')
        consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`)
        const app = spawn(cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32',// 默认情况下 linux才支持 rm -rf  windows安装git bash
        })

        const onProcessExit = () => app.kill('SIGHUP')
        
        // 在进程已结束并且子进程的标准输入输出流已关闭之后，则触发 'close' 事件
        app.on('close', (code) => {
            process.removeListener('exit', onProcessExit)

            if (code === 0) resolve()
            else
                reject(
                    new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
                )
        })
        process.on('exit', onProcessExit)
    })