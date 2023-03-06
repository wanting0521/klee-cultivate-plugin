import { XApp } from '../../Model/App/XApp.js'
import { XSleep } from "../../Model/Sleep/XSleep.js"
import { XLog } from '../../Model/Log/XLog.js'
import { XConfigYamlFile } from '../../Model/File/YamlFile/ConfigYamlFile/XConfigYamlFile.js'
import fetch from "node-fetch"
import schedule from "node-schedule"
import { Group, segment } from "oicq"

const sleep = new XSleep()
const log = new XLog()
const configYamlFile = new XConfigYamlFile('fishCalendar')
let config = configYamlFile.getConfig('fishCalendar','usr')
if ( !config ) {
    log.error('[摸鱼日历] 读取用户配置失败')
}

class Calendar extends XApp {
    constructor() {
        super('example', 'fishCalendar','获取摸鱼日历','message')
    }

    async news(e) {
        if (await this.canUseFnc(0)) {
        this.pushNews(e)
        }else {
        return true
        }
    }

    /**
     * 推送日历
     * @param e oicq传递的事件参数e
     */
    async pushNews(e) {
    // e.msg 用户的命令消息
    if (e.msg) {
        log.info(e.msg)
    }
  
    // 摸鱼人日历接口地址
    let url = await fetch("https://api.vvhan.com/api/moyu?type=json").catch(
      (err) => logger.error(err)
    )
    let imgUrl = await url.json()
    const res = await imgUrl.url
  
    // 判断接口是否请求成功
    if (!res) {
        log.error("[摸鱼日历] 接口请求失败")
    }
  
    // 回复消息
    if (e instanceof Group) {
      e.sendMsg(segment.image(res))
    } else {
      e.reply(segment.image(res))
    }
  }
  
  /**
   * 定时任务
   */
   autoTask() {
    if (config.isAutoPush) {
      schedule.scheduleJob(config.time, () => {
        log.info(`[摸鱼人日历]：开始自动推送...`)
        for (var i = 0; i < config.groupList.length; i++) {
          let group = Bot.pickGroup(config.groupList[i])
          this.pushNews(group)
          sleep.sleep(1000)
        }
      })
    }
  }
  
}
export { Calendar }
