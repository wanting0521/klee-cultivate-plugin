import { XDataYamlFile } from './XDataYamlFile.js'
import { XDir } from '../../../Dir/XDir.js'
import { XLog } from '../../../Log/XLog.js'
import path from 'path'
import moment from 'moment'
import lodash from 'lodash'

const dir = new XDir()
const log = new XLog()

/** klee模块数据yaml文件 */
class XkleeDataYamlFile extends XDataYamlFile {
    constructor() {
        super()
        this.dataPath = path.join(this.dataPath,'klee')
        dir.mkDirsSync(this.dataPath)
    }

    /**
     * 生成kleeStatus.yaml文件
     */
    initkleeStatusYamlFile() {
        this.initFile(this.getFileAbsPath('kleeStatus'))
        const data = {
            runTime: moment().unix(),
            energy: 100,
            mood: '超级开心',
            workStatus: 'on',
            groupServiceStatus: {},
            timedWork: 'on',
            stopklee: false,
            isFirstUseklee: false,
            version: ''
        }
        this.saveData(data,'kleeStatus')
    }

    /**
     * 获取上次启动机器人时的时间
     * @returns { null,String }
     */
    getRunTime() {
        return this.getSubData('runTime', 'kleeStatus')
    }

    /**
     * 设置上次启动机器人时的时间
     * @param time { String } 时间，格式 YYYY-MM-DD HH:MM:SS
     */
    setRunTime(time) {
        this.saveSubData('runTime',time,'kleeStatus')
    }

    /**
     * 获取机器人能量值
     * @returns { null,Number }
     */
    getEnergy() {
        return this.getSubData('energy','kleeStatus')
    }

    /**
     * 设置机器人能量值
     * @param value { Number } 能量值
     */
    setEnergy(value) {
        this.saveSubData('energy',value,'kleeStatus')
    }

    /**
     * 获取机器人心情
     * @returns { null,String }
     */
    getMood() {
        return this.getSubData('mood','kleeStatus')
    }

    /**
     * 设置机器人心情
     * @param mood { String } 心情
     */
    setMood(mood) {
        this.saveSubData('mood',mood,'kleeStatus')
    }

    /**
     * 获取机器人工作状态
     * @returns { String }
     */
    getWorkStatus() {
        let workStatus = this.getSubData('workStatus','kleeStatus')
        if (!workStatus) {
            log.error(`读取 ${this.getFileAbsPath('kleeStatus')} workStatus 失败`)
            workStatus = 'on'
        }
        if (workStatus !== 'on' && workStatus !== 'off') {
            log.error(`${this.getFileAbsPath('kleeStatus')} workStatus 不可用的值`)
            workStatus = 'on'
        }
        return workStatus
    }

    /**
     * 设置机器人工作状态
     * @param status { String } 机器人工作状态 on-工作 off-休息
     */
    setWorkStatus(status) {
        this.saveSubData('workStatus',status,'kleeStatus')
    }

    /**
     * 获取群代理人
     * @param qq { Number } 群号
     * @return { null,Number[] }
     */
    getAgents(qq) {
        let groupServiceStatus = this.getSubData('groupServiceStatus','kleeStatus')
        if (groupServiceStatus === null) {
            groupServiceStatus = {}
            groupServiceStatus[qq] = {}
            groupServiceStatus[qq]['agent'] = []
            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
            return null
        }
        if (groupServiceStatus[qq] !== undefined) {
            if (groupServiceStatus[qq]['agent'] !== undefined) {
                return groupServiceStatus[qq]['agent']
            } else {
                groupServiceStatus[qq]['agent'] = []
                this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
                return null
            }
        } else {
            groupServiceStatus[qq] = {}
            groupServiceStatus[qq]['agent'] = []
            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
            return null
        }
    }

    /**
     * 添加群代理人
     * @param groupQQ { Number } 群号
     * @param usrQQ { Number } 用户QQ
     */
    addAgent(groupQQ,usrQQ) {
        let groupServiceStatus = this.getSubData('groupServiceStatus','kleeStatus')
        if (groupServiceStatus === null) {
            groupServiceStatus = {}
            groupServiceStatus[groupQQ] = {}
            groupServiceStatus[groupQQ]['agent'] = []
            groupServiceStatus[groupQQ]['agent'].push(usrQQ)
            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
            return
        }
        if (groupServiceStatus[groupQQ] !== undefined) {
            if (groupServiceStatus[groupQQ]['agent'] !== undefined) {
                if (!lodash.isArray(groupServiceStatus[groupQQ]['agent'])) {
                    groupServiceStatus[groupQQ]['agent'] = []
                    groupServiceStatus[groupQQ]['agent'].push(usrQQ)
                    this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
                } else {
                    groupServiceStatus[groupQQ]['agent'].push(usrQQ)
                    this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
                }
            } else {
                groupServiceStatus[groupQQ]['agent'] = []
                groupServiceStatus[groupQQ]['agent'].push(usrQQ)
                this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
            }
        } else {
            groupServiceStatus[groupQQ] = {}
            groupServiceStatus[groupQQ]['agent'] = []
            groupServiceStatus[groupQQ]['agent'].push(usrQQ)
            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
        }
    }

    /**
     * 删除群代理人
     * @param groupQQ { Number } 群号
     * @param usrQQ { Number } 用户QQ
     */
    delAgent(groupQQ,usrQQ) {
        let groupServiceStatus = this.getSubData('groupServiceStatus','kleeStatus')
        if (groupServiceStatus === null) {
            groupServiceStatus = {}
            groupServiceStatus[groupQQ] = {}
            groupServiceStatus[groupQQ]['agent'] = []
            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
            return
        }
        if (groupServiceStatus[groupQQ] !== undefined) {
            if (groupServiceStatus[groupQQ]['agent'] !== undefined) {
                if (!lodash.isArray(groupServiceStatus[groupQQ]['agent'])) {
                    groupServiceStatus[groupQQ]['agent'] = []
                    this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
                } else {
                    for (let i = 0; i < groupServiceStatus[groupQQ]['agent'].length; i++) {
                        if (groupServiceStatus[groupQQ]['agent'][i] === usrQQ) {
                            groupServiceStatus[groupQQ]['agent'].splice(i,1)
                            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
                            return
                        }
                    }
                }
            } else {
                groupServiceStatus[groupQQ]['agent'] = []
                this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
            }
        } else {
            groupServiceStatus[groupQQ] = {}
            groupServiceStatus[groupQQ]['agent'] = []
            this.saveSubData('groupServiceStatus',groupServiceStatus,'kleeStatus')
        }
    }

    /**
     * 获取机器人对指定群的某个服务状态
     * @param qq { Number } 群号
     * @param pluginName { String } 插件名
     * @param modelName { String } 模块名
     * @param serviceName { String } 服务名
     * @returns { 'on','off','notAll' }
     */
    getGroupServiceStatus(qq,pluginName,modelName,serviceName) {
        let status = this.getSubData('groupServiceStatus','kleeStatus')
        if (status === null) {
            status = {}
            status[qq] = {}
            status[qq]['all'] = 'on'
            this.saveSubData('groupServiceStatus',status,'kleeStatus')
            return 'on'
        }
        if (status[qq] === undefined) {
            if (serviceName === 'all') {
                status[qq] = {}
                status[qq]['all'] = 'on'
                this.saveSubData('groupServiceStatus',status,'kleeStatus')
                return 'on'
            }
            if (pluginName === 'kleePlugin') {
                status[qq] = {}
                status[qq][pluginName] = {}
                status[qq][pluginName][modelName] = {}
                status[qq][pluginName][modelName][serviceName] = 'on'
                this.saveSubData('groupServiceStatus',status,'kleeStatus')
                return 'on'
            }
            status[qq] = {}
            status[qq][pluginName] = {}
            status[qq][pluginName][serviceName] = 'on'
            this.saveSubData('groupServiceStatus',status,'kleeStatus')
            return 'on'
        } else {
            if (serviceName === 'all') {
                if (status[qq]['all'] !== undefined) {
                    return status[qq]['all']
                } else {
                    status[qq]['all'] = 'on'
                    this.saveSubData('groupServiceStatus',status,'kleeStatus')
                    return 'on'
                }
            }
            if (pluginName === 'kleePlugin') {
                if (status[qq][pluginName] !== undefined) {
                    if (status[qq][pluginName][modelName] !== undefined) {
                        if (status[qq][pluginName][modelName][serviceName] !== undefined) {
                            return status[qq][pluginName][modelName][serviceName]
                        } else {
                            status[qq][pluginName][modelName][serviceName] = 'on'
                            this.saveSubData('groupServiceStatus',status,'kleeStatus')
                            return 'on'
                        }
                    } else {
                        status[qq][pluginName][modelName] = {}
                        status[qq][pluginName][modelName][serviceName] = 'on'
                        this.saveSubData('groupServiceStatus',status,'kleeStatus')
                        return 'on'
                    }
                } else {
                    status[qq][pluginName] = {}
                    status[qq][pluginName][modelName] = {}
                    status[qq][pluginName][modelName][serviceName] = 'on'
                    this.saveSubData('groupServiceStatus',status,'kleeStatus')
                    return 'on'
                }
            }
            if (status[qq][pluginName] !== undefined) {
                if (status[qq][pluginName][serviceName] !== undefined) {
                    return status[qq][pluginName][serviceName]
                } else {
                    status[qq][pluginName][serviceName] = 'on'
                    this.saveSubData('groupServiceStatus',status,'kleeStatus')
                    return 'on'
                }
            } else {
                status[qq][pluginName] = {}
                status[qq][pluginName][serviceName] = 'on'
                this.saveSubData('groupServiceStatus',status,'kleeStatus')
                return 'on'
            }
        }
    }

    /**
     * 设置机器人对指定群的某个服务状态
     * @param qq { Number } 群号
     * @param pluginName { String } 插件名
     * @param modelName { String } 模块名
     * @param serviceName { String } 服务名
     * @param status { String } 机器人对指定群的服务状态 on-开启 off-关闭
     */
    setGroupServiceStatus(qq,pluginName,modelName,serviceName,status) {
        let serviceStatus = this.getSubData('groupServiceStatus','kleeStatus')
        if (serviceStatus[qq] === undefined) {
            if (serviceName === 'all') {
                serviceStatus[qq] = {}
                serviceStatus[qq]['all'] = status
                this.saveSubData('groupServiceStatus',serviceStatus,'kleeStatus')
                return
            }
            if (pluginName === 'kleePlugin') {
                serviceStatus[qq] = {}
                serviceStatus[qq][pluginName] = {}
                serviceStatus[qq][pluginName][modelName] = {}
                serviceStatus[qq][pluginName][modelName][serviceName] = status
                this.saveSubData('groupServiceStatus',serviceStatus,'kleeStatus')
                return
            }
            serviceStatus[qq] = {}
            serviceStatus[qq][pluginName] = {}
            serviceStatus[qq][pluginName][serviceName] = status
            this.saveSubData('groupServiceStatus',serviceStatus,'kleeStatus')
        } else {
            if (serviceName === 'all') {
                serviceStatus[qq]['all'] = status
                this.saveSubData('groupServiceStatus',serviceStatus,'kleeStatus')
                return
            }
            if (pluginName === 'kleePlugin') {
                if (serviceStatus[qq][pluginName] !== undefined) {
                    if (serviceStatus[qq][pluginName][modelName] !== undefined) {
                        serviceStatus[qq][pluginName][modelName][serviceName] = status
                    } else {
                        serviceStatus[qq][pluginName][modelName] = {}
                        serviceStatus[qq][pluginName][modelName][serviceName] = status
                    }
                } else {
                    serviceStatus[qq][pluginName] = {}
                    serviceStatus[qq][pluginName][modelName] = {}
                    serviceStatus[qq][pluginName][modelName][serviceName] = status
                }
                this.saveSubData('groupServiceStatus',serviceStatus,'kleeStatus')
                return
            }
            if (serviceStatus[qq][pluginName] !== undefined) {
                serviceStatus[qq][pluginName][serviceName] = status
            } else {
                serviceStatus[qq][pluginName] = {}
                serviceStatus[qq][pluginName][serviceName] = status
            }
            this.saveSubData('groupServiceStatus',serviceStatus,'kleeStatus')
        }
    }

    /**
     * 获取可莉开启状态
     */
    getStopklee() {
        return this.getSubData('stopklee','kleeStatus')
    }

    /**
     * 设置可莉开启状态
     * @param status { Boolean } 可莉开启状态
     */
    setStopklee(status) {
        this.saveSubData('stopklee',status,'kleeStatus')
    }

    /**
     * 获取可莉定时工作开启状态
     * @return { String }
     */
    getTimedWork() {
        const timedWork = this.getSubData('timedWork','kleeStatus')
        if (!timedWork || (timedWork !== 'on' && timedWork !== 'off')) {
            this.setTimedWork('on')
            return 'on'
        }
        return timedWork
    }

    /**
     * 设置可莉定时工作开启状态
     * @param status { String } 可莉开启状态，on-开启 off-关闭
     */
    setTimedWork(status) {
        this.saveSubData('timedWork',status,'kleeStatus')
    }

    /**
     * 获取版本号
     * @returns { null,String }
     */
    getVersion() {
        return this.getSubData('version','kleeStatus')
    }

    /**
     * 设置版本号
     * @param value { String } 版本号
     */
    setVersion(value) {
        this.saveSubData('version',value,'kleeStatus')
    }

    /**
     * 是否第一次使用kleePlugin
     * @returns { Boolean }
     */
    isFirstUseklee() {
        const data = this.getSubData('isFirstUseklee','kleeStatus')
        if (data === null) {
            return true
        }
        return data
    }

    /**
     * 设置是否第一次使用kleePlugin
     * @param value { Boolean } 是否第一次使用kleePlugin
     */
    setIsFirstUseklee(value) {
        this.saveSubData('isFirstUseklee',value,'kleeStatus')
    }
}

export { XkleeDataYamlFile }