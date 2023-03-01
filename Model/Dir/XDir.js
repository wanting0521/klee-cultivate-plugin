import { klee } from '../klee.js'
import fs from 'fs'
import path from 'path'

/** 目录类 */
class XDir extends klee {
    constructor() {
        super()
    }

    /**
     * 从目录绝对路径中获取根目录
     * @param dirPath { String } 目录绝对路径
     * @return { String }
     */
    getRootPath(dirPath) {
        do {
            dirPath = path.dirname(dirPath)
        } while (dirPath !== path.dirname(dirPath))
        return dirPath
    }

    /**
     * 同步递归创建目录
     * @param dirPath { String } 目录绝对路径
     * @return { Boolean }
     */
    mkDirsSync(dirPath) {
        if (!fs.existsSync(this.getRootPath(dirPath))) {
            return false
        }
        if (fs.existsSync(dirPath)) {
            return true
        }
        if (this.mkDirsSync(path.dirname(dirPath))) {
            fs.mkdirSync(dirPath)
            return true
        }
    }
}

export { XDir }