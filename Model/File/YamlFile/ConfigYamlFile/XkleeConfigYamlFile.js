import { XConfigYamlFile } from './XConfigYamlFile.js'
import { XLog } from '../../../Log/XLog.js'

const log = new XLog()

/** klee模块配置yaml文件类 */
class XkleeConfigYamlFile extends XConfigYamlFile {
    constructor() {
        super('klee')
    }

    /**
     * 获取默认BasicConfig.yaml数据
     * @return { null,any }
     */
    getDefBasicConfigYamlFileData() {
        return this.getDefConfig('BasicConfig')
    }

    /**
     * 获取用户BasicConfig.yaml数据
     * @return { null,any }
     */
    getUsrBasicConfigYamlFileData() {
        return this.getUsrConfig('BasicConfig')
    }

    /**
     * 获取用户配置的机器人名
     * @return { String }
     */
    getUsrBotName() {
        const data = this.getUsrBasicConfigYamlFileData()
        if (!data) {
            return '可莉'
        }
        if (data['botName']) {
            return data['botName']
        }
        return '可莉'
    }

    /**
     * 用户设置机器人名字
     * @param name { String } 机器人名字
     */
    setUsrBotName(name) {
        let data = this.getUsrBasicConfigYamlFileData()
        const fileName = 'BasicConfig'
        if (!data) {
            log.error(`获取文件 ${this.getUsrFilePath(fileName)} 配置失败，可能文件不存在，可尝试将 ${this.getDefFilePath(fileName)} 复制到此处`)
            return false
        }
        this.setUsrSubConfig('botName',name,fileName)
        return true
    }

    /**
     * 获取用户配置的雪宝的别名
     * @return { null,String }
     */
    getUsrXueBaoName() {
        const data = this.getUsrBasicConfigYamlFileData()
        if (data === null) {
            return null
        }
        if (data['XueBaoName']) {
            return data['XueBaoName']
        }
        return null
    }
}

export { XkleeConfigYamlFile }