import { klee } from '../klee.js'
import { XkleeConfigYamlFile } from '../File/YamlFile/ConfigYamlFile/XkleeConfigYamlFile.js'
import { XTime } from '../Time/XTime.js'
import cfg from '../../../../lib/config/config.js'
import schedule from 'node-schedule'

const kleeConfigYamlFile = new XkleeConfigYamlFile()
const time = new XTime()

/** 机器人类 */
class XBot extends klee {
    /** 群聊中的别名 */
    botAlias

    constructor() {
        super()
    }

    /**
     * 名字
     * @return { String }
     */
    get botName() {
        return kleeConfigYamlFile.getUsrBotName()
    }

    /**
     * 给第一主人发消息
     * @param msg 消息
     */
    async sendMsgForFirstMaster(msg) {
        await Bot.pickFriend(Number(cfg.masterQQ[0])).sendMsg(msg)
    }

    /**
     * 发消息给所有群聊
     * @param msg 消息
     */
    async sendMsgForAllGroup(msg) {
        const groups = Array.from(Bot.gl)
        let groupQQs = []
        for (const group of groups) {
            groupQQs.push(group[0])
        }
        const currentTime = time.getCurrentTime()
        let workTime = {hour: currentTime.hour,minute: currentTime.minute,second: currentTime.second}
        for (const groupQQ of groupQQs) {
            workTime = time.setSecond(workTime,10)
            const cron = `${workTime.second} ${workTime.minute} ${workTime.hour} * * ?`
            schedule.scheduleJob(cron,async() => {
                await Bot.pickGroup(groupQQ).sendMsg(msg)
            })
        }
    }
}

export { XBot }