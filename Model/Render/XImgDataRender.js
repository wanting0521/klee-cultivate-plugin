import { XRender } from './XRender.js'
import { XkleeDataYamlFile } from '../File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import { XBot } from '../Bot/XBot.js'
import { XHtmlFile } from '../File/HtmlFile/XHtmlFile.js'
import cfg from '../../../../lib/config/config.js'
import path from 'path'

const kleeDataYamlFile = new XkleeDataYamlFile()
const bot = new XBot()
const htmlFile = new XHtmlFile()

/** 提供图片数据类 */
class XImgDataRender extends XRender {
    modelName
    saveId

    /**
     * @param modelName { String } 模块名
     * @param saveId { String } html文件名（不需要后缀）
     */
    constructor(modelName,saveId) {
        super()
        this.modelName = modelName
        this.saveId = saveId
    }

    /**
     * 根据html文件内容生成数据返回
     * @param data html数据，可以不传
     */
    renderImgData(data) {
        let htmlData
        if (arguments.length === 0) {
            htmlData = htmlFile.readFile(path.join(this.kleeRootAbsPath,'Resource/Web',this.modelName,`${this.saveId}.html`))
        } else if (arguments.length === 1) {
            htmlData = data
        } else {
            return null
        }
        return {
            htmlPath: `./plugins/kleePlugin/Resource/Web/${this.modelName}/${this.saveId}.html`,
            resAbsPath: path.join(this.kleeRootAbsPath,'Resource/Web',this.modelName),
            saveId: this.saveId,
            version: cfg.package['version'],
            htmlData,
            kleeVersion: kleeDataYamlFile.getVersion(),
            botName: bot.botName
        }
    }
}

export { XImgDataRender }