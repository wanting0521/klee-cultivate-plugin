import { XFile } from '../XFile.js'
import YAML from 'yaml'

/** yaml文件类 */
class XYamlFile extends XFile {
    constructor() {
        super()
    }

    /**
     * 写入内容到yaml文件
     * @param content 内容
     * @param filePath { String } yaml文件的绝对路径
     */
    writeYamlFile(content, filePath) {
        this.writeFile(YAML.stringify(content), filePath)
    }

    /**
     * 读取yaml文件的内容并解析
     * @param filePath { String } yaml文件的绝对路径
     * @returns { null,any }
     */
    readYamlFile(filePath) {
        let content = this.readFile(filePath)
        if (content === null) {// 读取失败
            return null
        }
        return YAML.parse(content)
    }
}

export { XYamlFile }