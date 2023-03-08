import { XkleeDataYamlFile } from './Model/File/YamlFile/DataYamlFile/XkleeDataYamlFile.js'
import { XLog } from './Model/Log/XLog.js'
import { XBot } from './Model/Bot/XBot.js'
import { XUser } from './Model/User/XUser.js'
import { XConfigYamlFile } from './Model/File/YamlFile/ConfigYamlFile/XConfigYamlFile.js'
import { XAppConfigYamlFile } from './Model/File/YamlFile/ConfigYamlFile/XAppConfigYamlFile.js'
import { XAppBotWorkConfigYamlFile } from './Model/File/YamlFile/ConfigYamlFile/XAppBotWorkConfigYamlFile.js'
import cfg from '../../lib/config/config.js'
import moment from 'moment'
import fs from 'fs'
import chalk from 'chalk'
import path from 'path'

const kleeDataYamlFile = new XkleeDataYamlFile()
const log = new XLog()
const bot = new XBot()
const ConfigYamlFile = new XConfigYamlFile('')
const AppConfigYamlFile = new XAppConfigYamlFile()
const WorkConfigYamlFile = new XAppBotWorkConfigYamlFile()

// 给第一主人发送可莉使用帮助
const version = bot.kleeCultivatePluginVersion
if (kleeDataYamlFile.isFirstUseklee()) {
    kleeDataYamlFile.initkleeStatusYamlFile()
    // 保存启动机器人时的时间戳
    kleeDataYamlFile.setRunTime(moment().format('YYYY-MM-DD HH:mm:ss'))
    // await bot.sendMsgForFirstMaster(`欢迎使用可莉插件v${version}\n【可莉使用帮助】https://docs.qq.com/doc/DZERCSERCZ09PdEl0`)
    // 初始化所有主人的用户信息
    for (const masterQQ of cfg.masterQQ) {
        // 不是好友：发送提示消息加好友
        const user = new XUser(Number(masterQQ))
        if (!user.isFriend()) {
            await log.warn(`姐姐 ${masterQQ} 还没有和${bot.botName}成为好朋友呢~`)
        }
        user.saveUsrInfo()
    }
}
// 版本变更更新配置
const currentVersion = kleeDataYamlFile.getVersion()
if (version !== currentVersion ) {
    if (kleeDataYamlFile.isFirstUseklee()) {
        ConfigYamlFile.initAllUsrCfg()
        AppConfigYamlFile.initUsrAppConfigYamlFile()
    } else {
        ConfigYamlFile.backupAllUsrCfg()
        ConfigYamlFile.initAllUsrCfg()
        AppConfigYamlFile.backupUsrAppConfigYaml()
        AppConfigYamlFile.initUsrAppConfigYamlFile()
    }
    kleeDataYamlFile.setVersion(version)
    kleeDataYamlFile.setIsFirstUseklee(false)
}
// 输出可莉信息
log.info(`~~~~~~~~~~~~~~~~~~~~ ${chalk.bold('QAQ')} ~~~~~~~~~~~~~~~~~~~~~`)
log.info(`~\t\t${chalk.yellow('欢迎使用可莉插件')}\t\t~`)
log.info(`~\t${chalk.green('版本')}\t${chalk.magenta(version)}\t\t\t\t~`)
log.info(`~\t${chalk.green('作者')}\t${chalk.blue('婉婷')}\t\t\t~`)
log.info(`~\t${chalk.green('基于雪儿插件二次开发，作者：雪儿不怕冷')}~`)
log.info(`~\t${chalk.green('交流群')}\t1063837198\t\t\t~`)
log.info(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`)

const AppResPath = './App'
const AppAbsPath = path.join(bot.kleeRootAbsPath,'App')
let appsModels = fs.readdirSync(AppAbsPath)
let appFiles = []
let ret = []
for (let i of appsModels) {
    if (i.endsWith('.js')) {
        appFiles.push(i)
        ret.push(import(`${AppResPath}/${i}`))
    } else {
        let appModelFiles = fs.readdirSync(`${AppAbsPath}/${i}`)
        for (let j of appModelFiles) {
            if (j.endsWith('.js')) {
                appFiles.push(`${i}/${j}`)
                ret.push(import(`${AppResPath}/${i}/${j}`))
            }
        }
    }
}
ret = await Promise.allSettled(ret)

let apps = {}
for (let i = 0; i < appFiles.length; i++) {
    const name = appFiles[i].replace('.js', '')
    if (ret[i].status !== 'fulfilled') {
        log.error(`加载功能出错啦：${chalk.yellow(name)}\n${ret[i].reason}`)
        continue
    }
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}

if (kleeDataYamlFile.getTimedWork() === 'on') {
    WorkConfigYamlFile.initWorkTask()
}

export { apps }