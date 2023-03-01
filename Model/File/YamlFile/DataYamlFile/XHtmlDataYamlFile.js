import { XDataYamlFile } from './XDataYamlFile.js'
import { XDir } from '../../../Dir/XDir.js'
import path from 'path'

const dir = new XDir()

/** html数据yaml文件类 */
class XHtmlDataYamlFile extends XDataYamlFile {
    constructor() {
        super()
        this.dataPath = path.join(this.dataPath,'Html')
        dir.mkDirsSync(this.dataPath)
    }
}

export { XHtmlDataYamlFile }