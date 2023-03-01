import { XApp } from '../../Model/App/XApp.js'
import { XkleeConfigYamlFile } from '../../Model/File/YamlFile/ConfigYamlFile/XkleeConfigYamlFile.js'
import { XPuppeteer } from '../../Model/Puppeteer/XPuppeteer.js'
import { XImgDataRender } from '../../Model/Render/XImgDataRender.js'
import { XUser } from '../../Model/User/XUser.js'
import { XAppBotStatusConfigYamlFile } from '../../Model/File/YamlFile/ConfigYamlFile/XAppBotStatusConfigYamlFile.js'
import { XLog } from '../../Model/Log/XLog.js'
import { XkleeDataYamlFile } from '../../Model/File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import { XTime } from '../../Model/Time/XTime.js'
import cfg from '../../../../lib/config/config.js'
import lodash from 'lodash'

const kleeConfigYamlFile = new XkleeConfigYamlFile()
const puppeteer = new XPuppeteer()
const statusConfigYamlFile = new XAppBotStatusConfigYamlFile()
const log = new XLog()
const kleeDataYamlFile = new XkleeDataYamlFile()
const time = new XTime()

/** 状态 */
class Status extends XApp {
    constructor() {
        super('Bot','status','机器人状态','message')
    }

    /**
     * 查看机器人身份证信息
     */
    async viewBotIDCard(e) {
        if (await this.canUseFnc(0)) {
            const bot = new XUser(Bot.uin)
            const master = new XUser(Number(cfg.masterQQ[0]))
            let botID = statusConfigYamlFile.getUsrSubConfig('ID','BotStatus')
            if (!statusConfigYamlFile.isBotID()) {
                log.info('由于机器人编号未设置正确，系统已生成随机的机器人编号')
                botID = statusConfigYamlFile.generateBotID()
                statusConfigYamlFile.setUsrSubConfig('ID',botID,'BotStatus')
            }
            let botBirthday = statusConfigYamlFile.getUsrSubConfig('birthday','BotStatus')
            if (!statusConfigYamlFile.isBotBirthday()) {
                log.info('机器人生日不满足格式 YYYY-MM-DD HH:mm:ss，系统已将上次启动机器人的时间设定为生日')
                botBirthday = kleeDataYamlFile.getRunTime()
                statusConfigYamlFile.setUsrSubConfig('birthday',botBirthday,'BotStatus')
            }
            const birthdayTime = new Date(botBirthday)
            const currentTime = new Date()
            const timeDifference = time.calculateTimeDifference(birthdayTime,currentTime)
            const botWorkTime = `${timeDifference.day} 天 ${timeDifference.hour} 时 ${timeDifference.minute} 分 ${timeDifference.second} 秒`
            let botLabels = statusConfigYamlFile.getUsrSubConfig('botLabel','BotStatus')
            if (!botLabels || !lodash.isArray(botLabels)) {
                log.error(`获取 ${statusConfigYamlFile.getUsrFilePath('BotStatus')} botLabel 失败，已设成默认`)
                botLabels = ['Yunzai-Bot','kleePlugin','原神','可可爱爱']
                statusConfigYamlFile.setUsrSubConfig('botLabel',botLabels,'BotStatus')
            }
            if (botLabels.length < 4) {
                const botLabelsNum = botLabels.length
                for (let i = botLabelsNum - 1; i < 4; i++) {
                    botLabels.push('')
                }
            }
            if (botLabels.length > 4) {
                log.warn('由于设置的机器人标签数大于4，多余部分将忽略')
            }
            let masterLabels = statusConfigYamlFile.getUsrSubConfig('masterLabel','BotStatus')
            if (!masterLabels || !lodash.isArray(masterLabels)) {
                log.error(`获取 ${statusConfigYamlFile.getUsrFilePath('BotStatus')} masterLabel 失败，已设成默认`)
                masterLabels = ['Yunzai-Bot','kleePlugin','原神','好人','善良']
                statusConfigYamlFile.setUsrSubConfig('masterLabel',masterLabels,'BotStatus')
            }
            if (masterLabels.length < 5) {
                const masterLabelsNum = masterLabels.length
                for (let i = masterLabelsNum - 1; i < 5; i++) {
                    masterLabels.push('')
                }
            }
            if (masterLabels.length > 5) {
                log.warn('由于设置的主人标签数大于5，多余部分将忽略')
            }
            const htmlData = {
                botAvatarUrl: bot.oicq.getAvatarUrl(),
                masterAvatarUrl: master.oicq.getAvatarUrl(),
                botID: botID,
                botBirthday: botBirthday,
                botWorkTime: botWorkTime,
                botLabel: botLabels,
                masterNickName: master.oicq.asFriend().nickname,
                masterQQ: master.oicq.user_id,
                masterLabel: masterLabels
            }
            const render = new XImgDataRender('AppBotStatus','BotIDCard')
            const data = render.renderImgData(htmlData)
            const img = await puppeteer.cache('AppBotStatus',data)
            await this.reply([`呐~这是${this.botName}的身份证哦~`,img])
            return true
        }
        return true
    }


    /**
     * 查看机器人状态
     */
    async viewBotStatus(e) {
        if (await this.canUseFnc(0)) {

        }
        return true
    }

    /**
     * 设置机器人名字
     */
    async setBotName(e) {
        if (await this.canUseFnc(0)) {
            const newBotName = this.getEffectiveContent(this.getCurrentFncRegKey(),'#',e.msg)
            if (!newBotName) {
                await this.reply('你要设置成什么？')
                return true
            }
            const botName = kleeConfigYamlFile.getUsrBotName()
            if (newBotName === botName) {
                await this.reply(`姐姐我就是 ${botName}`)
                return true
            }
            if (kleeConfigYamlFile.setUsrBotName(newBotName)) {
                await this.reply('这个名字我喜欢，嘻嘻，谢谢姐姐~')
                return true
            }
            await this.reply('设置失败！报错了！')
            return true
        }
        return true
    }
}

export { Status }