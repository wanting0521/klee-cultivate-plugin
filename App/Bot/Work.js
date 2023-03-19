import { XApp } from '../../Model/App/XApp.js'
import { XAppBotWorkConfigYamlFile } from '../../Model/File/YamlFile/ConfigYamlFile/XAppBotWorkConfigYamlFile.js'
import { XPuppeteer } from '../../Model/Puppeteer/XPuppeteer.js'
import { XImgDataRender } from '../../Model/Render/XImgDataRender.js'
import { XkleeDataYamlFile } from '../../Model/File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import { XLog } from '../../Model/Log/XLog.js'

const log = new XLog()
const kleeDataYamlFile = new XkleeDataYamlFile()
const WorkConfigYamlFile = new XAppBotWorkConfigYamlFile()
const puppeteer = new XPuppeteer()

/** 工作 */
class Work extends XApp {
    constructor() {
        super('Bot','work','管理机器人的工作','message')
    }

    /**
     * 处理消息
     */
    async dealMsg(e) {
        this.initUsrQQAndGroupQQ(0)
        // 是该功能中的指令：处理
        for (const r in this.rule) {
            // 跳过本指令
            if (!this.rule.hasOwnProperty(r) || this.rule[r]['fnc'] === 'dealMsg') {
                continue
            }
            const reg = new RegExp(this.rule[r]['reg'])
            if (reg.test(e.msg)) {
                return false
            }
        }
        // 不工作：不处理
        return kleeDataYamlFile.getWorkStatus() === 'off'
    }

    /**
     * 查看工作情况
     */
    async viewWorkStatus(e) {
        if (await this.canUseFnc(0)) {
            let workStatus = kleeDataYamlFile.getWorkStatus()
            if (workStatus === 'on') {
                workStatus = '努力工作中'
            } else {
                workStatus = '正在休息中'
            }
            let workTime = WorkConfigYamlFile.getUsrSubConfig('start','Config')['time']
            let relaxTime = WorkConfigYamlFile.getUsrSubConfig('end','Config')['time']
            if (kleeDataYamlFile.getTimedWork() === 'off') {
                workTime = '---------'
                relaxTime = '---------'
            }
            const htmlData = {
                workStatus: workStatus,
                workTime: workTime,
                relaxTime: relaxTime,
            }
            const render = new XImgDataRender('AppBotWork','WorkStatus')
            const data = render.renderImgData(htmlData)
            const img = await puppeteer.cache('AppBotWork',data)
            await this.reply(img)
            return true
        } else {
            return true
        }
    }

    /**
     * 开始工作
     */
    async startWork(e) {
        if (await this.canUseFnc(0)) {
            if (kleeDataYamlFile.getWorkStatus() === 'on') {
                await this.reply(`${this.botName}已经不在家里了呢~可能已经在工作啦~`)
                return true
            } else {
                kleeDataYamlFile.setWorkStatus('on')
                await this.reply(`${this.botName}悄悄的溜出了禁闭室~冲鸭~`)
                return true
            }
        } else {
            return true
        }
    }

    /**
     * 结束工作
     */
    async endWork(e) {
        if (await this.canUseFnc(0)) {
            if (kleeDataYamlFile.getWorkStatus() === 'off') {
                return true
            } else {
                kleeDataYamlFile.setWorkStatus('off')
                await this.reply(`${this.botName}不知道去哪里玩去啦~`)
                return true
            }
        } else {
            return true
        }
    }

    /**
     * 开启定时工作
     */
    async openTimedWork(e) {
        if (await this.canUseFnc(0)) {
            if (kleeDataYamlFile.getTimedWork() === 'on') {
                await this.reply('已开启~')
                WorkConfigYamlFile.initWorkTask()
                return true
            } else {
                kleeDataYamlFile.setTimedWork('on')
                await this.reply('开启成功！')
                return true
            }
        } else {
            return true
        }
    }

    /**
     * 关闭定时工作
     */
    async endTimedWork(e) {
        if (await this.canUseFnc(0)) {
            if (kleeDataYamlFile.getTimedWork() === 'off') {
                await this.reply('已关闭~')
                return true
            } else {
                kleeDataYamlFile.setTimedWork('off')
                await this.reply('关闭成功！')
                return true
            }
        } else {
            return true
        }
    }
        /**
     * 晚安
     */
        async goodNight(e) {
            log.warn(e.toString())
            if (await this.canUseFnc(0)) {
                if (kleeDataYamlFile.getWorkStatus() !== 'off') {
                    await this.reply(`${this.botName}还没有到睡觉时间哦~`)
                    return true
                } else {
                    await this.reply(`你也要晚安吖`)
                    return true
                }
            } else {
                return true
            }
        }
}

export { Work }