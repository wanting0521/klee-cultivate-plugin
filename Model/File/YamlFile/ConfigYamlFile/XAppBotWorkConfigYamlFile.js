import { XConfigYamlFile } from './XConfigYamlFile.js'
import { XLog } from '../../../Log/XLog.js'
import { XTime } from '../../../Time/XTime.js'
import { XBot } from '../../../Bot/XBot.js'
import { XkleeDataYamlFile } from '../DataYamlFile/XkleeDataYamlFile.js'
import schedule from 'node-schedule'
import { segment } from 'oicq'
import path from 'path'

const log = new XLog()
const time = new XTime()
const bot = new XBot()
const kleeDataYamlFile = new XkleeDataYamlFile()

/** App/Bot/Work配置yaml文件类 */
class XAppBotWorkConfigYamlFile extends XConfigYamlFile {
    constructor() {
        super('AppBotWork')
    }
// 定时开始工作函数
    scheduleStartWork
// 定时关闭工作函数
    scheduleEndWork
    /**
     * 获取用户配置的指定群的代理人
     * @param groupQQ { Number } 群号
     * @returns { null,Number[] }
     */
    getUsrGroupAgents(groupQQ) {
        const config = this.getUsrSubConfig('agent','Config')
        if (!config) {
            return null
        }
        for (const configKey in config) {
            if (config.hasOwnProperty(configKey) && Number(configKey) === groupQQ) {
                return config[configKey]
            }
        }
        return null
    }

   /**
    * 创建每日工作任务
    * @param type { String } start 开始工作 end 结束工作
    * @returns { null,{type: String,hour: Number,minute: Number,second: Number} }
    */
    mkWorkTask(type) {
        const config = this.getUsrSubConfig(type,'Config')
        if (!config) {
            log.error(`读取 ${this.getUsrFilePath('Config')} 配置 ${type} 失败！`)
            return null
        }
        if (!config['time']) {
            log.error(`读取 ${this.getUsrFilePath('Config')} 配置 ${type}.time 失败！`)
            return null
        }
        const times = time.getTimeObject(config['time'])
        if (!times) {
            log.error(`${this.getUsrFilePath('Config')} ${type}.time 配置出错！`)
            return null
        }
        const hour = times.hour
        let minute = times.minute
        let second = times.second
        let cron = `${second} ${minute} ${hour} * * ?`
        let text
        if (!config['text']) {
            log.error(`读取 ${this.getUsrFilePath('Config')} 配置 ${type}.text 失败！`)
            text = '一年之计在于春，一日之计在于晨，可莉开始工作啦，各位早安~'
        } else {
            text = config['text']
        }
        text = text.replace('可莉',bot.botName)
        if (!config['img']) {
            log.error(`读取 ${this.getUsrFilePath('Config')} 配置 ${type}.img 失败！`)
        }
        const imgPath = path.join(this.kleeRootAbsPath,'Resource/Img/AppBotWork',config['img'])
        const msg = [segment.image(imgPath),text]
        if (type === 'start') {
            this.scheduleStartWork.cancel()
            this.scheduleStartWork = schedule.scheduleJob(cron,async () => {
                if (kleeDataYamlFile.getTimedWork() === 'off') {
                    kleeDataYamlFile.setWorkStatus('on')
                    await bot.sendMsgForAllGroup(msg)
                }
            })
        } else if (type === 'end') {
            this.scheduleEndWork.cancel()
            this.scheduleEndWork = schedule.scheduleJob(cron, async () => {
                if (kleeDataYamlFile.getTimedWork() === 'on') {
                    kleeDataYamlFile.setWorkStatus('off')
                    await bot.sendMsgForAllGroup(msg)
                }
            })
        } else {
            return null
        }
        return {
            type: type,
            hour: hour,
            minute: minute,
            second: second
        }
    }

    /**
     * 初始化每日工作任务
     */
    initWorkTask() {
        this.mkWorkTask('start')
        this.mkWorkTask('end')
    }
}

export { XAppBotWorkConfigYamlFile }