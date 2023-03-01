import path from 'path'
import fs from 'fs'

/** 可莉类（核心类） */
class klee {
    /** klee-cultivate-plugin根目录绝对路径 */
    kleeRootAbsPath
    /** klee-cultivate-plugin版本号 */
    kleePluginVersion

    constructor() {
        this.kleeRootAbsPath = path.join(process.cwd(),'plugins/klee-cultivate-plugin')
        const packageJsonPath = path.join(this.kleeRootAbsPath,'package.json')
        this.kleePluginVersion = JSON.parse(String(fs.readFileSync(packageJsonPath)))['version']
    }
}

export { klee }