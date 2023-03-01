import { XYamlFile } from '../XYamlFile.js'
import { XDir } from '../../../Dir/XDir.js'
import path from 'path'

const dir = new XDir()

/** 数据yaml文件类 */
class XDataYamlFile extends XYamlFile {
    /** 数据yaml文件所在的目录的绝对路径 */
    dataPath

    constructor() {
        super()
        this.dataPath = path.join(this.kleeRootAbsPath,'Data')
        dir.mkDirsSync(this.dataPath)
    }

    /**
     * 获取文件的绝对路径
     * @param name { String } 文件名（不需要加后缀）
     * @return { String }
     */
    getFileAbsPath(name) {
        return path.join(this.dataPath,`${name}.yaml`)
    }

    /**
     * 保存数据到yaml文件
     * @param data 数据
     * @param name { String } 文件名（不需要加后缀）
     */
    saveData(data, name) {
        this.writeYamlFile(data,this.getFileAbsPath(name))
    }

    /**
     * 从yaml文件读取数据
     * @param name { String } 文件名（不需要加后缀）
     * @returns { null,any }
     */
    getData(name) {
        return this.readYamlFile(this.getFileAbsPath(name))
    }

    /**
     * 获取子数据
     * @param key { String } 键
     * @param name { String } 文件名（不需要加后缀）
     * @returns { null,any }
     */
    getSubData(key, name) {
        let data = this.getData(name)
        if (data === null) {
            return null
        }
        if (data[key] !== undefined) {
            return data[key]
        }
        return null
    }

    /**
     * 保存子数据
     * @param key { String } 键
     * @param value 值
     * @param name { String } 文件名（不需要加后缀）
     */
    saveSubData(key,value,name) {
        let data = this.getData(name)
        if (data === null) {
            data = {}
        }
        data[key] = value
        this.saveData(data,name)
    }
}

export { XDataYamlFile }