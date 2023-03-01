import { XFile } from '../XFile.js'

/** json文件类 */
class XJsonFile extends XFile {
    constructor() {
        super()
    }

    /**
     * 写入内容到json文件
     * @param content 内容
     * @param filePath { String } json文件的绝对路径
     */
    writeJsonFile(content, filePath) {
        this.writeFile(JSON.stringify(content), filePath)
    }

    /**
     * 读取json文件的内容并解析
     * @param filePath { String } json文件的绝对路径
     * @returns { null,any }
     */
    readJsonFile(filePath) {
        let content = this.readFile(filePath)
        if (content === null) {// 读取失败
            return null
        }
        return JSON.parse(content)
    }
}

export { XJsonFile }