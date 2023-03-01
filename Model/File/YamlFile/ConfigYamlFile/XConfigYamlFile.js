import { XYamlFile } from '../XYamlFile.js'
import { XDir } from '../../../Dir/XDir.js'
import { XObject } from '../../../Object/XObject.js'
import path from 'path'
import fs from 'fs'

const dir = new XDir()
const object = new XObject()

/** 配置yaml文件类 */
class XConfigYamlFile extends XYamlFile {
    /** 默认配置yaml文件所在目录的绝对路径 */
    defCfgPath
    /** 用户配置yaml文件所在目录的绝对路径 */
    usrCfgPath
    /** 备份的用户配置yaml文件所在目录的绝对路径 */
    bakCfgPath
    /** 模块目录名 */
    modelName
    /** 所有默认配置yaml文件所在根目录的绝对路径 */
    defCfgRootPath
    /** 所有用户配置yaml文件所在根目录的绝对路径 */
    usrCfgRootPath
    /** 所有备份配置yaml文件所在根目录的绝对路径 */
    bakCfgRootPath

    /**
     * @param name { String } 模块目录名
     */
    constructor(name) {
        super()
        this.modelName = name
        this.defCfgRootPath = path.join(this.kleeRootAbsPath,'Config/DefaultConfig')
        this.usrCfgRootPath = path.join(this.kleeRootAbsPath,'Config/UserConfig')
        this.bakCfgRootPath = path.join(this.kleeRootAbsPath,'Config/BackupConfig')
        this.defCfgPath = path.join(this.defCfgRootPath,name)
        this.usrCfgPath = path.join(this.usrCfgRootPath,name)
        this.bakCfgPath = path.join(this.bakCfgRootPath,name)
        if (this.modelName !== 'App') {
            dir.mkDirsSync(this.usrCfgPath)
            dir.mkDirsSync(this.bakCfgPath)
        }
    }

    /**
     * 更新模块目录下的用户配置yaml文件
     * @param name { String } 模块名
     */
    updateUsrCfg(name) {
        if (name === 'App') {
            return
        }
        const usrCfgPath = path.join(this.usrCfgRootPath,name)
        const bakCfgPath = path.join(this.bakCfgRootPath,name)
        const files = fs.readdirSync(bakCfgPath).filter(file => {
            return file.endsWith('.yaml')
        })
        for (let file of files) {
            let bakConfig = this.readYamlFile(path.join(bakCfgPath,file))
            let usrConfig = this.readYamlFile(path.join(usrCfgPath,file))
            object.mergeObject(usrConfig,bakConfig)
            this.writeYamlFile(usrConfig,path.join(usrCfgPath,file))
        }
    }

    /**
     * 将模块目录下的默认配置yaml文件复制一份到用户配置yaml文件
     * @param modelName { String } 模块名
     */
    initUsrCfg(modelName) {
        if (modelName === 'App') {
            return
        }
        const defCfgPath = path.join(this.defCfgRootPath,modelName)
        const usrCfgPath = path.join(this.usrCfgRootPath,modelName)
        dir.mkDirsSync(usrCfgPath)
        const files = fs.readdirSync(defCfgPath).filter(file => {
            return file.endsWith('.yaml')
        })
        for (let file of files) {
            fs.copyFileSync(path.join(defCfgPath,file), path.join(usrCfgPath,file))
        }
    }

    /**
     * 将模块目录下的用户配置yaml文件备份到备份的用户配置yaml文件
     * @param modelName { String } 模块名
     */
    backupUsrCfg(modelName) {
        if (modelName === 'App') {
            return
        }
        const usrCfgPath = path.join(this.usrCfgRootPath,modelName)
        const bakCfgPath = path.join(this.bakCfgRootPath,modelName)
        dir.mkDirsSync(usrCfgPath)
        dir.mkDirsSync(bakCfgPath)
        const files = fs.readdirSync(usrCfgPath).filter(file => {
            return file.endsWith('.yaml')
        })
        for (let file of files) {
            fs.copyFileSync(path.join(usrCfgPath,file), path.join(bakCfgPath,file))
        }
    }

    /**
     * 更新所有模块目录下的用户配置yaml文件
     */
    updateAllUsrCfg() {
        const modelNames = fs.readdirSync(this.defCfgRootPath)
        for (let i of modelNames) {
            this.updateUsrCfg(i)
        }
    }

    /**
     * 将所有默认配置yaml文件复制一份到用户配置yaml文件
     */
    initAllUsrCfg() {
        const modelNames = fs.readdirSync(this.defCfgRootPath)
        for (let i of modelNames) {
            this.initUsrCfg(i)
        }
    }

    /**
     * 将所有用户配置yaml文件备份一份到备份的用户配置yaml文件
     */
    backupAllUsrCfg() {
        const modelNames = fs.readdirSync(this.defCfgRootPath)
        for (let i of modelNames) {
            this.backupUsrCfg(i)
        }
    }

    /**
     * 根据配置yaml文件的类型获取配置yaml文件的绝对路径
     * @param name { String } 配置文件名（不带后缀）
     * @param type { String } 配置文件类型 usr-用户配置 def-默认配置 bak-备份的用户配置
     * @returns { null,String }
     */
    getFilePath(name,type) {
        switch (type){
            case 'usr':
                return path.join(this.usrCfgPath,`${name}.yaml`)
            case 'def':
                return path.join(this.defCfgPath,`${name}.yaml`)
            case 'bak':
                return path.join(this.bakCfgPath,`${name}.yaml`)
            default:
                return null
        }
    }

    /**
     * 获取用户配置yaml文件的绝对路径
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,String }
     */
    getUsrFilePath(name) {
        return this.getFilePath(name,'usr')
    }

    /**
     * 获取默认配置yaml文件的绝对路径
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,String }
     */
    getDefFilePath(name) {
        return this.getFilePath(name,'def')
    }

    /**
     * 获取备份配置yaml文件的绝对路径
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,String }
     */
    getBakFilePath(name) {
        return this.getFilePath(name,'bak')
    }

    /**
     * 读取配置yaml文件
     * @param type { String } 配置文件类型 usr-用户配置 def-默认配置 bak-备份的用户配置
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,any }
     */
    getConfig(name, type) {
        return this.readYamlFile(this.getFilePath(name, type))
    }

    /**
     * 保存配置yaml文件
     * @param config 配置
     * @param type { String } 配置文件类型 usr-用户配置 def-默认配置 bak-备份的用户配置
     * @param name { String } 配置文件名（不带后缀）
     */
    setConfig(config, name, type) {
        if (type === 'def') {
            return
        }
        this.writeYamlFile(config,this.getFilePath(name,type))
    }

    /**
     * 读取用户配置yaml文件
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,any }
     */
    getUsrConfig(name) {
        return this.getConfig(name, 'usr')
    }

    /**
     * 保存用户配置yaml文件
     * @param config 配置
     * @param name { String } 配置文件名（不带后缀）
     */
    setUsrConfig(config,name) {
        this.setConfig(config,name, 'usr')
    }

    /**
     * 读取备份的用户配置yaml文件
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,any }
     */
    getBakConfig(name) {
        return this.getConfig(name, 'bak')
    }

    /**
     * 读取默认配置yaml文件
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,any }
     */
    getDefConfig(name) {
        return this.getConfig(name, 'def')
    }

    /**
     * 获取子配置
     * @param key { String } 键
     * @param name { String } 配置文件名（不带后缀）
     * @param type { String } 配置文件类型 usr-用户配置 def-默认配置 bak-备份的用户配置
     * @returns { null,any }
     */
    getSubConfig(key,name,type) {
        const config = this.getConfig(name,type)
        if (config === null) {
            return null
        }
        if (config[key]) {
            return config[key]
        }
        return null
    }

    /**
     * 保存子配置
     * @param key { String } 键
     * @param value 值
     * @param name { String } 配置文件名（不带后缀）
     * @param type { String } 配置文件类型 usr-用户配置 def-默认配置 bak-备份的用户配置
     */
    setSubConfig(key, value, name, type) {
        if (type === 'def') {
            return
        }
        let config = this.getConfig(name,type)
        if (config === null) {
            config = {}
        }
        config[key] = value
        this.setConfig(config,name,type)
    }

    /**
     * 获取用户子配置
     * @param key { String } 键
     * @param name { String } 配置文件名（不带后缀）
     * @returns { null,any }
     */
    getUsrSubConfig(key,name) {
        const config = this.getConfig(name,'usr')
        if (config === null) {
            return null
        }
        if (config[key]) {
            return config[key]
        }
        return null
    }

    /**
     * 保存用户子配置
     * @param key { String } 键
     * @param value 值
     * @param name { String } 配置文件名（不带后缀）
     */
    setUsrSubConfig(key,value,name) {
        let config = this.getConfig(name,'usr')
        if (config === null) {
            config = {}
        }
        config[key] = value
        this.setConfig(config,name,'usr')
    }
}

export { XConfigYamlFile }