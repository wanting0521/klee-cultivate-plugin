import { klee } from '../klee.js'
import { XDir } from '../Dir/XDir.js'
import fs from 'fs'
import path from 'path'

const dir = new XDir()

/** 文件类 */
class XFile extends klee {
    constructor() {
        super()
    }

    /**
     * 生成空的文件
     * @param filePath { String } 文件的绝对路径
     */
    initFile(filePath) {
        if (fs.existsSync(filePath)) {
            return
        }
        dir.mkDirsSync(path.dirname(filePath))
        fs.writeFileSync(filePath,'','utf8')
    }

    /**
     * 写入内容到文件
     * @param content 内容
     * @param filePath { String } 文件的绝对路径
     */
    writeFile(content, filePath) {
        this.initFile(filePath)
        fs.writeFileSync(filePath,content,'utf8')
    }

    /**
     * 读取文件内容
     * @param filePath { String } 文件的绝对路径
     * @returns { null | String }
     */
    readFile(filePath) {
        if (!fs.existsSync(filePath)) {
            return null
        }
        return fs.readFileSync(filePath,'utf8')
    }
}

export { XFile }