import { XConfigYamlFile } from './XConfigYamlFile.js'
import { XObject } from '../../../Object/XObject.js'
import path from 'path'
import fs from 'fs'

const object = new XObject()

/** 功能配置yaml文件类 */
class XAppConfigYamlFile extends XConfigYamlFile {
    constructor() {
        super('App')
    }

    /**
     * 读取默认AppConfig.yaml文件中的配置
     * @returns { null,any }
     */
    getDefAppConfigYaml() {
        return this.getDefConfig('AppConfig')
    }

    /**
     * 将默认AppConfig.yaml分模块在每个功能模块目录下生成一个AppConfig.yaml文件
     */
    initUsrAppConfigYamlFile() {
        const models = this.getDefAppConfigYaml()
        if (models === null) {
            return
        }
        for (const modelsKey in models) {
            if (models.hasOwnProperty(modelsKey)) {
                const config = models[modelsKey]
                this.writeYamlFile(config,path.join(this.kleeRootAbsPath,'App',modelsKey,'AppConfig.yaml'))
            }
        }
    }

    /**
     * 将各模块目录下的AppConfig.yaml备份到同目录下BackupAppConfig.yaml文件
     */
    backupUsrAppConfigYaml() {
        const modelNames = fs.readdirSync(path.join(this.kleeRootAbsPath,'App'))
        for (const modelName of modelNames) {
            if (fs.existsSync(path.join(this.kleeRootAbsPath,'App',modelName,'AppConfig.yaml'))) {
                fs.copyFileSync(path.join(this.kleeRootAbsPath,'App',modelName,'AppConfig.yaml'),path.join(this.kleeRootAbsPath,'App',modelName,'BackupAppConfig.yaml'))
            }
        }
    }

    /**
     * 更新各模块目录下的AppConfig.yaml文件
     */
    updateUsrAppConfigYaml() {
        const modelNames = fs.readdirSync(path.join(this.kleeRootAbsPath,'App'))
        for (const modelName of modelNames) {
            if (modelName === 'Expand') {
                continue
            }
            let appConfig = this.getUsrAppConfigYaml(modelName)
            let bakAppConfig = this.getUsrBackupAppConfigYaml(modelName)
            object.mergeObject(appConfig,bakAppConfig)
            this.setUsrAppConfigYaml(modelName,appConfig)
        }
    }

    /**
     * 获取默认指定的模块的所有功能配置
     * @param name { String } 模块名
     * @returns { null,any }
     */
    getDefModelAppConfig(name) {
        const config = this.getDefAppConfigYaml()
        if (config === null) {
            return null
        }
        if (config[name]) {
            return config[name]
        }
        return null
    }

    /**
     * 读取用户AppConfig.yaml文件中的配置
     * @param name { String } 模块名
     * @returns { null,any }
     */
    getUsrAppConfigYaml(name) {
        return this.readYamlFile(path.join(this.kleeRootAbsPath,'App',name,'AppConfig.yaml'))
    }

    /**
     * 保存用户AppConfig.yaml文件中的配置
     * @param name { String } 模块名
     * @param config 配置
     * @returns { null,any }
     */
    setUsrAppConfigYaml(name,config) {
        this.writeYamlFile(config,path.join(this.kleeRootAbsPath,'App',name,'AppConfig.yaml'))
    }

    /**
     * 读取用户BackupAppConfig.yaml文件中的配置
     * @param name { String } 模块名
     * @returns { null,any }
     */
    getUsrBackupAppConfigYaml(name) {
        return this.readYamlFile(path.join(this.kleeRootAbsPath,'App',name,'BackupAppConfig.yaml'))
    }

    /**
     * 获取用户配置的指定模块的指定功能的配置
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @returns { null,any }
     */
    getUsrAppConfig(modelName,appName) {
        const config = this.getUsrAppConfigYaml(modelName)
        if (config === null) {
            return null
        }
        if (config[appName]) {
            return config[appName]
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的优先级
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @returns { null,Number }
     */
    getUsrAppPriority(modelName,appName) {
        const config = this.getUsrAppConfig(modelName,appName)
        if (config === null) {
            return null
        }
        const priority = config['priority']
        if (!priority || isNaN(Number(priority)) || !Number.isInteger(Number(priority))) {
            return null
        }
        return priority
    }

    /**
     * 获取用户配置的指定模块的指定功能的所有指令
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @returns { null,any }
     */
    getUsrAppRule(modelName,appName) {
        const config = this.getUsrAppConfig(modelName,appName)
        if (config === null) {
            return null
        }
        const rule = config['rule']
        if (rule) {
            return rule
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的所有指令的执行的方法名
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @returns { null,String[] }
     */
    getUsrAppFncNames(modelName,appName) {
        const rule = this.getUsrAppRule(modelName,appName)
        if (rule === null) {
            return null
        }
        return Object.keys(rule)
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定指令的配置
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,any }
     */
    getUsrAppRuleConfig(modelName,appName,fncName) {
        const rule = this.getUsrAppRule(modelName,appName)
        if (rule === null) {
            return null
        }
        if (rule[fncName]) {
            return rule[fncName]
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法的指令
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,String }
     */
    getUsrAppReg(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const reg = config['reg']
        if (reg || reg === '') {
            return reg
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法的指令关键词
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,String }
     */
    getUsrAppRegKey(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const regKey = config['regKey']
        if (regKey || regKey === '') {
            return regKey
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法的指令描述
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,String }
     */
    getUsrAppDsc(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const dsc = config['dsc']
        if (dsc || dsc === '') {
            return dsc
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法需要的聊天类型
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,String }
     */
    getUsrAppChatType(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const chatType = config['chatType']
        if (chatType) {
            return chatType
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法控制台是否输出日志
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { Boolean }
     */
    getUsrAppIsShowLog(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return true
        }
        return !!config['isShowLog']
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法的执行事件
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,String }
     */
    getUsrAppEvent(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const event = config['event']
        if (event) {
            return event
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法需要的用户权限
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,String }
     */
    getUsrAppPermission(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const permission = config['permission']
        if (permission) {
            return permission
        }
        return null
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法需要的可莉权限等级
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,Number }
     */
    getUsrAppkleePermissionLevel(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const permissionLevel = config['permissionLevel']
        if ((!permissionLevel && Number(permissionLevel) !==0) || isNaN(Number(permissionLevel)) || !Number.isInteger(Number(permissionLevel)) || Number(permissionLevel) < 0) {
            return null
        }
        return permissionLevel
    }

    /**
     * 获取用户配置的指定模块的指定功能的指定执行方法需要的可莉好感度
     * @param modelName { String } 模块名
     * @param appName { String } 功能名
     * @param fncName { String } 方法名
     * @returns { null,Number }
     */
    getUsrAppkleeFavorabilityLevel(modelName,appName,fncName) {
        const config = this.getUsrAppRuleConfig(modelName,appName,fncName)
        if (config === null) {
            return null
        }
        const favorability = config['favorability']
        if ((!favorability && Number(favorability) !== 0) || isNaN(favorability) || !Number.isInteger(favorability)) {
            return null
        }
        return favorability
    }
}

export { XAppConfigYamlFile }